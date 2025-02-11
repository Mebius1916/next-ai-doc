import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
  title: string;
}
export const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
  title,
}: ToolbarButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={cn(
          "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
          isActive && "bg-neutral-200/80"
        )}
      >
        <Icon className="size-4" />
      </button>
    </div>
  );
};
