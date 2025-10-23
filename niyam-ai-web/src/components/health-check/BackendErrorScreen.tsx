import React, { FC, MouseEventHandler } from "react";

/**
 * Error screen component shown when backend is unavailable
 */

interface BackendErrorScreenProps {
  onRetry: () => Promise<boolean>;
}

const BackendErrorScreen: FC<BackendErrorScreenProps> = ({ onRetry }) => {
  const handleRetry: MouseEventHandler<HTMLButtonElement> = () => {
    onRetry().catch((error) => {
      console.error("Retry failed:", error);
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-600">Backend Unavailable</h2>
        <p className="text-neutral-300">
          Unable to connect to backend services
        </p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default BackendErrorScreen;
