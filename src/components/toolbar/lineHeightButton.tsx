import { ListCollapseIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";

export const LineHeightButton = () => {
  const { editor } = useEditorStore();
  const listHeights = [
    {label:"Default",value:"normal"},
    {label:"Single",value:"1"},
    {label:"1.15",value:"1.15"},
    {label:"1.5",value:"1.5"},
    {label:"Double",value:"2"},
  ];
  return (
    <div className="flex flex-col items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            title="Align"
            className="text-sm h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
          >
            <ListCollapseIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0">
          {listHeights.map(({ label, value }) => (
            <button
              key={value}
              title={label}
              onClick={() => editor?.chain().focus().setLineHeight(value).run()}
              type="button"
              className={cn(
                "w-full flex items-center gap-x-2 px-1 py-1 rounded-sm hover:bg-neutral-200/80" ,
                editor?.getAttributes("paragraph")?.lineHeight === value && "bg-neutral-200/80"
              )}
            >
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
