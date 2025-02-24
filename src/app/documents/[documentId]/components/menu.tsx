"use client";
import {
  Menubar,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarSub,
  MenubarMenu,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/ui/menubar";
import {
  Save,
  File,
  Plus,
  Table,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Undo,
  Redo,
  Code,
  Quote,
  FilePenLine,
  BetweenHorizontalStart,
  SlidersVertical,
} from "lucide-react";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Editor } from "@tiptap/core";
import React from "react";

interface EditorMenuProps {
  data: Doc<"documents">;
  editor: Editor | null;
  onNewDocument: () => void;
  insertTable: (rows: number, cols: number) => void;
}

export const EditorMenu = React.memo(({
  data,
  editor,
  onNewDocument,
  insertTable,
}: EditorMenuProps) => {
  const onSaveJSON = () => {
    if (!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], {
      type: "application/json",
    });
    downloadFile(blob, `${data.title}.json`);
  };
  //保存html
  const onSaveHTML = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], {
      type: "text/html",
    });
    downloadFile(blob, `${data.title}.html`);
  };

  //保存txt
  const onSaveText = () => {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], {
      type: "text/plain",
    });
    downloadFile(blob, `${data.title}.txt`);
  };

  //下载文件
  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-1 data-[state=open]:bg-transparent focus:bg-transparent focus-visible:ring-0">
          <File className="h-4 w-4" />
          File
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onNewDocument}>
            <Plus className="mr-2 h-4 w-4" />
            New
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <Save className="mr-2 h-4 w-4" />
              Save As
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onClick={onSaveJSON}>JSON</MenubarItem>
              <MenubarItem onClick={onSaveHTML}>HTML</MenubarItem>
              <MenubarItem onClick={onSaveText}>Text</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="data-[state=open]:bg-transparent focus:bg-transparent focus-visible:ring-0">
          <FilePenLine className="mr-2 h-4 w-4" />
          Edit
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
          >
            <Undo className="mr-2 h-4 w-4" />
            Undo
          </MenubarItem>
          <MenubarItem
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
          >
            <Redo className="mr-2 h-4 w-4" />
            Redo
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="data-[state=open]:bg-transparent focus:bg-transparent focus-visible:ring-0">
          <BetweenHorizontalStart className="mr-2 h-4 w-4" />
          Insert
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => insertTable(3, 3)}>
            <Table className="mr-2 h-4 w-4" />
            Table
          </MenubarItem>
          <MenubarItem
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          >
            <Code className="mr-2 h-4 w-4" />
            Code Block
          </MenubarItem>
          <MenubarItem
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="mr-2 h-4 w-4" />
            Quote
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="data-[state=open]:bg-transparent focus:bg-transparent focus-visible:ring-0">
          <SlidersVertical className="mr-2 h-4 w-4" />
          Format
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive("bold") ? "bg-accent" : ""}
          >
            <Bold className="mr-2 h-4 w-4" />
            Bold
          </MenubarItem>
          <MenubarItem
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={editor?.isActive("italic") ? "bg-accent" : ""}
          >
            <Italic className="mr-2 h-4 w-4" />
            Italic
          </MenubarItem>
          <MenubarItem
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={editor?.isActive("strike") ? "bg-accent" : ""}
          >
            <Strikethrough className="mr-2 h-4 w-4" />
            Strike
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={editor?.isActive("bulletList") ? "bg-accent" : ""}
          >
            <List className="mr-2 h-4 w-4" />
            Bullet List
          </MenubarItem>
          <MenubarItem
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={editor?.isActive("orderedList") ? "bg-accent" : ""}
          >
            <ListOrdered className="mr-2 h-4 w-4" />
            Numbered List
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
});

EditorMenu.displayName = 'EditorMenu';
