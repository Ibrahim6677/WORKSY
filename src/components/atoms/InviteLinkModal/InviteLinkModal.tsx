import React, { useState } from 'react';
import { Copy, Check, ExternalLink, X } from 'lucide-react';

interface InviteLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteLink: string;
  workspaceName: string;
}

const InviteLinkModal: React.FC<InviteLinkModalProps> = ({
  isOpen,
  onClose,
  inviteLink,
  workspaceName
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteLink);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = inviteLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setCopySuccess(true);
      
      // Reset copy success state after 2 seconds
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Join ${workspaceName} workspace`,
        text: `You've been invited to join ${workspaceName} workspace`,
        url: inviteLink,
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      handleCopy();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            رابط دعوة مساحة العمل
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          شارك هذا الرابط مع أعضاء الفريق للانضمام إلى مساحة العمل <strong>{workspaceName}</strong>
        </p>
        
        <div className="bg-gray-50 border rounded-md p-3 mb-4">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-700 break-all flex-1">
              {inviteLink}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition ${
              copySuccess 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4" />
                تم النسخ!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                نسخ الرابط
              </>
            )}
          </button>
          
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            مشاركة
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-700">
            💡 هذا الرابط صالح لفترة محدودة ويمكن لأي شخص لديه الرابط الانضمام إلى مساحة العمل
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteLinkModal;
