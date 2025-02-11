"use client";

import { ChevronDownIcon } from "lucide-react";
import { useEditorStore } from "@/store/use-editor-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const fonts = [
  { label: "Arial", value: "Arial" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Georgia", value: "Georgia" },
  { label: "Verdana", value: "Verdana" },
];

export const FontFamilyButton = () => {
  const { editor } = useEditorStore(); //用于对当前编辑器进行设置

  return (
    <div className="flex flex-col items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            title="Select font family"
            type="button"
            className={cn(
              "h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
            )}
          >
            <span className="truncate">
              {editor?.getAttributes("textStyle").fontFamily || "Arial"}
            </span>
            <ChevronDownIcon className="ml-2 size-4 shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
          {fonts.map(({ label, value }) => (
            <button
              onClick={() => editor?.chain().focus().setFontFamily(value).run()}
              key={value}
              title="Select font family"
              type="button"
              className={cn(
                "w-full flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                editor?.getAttributes("textStyle").fontFamily === value &&
                  "bg-neutral-200/80"
              )}
              style={{ fontFamily: value }}
            >
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
