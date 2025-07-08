import React from "react";

const LoadingPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#6629DE] mb-6"></div>
    <h2 className="text-2xl font-semibold text-[#6629DE]">Loading, please wait...</h2>
  </div>
);

export default LoadingPage; 