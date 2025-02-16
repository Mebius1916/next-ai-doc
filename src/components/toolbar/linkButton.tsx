import { useEditorStore } from "@/store/use-editor-store";
import { useState } from "react";
import { Link2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";

export const LinkButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState("");
  //给选中文本设置链接属性
  const onChange = (href: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setValue("");
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <DropdownMenu
        //下拉菜单时提取当前所选文本的链接属性
        onOpenChange={(open) => {
          if (open) {
            setValue(editor?.getAttributes("link").href || "");
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <button
            title="Text Color"
            className="text-sm h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
          >
            <Link2Icon className="size-4" color="#A9A9A9"/>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
          <Input
            placeholder="https://example.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {/* 点击后触发默认事件关闭下拉菜单 */}
          <Button onClick={() => onChange(value)}>Apply</Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
