import type { Middleware } from '@reduxjs/toolkit';

const logger: Middleware = (store) => (next) => (action: any) => {
  if (process.env.NODE_ENV === 'development') {
    // console.group(`🚀 Action: ${action.type}`);
    // console.log('📤 Dispatching:', action);
    // console.log('📊 Previous state:', store.getState());
    
    const result = next(action);
    
    // console.log('📈 Next state:', store.getState());
    console.groupEnd();
    
    return result;
  }
  
  return next(action);
};

export default logger;
