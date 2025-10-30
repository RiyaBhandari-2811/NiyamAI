import React from "react";

const AnimatedDots = () => {
  const colors = ["bg-primary", "bg-primary/80", "bg-primary/60"];
  const delays = [0, 150, 300];

  return (
    <div className="flex items-center justify-center gap-1.5">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`w-2.5 h-2.5 rounded-full animate-bounce ${color}`}
          style={{ animationDelay: `${delays[index]}ms` }}
        />
      ))}
    </div>
  );
};

export default AnimatedDots;
