"use client";

import { ScrollText, Bot, CheckCircle, Zap } from "lucide-react";

/**
 * EmptyState - AI Goal Planner welcome screen
 * Extracted from ChatMessagesView empty state section
 * Displays when no messages exist in the current session
 */
const EmptyState: React.FC = () => {
  const features = [
    {
      icon: ScrollText,
      colorClasses: {
        bg: "bg-green-500/10",
        textIcon: "text-green-500",
        textTitle: "text-green-400",
      },
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
      title: "Create Tasks",
      description:
        "Auto-generate and push test-case tasks into your Jira account",
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center min-h-[60vh]">
      <div className="max-w-4xl w-full space-y-8">
        {/* Main header */}
        <div className="max-w-4xl w-full space-y-8">
          {/* Main header */}
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center space-x-3 max-w-fit font-bold bg-slate-300 rounded-xl mx-auto backdrop-blur-2xl px-2 py-1 shadow-sm">
              <Zap size={20} />
              <p className="text-sm text-slate-950 m-0 p-0 font-semibold">
                Your AI-Powered Healthcare Test Case Generator
              </p>
            </div>
            <p className="text-2xl text-slate-400 max-w-2xl mx-auto font-medium">
              Transform your healthcare testing goals into actionable plans with
              intelligent PRD analysis, automated reviews, and structured task
              creation to accelerate success.
            </p>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {features.map(({ icon: Icon, colorClasses, title, description }) => (
            <div key={title} className="space-y-3 text-center">
              <div
                className={`w-12 h-12 ${colorClasses.bg} rounded-xl flex items-center justify-center mx-auto`}
              >
                <Icon className={`w-6 h-6 ${colorClasses.textIcon}`} />
              </div>
              <h3 className={`font-semibold ${colorClasses.textTitle}`}>
                {title}
              </h3>
              <p className="text-sm text-neutral-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
