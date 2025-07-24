// Google OAuth configuration
export const GOOGLE_OAUTH_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin + '/auth/google/callback',
  SCOPE: 'https://www.googleapis.com/auth/calendar.readonly',
  RESPONSE_TYPE: 'code',
  ACCESS_TYPE: 'offline',
  PROMPT: 'consent',
};

export interface GoogleAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

class GoogleAuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number | null = null;

  // Generate Google OAuth URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
      redirect_uri: GOOGLE_OAUTH_CONFIG.REDIRECT_URI,
      scope: GOOGLE_OAUTH_CONFIG.SCOPE,
      response_type: GOOGLE_OAUTH_CONFIG.RESPONSE_TYPE,
      access_type: GOOGLE_OAUTH_CONFIG.ACCESS_TYPE,
      prompt: GOOGLE_OAUTH_CONFIG.PROMPT,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string): Promise<GoogleAuthTokens> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
          code,
          grant_type: 'authorization_code',
          redirect_uri: GOOGLE_OAUTH_CONFIG.REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const tokens: GoogleAuthTokens = await response.json();
      this.setTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw new Error('Authentication failed');
    }
  }

  // Set tokens and store them
  setTokens(tokens: GoogleAuthTokens) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token || null;
    this.expiresAt = Date.now() + (tokens.expires_in * 1000);

    // Store in localStorage for persistence
    localStorage.setItem('google_access_token', tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem('google_refresh_token', tokens.refresh_token);
    }
    localStorage.setItem('google_expires_at', this.expiresAt.toString());
  }

  // Load tokens from localStorage
  loadTokensFromStorage() {
    const accessToken = localStorage.getItem('google_access_token');
    const refreshToken = localStorage.getItem('google_refresh_token');
    const expiresAt = localStorage.getItem('google_expires_at');

    if (accessToken && expiresAt) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.expiresAt = parseInt(expiresAt);

      // Check if token is expired
      if (this.isTokenExpired()) {
        this.refreshAccessToken();
      }
    }
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    if (!this.expiresAt) return true;
    return Date.now() >= this.expiresAt - 60000; // Refresh 1 minute before expiry
  }

  // Refresh access token using refresh token
  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const tokens = await response.json();
      this.setTokens({
        ...tokens,
        refresh_token: this.refreshToken, // Keep existing refresh token
      });
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      throw new Error('Token refresh failed');
    }
  }

  // Get current access token
  async getAccessToken(): Promise<string | null> {
    if (!this.accessToken) return null;

    if (this.isTokenExpired()) {
      await this.refreshAccessToken();
    }

    return this.accessToken;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken && !this.isTokenExpired();
  }

  // Logout and clear tokens
  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;

    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    localStorage.removeItem('google_expires_at');
  }

  // Start OAuth flow with popup
  initiateAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      const authUrl = this.getAuthUrl();
      
      try {
        // Open popup window
        const popup = window.open(
          authUrl,
          'googleAuth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        if (!popup) {
          // Fallback to redirect if popup is blocked
          console.warn('Popup blocked, falling back to redirect');
          window.location.href = authUrl;
          return;
        }

        // Check for popup completion
        const checkClosed = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(checkClosed);
              // Check if we got tokens (callback might have set them)
              if (this.isAuthenticated()) {
                resolve();
              } else {
                reject(new Error('Authentication was cancelled or failed'));
              }
            }
          } catch (error) {
            // Handle cross-origin errors gracefully
            console.warn('Cross-origin error checking popup status:', error);
          }
        }, 1000);

        // Handle popup messages
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          try {
            if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
              clearInterval(checkClosed);
              popup.close();
              window.removeEventListener('message', handleMessage);
              resolve();
            } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
              clearInterval(checkClosed);
              popup.close();
              window.removeEventListener('message', handleMessage);
              reject(new Error(event.data.error || 'Authentication failed'));
            }
          } catch (error) {
            console.error('Error handling message:', error);
          }
        };

        window.addEventListener('message', handleMessage);

        // Timeout after 5 minutes
        setTimeout(() => {
          try {
            if (!popup.closed) {
              popup.close();
              clearInterval(checkClosed);
              window.removeEventListener('message', handleMessage);
              reject(new Error('Authentication timeout'));
            }
          } catch (error) {
            console.warn('Error during timeout cleanup:', error);
          }
        }, 5 * 60 * 1000);
        
      } catch (error) {
        console.error('Error initiating auth:', error);
        // Fallback to redirect if popup fails
        window.location.href = authUrl;
      }
    });
  }

  // Handle OAuth callback
  async handleCallback(code: string) {
    try {
      const tokens = await this.exchangeCodeForTokens(code);
      return tokens;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const googleAuthService = new GoogleAuthService();

// Initialize on app start
googleAuthService.loadTokensFromStorage();
