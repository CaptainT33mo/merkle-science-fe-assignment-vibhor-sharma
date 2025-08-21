import { type ReactNode } from "react";

interface ActionButtonProps {
  onClick: () => void;
  title: string;
  ariaLabel: string;
  children: ReactNode;
  hoverColor?: "green" | "red" | "blue" | "purple";
  className?: string;
}

const ActionButton = ({
  onClick,
  title,
  ariaLabel,
  children,
  hoverColor = "blue",
  className = ""
}: ActionButtonProps) => {
  const getHoverClasses = () => {
    switch (hoverColor) {
      case "green":
        return "hover:text-green-600 hover:bg-green-50 focus:ring-green-500";
      case "red":
        return "hover:text-red-600 hover:bg-red-50 focus:ring-red-500";
      case "blue":
        return "hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-500";
      case "purple":
        return "hover:text-purple-600 hover:bg-purple-50 focus:ring-purple-500";
      default:
        return "hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-500";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 text-white md:text-gray-500 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${getHoverClasses()} ${className}`}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default ActionButton;
