import { HTMLAttributes } from "react";

type Difficulty = "简单" | "中等" | "困难" | "极难";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "difficulty" | "priority";
  value?: string;
  difficulty?: Difficulty;
  priority?: "critical" | "required" | "recommended" | "optional";
}

export default function Badge({
  variant = "difficulty",
  value,
  difficulty,
  priority,
  className = "",
  ...props
}: BadgeProps) {
  const difficultyColors: Record<Difficulty, string> = {
    简单: "bg-difficulty-easy-bg text-difficulty-easy",
    中等: "bg-difficulty-medium-bg text-difficulty-medium",
    困难: "bg-difficulty-hard-bg text-difficulty-hard",
    极难: "bg-difficulty-expert-bg text-difficulty-expert",
  };

  const priorityColors = {
    critical: "bg-red-100 text-red-700",
    required: "bg-priority-required-bg text-priority-required",
    recommended: "bg-priority-recommended-bg text-priority-recommended",
    optional: "bg-priority-optional-bg text-priority-optional",
  };

  const priorityLabels = {
    critical: "关键",
    required: "必备",
    recommended: "推荐",
    optional: "可选",
  };

  if (variant === "difficulty" && difficulty) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${difficultyColors[difficulty]} ${className}`}
        {...props}
      >
        {difficulty}
      </span>
    );
  }

  if (variant === "priority" && priority) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${priorityColors[priority]} ${className}`}
        {...props}
      >
        {priorityLabels[priority]}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 ${className}`}
      {...props}
    >
      {value}
    </span>
  );
}
