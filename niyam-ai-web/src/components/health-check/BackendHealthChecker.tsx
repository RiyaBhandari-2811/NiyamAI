import React from "react";
import BackendLoadingScreen from "./BackendLoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import { useBackendHealth } from "@/hooks/useBackendHealth";

interface BackendHealthCheckerProps {
  onHealthStatusChange?: (isHealthy: boolean, isChecking: boolean) => void;
  children?: React.ReactNode;
}

/**
 * Backend health monitoring wrapper
 * Displays a themed loading or error state until backend is ready
 */
const BackendHealthChecker: React.FC<BackendHealthCheckerProps> = ({
  onHealthStatusChange,
  children,
}) => {
  const { isBackendReady, isCheckingBackend, checkBackendHealth } =
    useBackendHealth();

  React.useEffect(() => {
    if (onHealthStatusChange) {
      onHealthStatusChange(isBackendReady, isCheckingBackend);
    }
  }, [isBackendReady, isCheckingBackend, onHealthStatusChange]);

  // Themed background container for all backend states
  const ThemedContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pointer-events-none"></div>
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-6 py-10">
        {children}
      </div>
    </div>
  );

  if (isCheckingBackend) {
    return (
      <ThemedContainer>
        <BackendLoadingScreen />
      </ThemedContainer>
    );
  }

  if (!isBackendReady) {
    return (
      <ThemedContainer>
        <BackendErrorScreen onRetry={checkBackendHealth} />
      </ThemedContainer>
    );
  }

  return <>{children}</>;
};

export default BackendHealthChecker;
