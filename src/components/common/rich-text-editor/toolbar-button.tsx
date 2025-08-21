import { type ReactNode } from "react";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: ReactNode;
  className?: string;
}

const ToolbarButton = ({
  onClick,
  isActive = false,
  title,
  children,
  className = ""
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`toolbar-button ${isActive ? "bg-gray-200" : ""} ${className}`}
      title={title}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
