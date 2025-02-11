import { useEditorStore } from "@/store/use-editor-store";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { type ColorResult, SketchPicker } from "react-color";
export const TextColorbutton = () => {
  const { editor } = useEditorStore();
  const value = editor?.getAttributes("textStyle").color || "#000000";
  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            title="Text Color"
            className="text-sm h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
          >
            <span className="text-xs">A</span>
            <div
              className="h-0.5 w-full"
              style={{ backgroundColor: value }}
            ></div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0">
          <SketchPicker color={value} onChange={onChange} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
