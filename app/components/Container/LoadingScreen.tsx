import React from "react";

function LoadingScreen() {
  return (
    <>
      <div className="flex justify-center items-center mt-4 w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </>
  );
}

export default LoadingScreen;
