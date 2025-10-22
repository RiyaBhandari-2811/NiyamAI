import React from "react";
import BackendLoadingScreen from "./BackendLoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import { useBackendHealth } from "@/hooks/useBackendHealth";

interface BackendHealthCheckerProps {
  onHealthStatusChange?: (isHealthy: boolean, isChecking: boolean) => void;
  children?: React.ReactNode;
}

/**
 * Backend health monitoring component that displays appropriate states
 * Uses the useBackendHealth hook for monitoring and retry logic
 */
const BackendHealthChecker: React.FC<BackendHealthCheckerProps> = ({
  onHealthStatusChange,
  children,
}) => {
  const { isBackendReady, isCheckingBackend, checkBackendHealth } =
    useBackendHealth();

  // Notify parent of health status changes
  React.useEffect(() => {
    if (onHealthStatusChange) {
      onHealthStatusChange(isBackendReady, isCheckingBackend);
    }
  }, [isBackendReady, isCheckingBackend, onHealthStatusChange]);

  // Show loading screen while checking backend
  if (isCheckingBackend) {
    return <BackendLoadingScreen />;
  }

  // Show error screen if backend is not ready
  if (!isBackendReady) {
    return <BackendErrorScreen onRetry={checkBackendHealth} />;
  }

  // Render children if backend is ready
  return <>{children}</>;
};

export default BackendHealthChecker;
