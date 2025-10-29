import React from "react";
import AnimatedDots from "../loaders/AnimatedDots";
import AnimatedSpinner from "../loaders/AnimatedSpinner";

const BackendLoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="w-full max-w-xl z-10 rounded-2xl border border-border bg-card/80 backdrop-blur-md p-8 shadow-lg">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
            ⚡ AI-Powered Healthcare Test Case Generator ⚡
          </h1>

          <div className="flex flex-col items-center gap-4">
            <AnimatedSpinner />

            <div className="space-y-1">
              <p className="text-base text-muted-foreground">
                Waiting for backend to be ready...
              </p>
              <p className="text-xs text-muted-foreground/80">
                This may take a moment on first startup
              </p>
            </div>

            <AnimatedDots />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendLoadingScreen;
