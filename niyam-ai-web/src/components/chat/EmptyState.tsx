"use client";

import React, { useState } from "react";
import { ScrollText, Bot, CheckCircle } from "lucide-react";

const EmptyState: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      icon: ScrollText,
      colorClasses: {
        bg: "bg-green-500/10",
        textIcon: "text-green-500",
        textTitle: "text-green-400",
      },
      hoverBgColor: "rgba(16,185,129,0.08)", // green hover bg
      shadowColor: "rgba(16,185,129,0.28)",
      title: "Upload PRD",
      description:
        "Share the Product Requirement Document for test-case generation",
    },
    {
      icon: Bot,
      colorClasses: {
        bg: "bg-blue-500/10",
        textIcon: "text-blue-500",
        textTitle: "text-blue-400",
      },
      hoverBgColor: "rgba(59,130,246,0.08)", // blue hover bg
      shadowColor: "rgba(59,130,246,0.28)",
      title: "AI Review",
      description: "Agent analyzes PRD, and drafts scenarios",
    },
    {
      icon: CheckCircle,
      colorClasses: {
        bg: "bg-purple-500/10",
        textIcon: "text-purple-500",
        textTitle: "text-purple-400",
      },
      hoverBgColor: "rgba(139,92,246,0.08)", // purple hover bg
      shadowColor: "rgba(139,92,246,0.28)",
      title: "Create Tasks",
      description:
        "Auto-generate and push test-case tasks into your Jira account",
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center  h-full ">
      <div className=" w-full space-y-8 h-full">
        {/* Main header */}
        <div className="space-y-6 text-center">
          <div className="p-3 flex items-center justify-center space-x-3 max-w-fit font-bold bg-slate-800 rounded-3xl mx-auto backdrop-blur-2xl shadow-sm">
            ⚡
            <p className=" text-sm text-slate-200 font-semibold">
              Your AI-Powered Healthcare Test Case Generator
            </p>
          </div>
          <p className="text-5xl text-slate-200 max-w-5xl mx-auto font-bold">
            Transform your healthcare testing goals into actionable plans
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            with intelligent PRD analysis, automated reviews, and structured
            task creation to accelerate success.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map(
            (
              {
                icon: Icon,
                colorClasses,
                title,
                description,
                hoverBgColor,
                shadowColor,
              },
              idx
            ) => {
              const isHovered = hoveredIndex === idx;
              const hoverStyle = isHovered
                ? {
                    border: `2px solid ${hoverBgColor}`,
                    boxShadow: `0 0 13px ${shadowColor}`,
                  }
                : {};

              return (
                <div
                  key={title}
                  className="group border border-slate-800 bg-slate-950/40 rounded-2xl p-6 transition-all duration-300 ease-in-out"
                  style={hoverStyle}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className={`w-15 h-15 ${colorClasses.bg} rounded-xl flex items-center justify-center mx-auto`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        colorClasses.textIcon
                      } transition-transform duration-300 ${
                        isHovered ? "scale-110" : ""
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-semibold ${colorClasses.textTitle} mt-4 text-lg`}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-neutral-400 mt-2">{description}</p>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
