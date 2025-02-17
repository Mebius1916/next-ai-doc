"use client";
import {
  useEditor,
  EditorContent,
  type Editor as TiptapEditor,
} from "@tiptap/react";
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
import { Ruler } from "./ruler";
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
// import { Threads } from "./threads";
import { useStorage } from "@liveblocks/react";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/lib/margin";
import { useDebounce } from "@/hooks/use-debounce";

interface EditorProps {
  initialContent?: string | undefined;
}
export const Editor = ({ initialContent }: EditorProps) => {
  //从room组件中设置的initialStorage里拿值
  const leftMargin = useStorage(
    (root: { leftMargin?: number }) => root.leftMargin ?? LEFT_MARGIN_DEFAULT
  );

  const rightMargin = useStorage(
    (root: { rightMargin?: number }) => root.rightMargin ?? RIGHT_MARGIN_DEFAULT
  );
  const liveblocks = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental: true, //离线支持
  });
  const { setEditor } = useEditorStore();

  // 在组件顶层定义防抖函数
  const debouncedSetEditor = useDebounce((editor: TiptapEditor) => {
    setEditor(editor);
  }, 500);

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
      debouncedSetEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      debouncedSetEditor(editor);
    },
    onTransaction({ editor }) {
      debouncedSetEditor(editor);
    },
    onFocus({ editor }) {
      //聚焦时，将编辑器设置到全局状态中
      debouncedSetEditor(editor);
    },
    onBlur({ editor }) {
      //失去焦点时，将编辑器设置到全局状态中
      debouncedSetEditor(editor);
    },
    onContentError({ editor }) {
      debouncedSetEditor(editor);
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none print:border-0 bg-white shadow-lg flex flex-col min-h-[1054px] w-[816px] py-10 pr-14 cursor-text print:shadow-none print:p-0 print:m-0 print:max-w-[190mm] print:min-h-[277mm]",
        style: `padding-left: ${leftMargin ?? LEFT_MARGIN_DEFAULT}px; padding-right:${rightMargin ?? RIGHT_MARGIN_DEFAULT}px;`,
      },
    },
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
    <div className="size-full overflow-x-auto px-4 print:bg-white print:overflow-visible print:m-0">
      <div className="flex justify-center w-[816px] min-h-[1054px] print:p-0 print:m-0 pb-4 mx-auto print:min-w-0 print:max-w-[190mm] print:min-h-[277mm]">
        <EditorContent editor={editor} />
        {/* <Threads editor={editor} /> */}
      </div>
    </div>
  );
};
