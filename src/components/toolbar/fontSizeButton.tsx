import {
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import { useEditorStore } from "@/store/use-editor-store";
import { useState, useEffect } from "react";

export const FontSizeButton = () => {
  const { editor } = useEditorStore();
  // 获取当前字体大小（去除px单位）
  const currentFontSize = editor?.getAttributes("textStyle").fontSize
    ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
    : "16";
  const [fontSize, setFontSize] = useState(currentFontSize);
  const [inputValue, setInputValue] = useState(currentFontSize);
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);// 将字符串转换为数字
    //状态更新
    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setInputValue(newSize);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const update = () => {
      const current = editor?.getAttributes("textStyle").fontSize || "16px";
      const newFontSize = current.replace("px", "");
      setFontSize(newFontSize);
      setInputValue(newFontSize);
      setIsEditing(false);
    };

    //订阅tiptap的selectionUpdate事件
    editor?.on("selectionUpdate", update);
    // 返回一个清理函数，用于在组件卸载时取消订阅
    return () => {
      editor?.off("selectionUpdate", update);
    };
  }, [editor]);

  // 在输入框输入内容时，更新输入框的值
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 在输入框失去焦点时，更新字体大小
  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  // 在输入框按下回车键时，更新字体大小
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    const newSize = parseInt(fontSize) + 1;
    updateFontSize(newSize.toString());
  };
  const decrement = () => {
    const newSize = parseInt(fontSize) - 1;
    updateFontSize(newSize.toString());
  };

  return (
    <div className="flex items-center gap-x-0.5">
      {/* 减号按钮 */}
      <button
        className="shrink-0 h-7 w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
        onClick={decrement}
        title="font size"
        type="button"
      >
        <MinusIcon className="size-4" />
      </button>
      {/* 输入框 */}
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="border border-neutral-400 text-center h-7 w-10 rounded-sm bg-transparent focus:outline-none focus:ring-0"
        />
      ) : (
        <button
          className="text-sm border border-neutral-400 text-center h-7 w-10 rounded-sm bg-transparent focus:outline-none focus:ring-0"
          onClick={() => {
            setIsEditing(true);
            setFontSize(currentFontSize);
          }}
          title="font size"
          type="button"
        >
          {currentFontSize}
        </button>
      )}
      {/* 加号按钮 */}
      <button
        className="shrink-0 h-7 w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
        onClick={increment}
        title="font size"
        type="button"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};
