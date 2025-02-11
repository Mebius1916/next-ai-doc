import {
  Undo2Icon,
  Redo2Icon,
  PrinterIcon,
  SpellCheckIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  MessageSquareIcon,
  ListTodoIcon,
  RemoveFormattingIcon,
  type LucideIcon,
} from "lucide-react";
import { Editor } from '@tiptap/react';

// 定义section项的类型
export interface ToolbarItem {
  label: string;
  icon: LucideIcon;
  onClick: (editor?: Editor) => void;
  isActive?: boolean;
  title: string;
}

export const getToolbarSections = (editor?: Editor): ToolbarItem[][] => [
  [
    {
      label: "Undo",
      icon: Undo2Icon,
      onClick: () => editor?.chain().focus().undo().run(),
      isActive: false,
      title: "Undo",
    },
    {
      label: "Redo",
      icon: Redo2Icon,
      onClick: () => editor?.chain().focus().redo().run(),
      isActive: false,
      title: "Redo",
    },
    {
      label: "Print",
      icon: PrinterIcon,
      onClick: () => {
        window.print();
      },
      title: "Print",
    },
    {
      label: "Spell Check",
      icon: SpellCheckIcon,
      onClick: () => {
        const current = editor?.view.dom.getAttribute("spellcheck");
        editor?.view.dom.setAttribute(
          "spellcheck",
          current === "true" ? "false" : "true"
        );
      },
      title: "Spell Check",
    },
  ],
  [
    {
      label: "Bold",
      icon: BoldIcon,
      isActive: typeof editor?.isActive === 'function' ? editor.isActive("bold") : false,
      onClick: () => editor?.chain().focus().toggleBold().run(),
      title: "Bold",
    },
    {
      label: "Italic",
      icon: ItalicIcon,
      isActive: typeof editor?.isActive === 'function' ? editor.isActive("italic") : false,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      title: "Italic",
    },
    {
      label: "Underline",
      icon: UnderlineIcon,
      isActive: editor?.isActive("underline"),
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
      title: "Underline",
    },
  ],
  [
    {
      label: "Comment",
      icon: MessageSquareIcon,
      onClick: () => {
        editor?.chain().focus().addPendingComment().run();
      },
      isActive: editor?.isActive("liveblocksCommentMark"),
      title: "Comment",
    },
    {
      label: "List Todo",
      icon: ListTodoIcon,
      onClick: () => {
        editor?.chain().focus().toggleTaskList().run();
      },
      isActive: editor?.isActive("taskList"),
      title: "List Todo",
    },
    {
      label: "Remove Formatting",
      icon: RemoveFormattingIcon,
      onClick: () => {
        editor?.chain().focus().unsetAllMarks().run();
      },
      title: "Remove Formatting",
    },
  ],
];