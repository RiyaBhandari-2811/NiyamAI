import React from "react";

const AnimatedDots = () => {
  const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500"];
  const delays = [0, 150, 300];

  return (
    <div className="flex space-x-1">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full animate-bounce ${color}`}
          style={{ animationDelay: `${delays[index]}ms` }}
        />
      ))}
    </div>
  );
};

export default AnimatedDots;
