import React from "react";

const AnimatedSpinner: React.FC = () => {
  return (
    <div className="relative">
      {/* Outer spinner */}
      <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />

      {/* Inner spinner (reverse rotation) */}
      <div
        className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-accent rounded-full animate-spin"
        style={{
          animationDirection: "reverse",
          animationDuration: "1.5s",
        }}
      />
    </div>
  );
};

export default AnimatedSpinner;
