"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import { useEditorStore } from "@/store/use-editor-store";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import { Highlight } from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
// import { Ruler } from "./ruler";
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
// import { Threads } from "./threads";
import { useStorage } from "@liveblocks/react";
import { ImageButton } from "@/components/toolbar/imageButton";
// import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margin";

interface EditorProps {
  initialContent?: string | undefined;
}
export const Editor = ({ initialContent }: EditorProps) => {
  // const leftMargin = useStorage(
  //   (root: { leftMargin?: number }) => root.leftMargin ?? LEFT_MARGIN_DEFAULT
  // );

  // const rightMargin = useStorage(
  //   (root: { rightMargin?: number }) => root.rightMargin ?? RIGHT_MARGIN_DEFAULT
  // );
  const liveblocks = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental: true,//离线支持
  });
  const { setEditor } = useEditorStore();
  const editor = useEditor({
    immediatelyRender: false, //不立即渲染
    // 创建编辑器时，将编辑器设置到全局状态中

    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      //事务更新时，将编辑器设置到全局状态中
      setEditor(editor);
    },
    onFocus({ editor }) {
      //聚焦时，将编辑器设置到全局状态中
      setEditor(editor);
    },
    onBlur({ editor }) {
      //失去焦点时，将编辑器设置到全局状态中
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none print:border-0 bg-white shadow-lg flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
        style: `padding-left: 56px; padding-right: 56px;`,
      },
    },
    // editorProps: {
    //   attributes: {
    //     class:
    //       "focus:outline-none print:border-0 bg-white shadow-lg flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
    //     style: `padding-left: ${leftMargin ?? LEFT_MARGIN_DEFAULT}px; padding-right:${rightMargin ?? RIGHT_MARGIN_DEFAULT}px;`,
    //   },
    // },
    extensions: [
      FontSizeExtension, //自定义字体大小扩展
      StarterKit.configure({
        history: false, //禁用以防止协同冲突
      }),
      liveblocks,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Color,
      Link.configure({
        // openOnClick:false,//链接点击后不会在新窗口打开
        autolink: true, //url会转化为可点击链接
        defaultProtocol: "https", //链接走https协议
      }),
      TextStyle,
      LineHeightExtension.configure({
        types: ["paragraph", "heading"],
      }),
      Table,
      Image,
      ImageResize,
      TableRow,
      TableCell,
      TableHeader,
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"], //当前设置表示只有 heading（标题）和 paragraph（段落）元素可以使用对齐功能
      }),
      TaskItem.configure({
        nested: true,
      }),
      TaskList,
    ],
  });
  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
      {/* <Ruler /> */}
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
        {/* <Threads editor={editor} /> */}
      </div>
    </div>
  );
};
