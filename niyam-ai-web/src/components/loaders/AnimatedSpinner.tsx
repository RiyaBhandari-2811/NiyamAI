import React from "react";

const AnimatedSpinner: React.FC = () => {
  return (
    <div className="relative">
      <div className="w-12 h-12 border-4 border-neutral-600 border-t-blue-500 rounded-full animate-spin"></div>
      <div
        className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin"
        style={{
          animationDirection: "reverse",
          animationDuration: "1.5s",
        }}
      ></div>
    </div>
  );
};

export default AnimatedSpinner;
