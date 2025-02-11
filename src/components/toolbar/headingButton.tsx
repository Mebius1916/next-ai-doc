"use client";

import { type Level } from "@tiptap/extension-heading";
import { ChevronDownIcon } from "lucide-react";
import { useEditorStore } from "@/store/use-editor-store";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const HeadingLevelButton = () => {
  const { editor } = useEditorStore();
  const headings = [
    { label: "Normal text", value: 0, fontSize: "16px" },
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "24px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
    { label: "Heading 4", value: 4, fontSize: "18px" },
    { label: "Heading 5", value: 5, fontSize: "16px" },
  ];

  const getCurrentHeading = () => {
    for (let level = 1; level <= 5; level++) {
      if (editor?.isActive(`heading`, { level })) {
        return `Heading ${level}`;
      }
    }
    return "Normal text";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-7 w-[120px] flex shrink-0 items-center justify-center rounded-sm hover:bg-neutral-200/80 overflow-hidden text-sm">
            <span className="truncate">{getCurrentHeading()}</span>
            <ChevronDownIcon className="ml-2 size-4 shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
          {headings.map(({ label, value, fontSize }) => (
            <button
              key={value}
              style={{ fontSize }}
              onClick={() => {
                if (value === 0) {
                  editor?.chain().focus().setParagraph().run();
                } else {
                  editor
                    ?.chain()
                    .focus()
                    .toggleHeading({ level: value as Level })
                    .run();
                }
              }}
              className={cn(
                "flex item-ccenter gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                (value === 0 && !editor?.isActive("heading")) ||
                  (editor?.isActive("heading", { level: value }) &&
                    "bg-neutral-200/80")
              )}
            >
              {label}
            </button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
