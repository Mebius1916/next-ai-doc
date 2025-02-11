import { useEditorStore } from "@/store/use-editor-store";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { type ColorResult, SketchPicker } from "react-color";
import { HighlighterIcon } from "lucide-react";
export const HighlightButton = () => {
  const { editor } = useEditorStore();
  const value = editor?.getAttributes("highlight").color || "#FFFFFFFF";
  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            title="Text Color"
            className="text-sm h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
          >
            <HighlighterIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0">
          <SketchPicker color={value} onChange={onChange} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
