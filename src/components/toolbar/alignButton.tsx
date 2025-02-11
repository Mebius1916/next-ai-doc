import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";

export const AlignButton = () => {
  const { editor } = useEditorStore();
  const alignments = [
    {
      label: "Align Left",
      icon: AlignLeftIcon,
      value: "left",
    },
    {
      label: "Align Center",
      icon: AlignCenterIcon,
      value: "center",
    },
    {
      label: "Align Right",
      icon: AlignRightIcon,
      value: "right",
    },
    {
      label: "Align Justify",
      icon: AlignJustifyIcon,
      value: "justify",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            title="Align"
            className="text-sm h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
          >
            <AlignLeftIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0">
          {alignments.map(({ label, icon: Icon, value }) => (
            <button
              key={value}
              title={label}
              onClick={() => editor?.chain().focus().setTextAlign(value).run()}
              className={cn(
                "w-full flex items-center gap-x-2 px-1 py-1 rounded-sm hover:bg-neutral-200/80",
                editor?.isActive({ textAlign: value }) && "bg-neutral-200/80"
              )}
            >
              <Icon className="size-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
