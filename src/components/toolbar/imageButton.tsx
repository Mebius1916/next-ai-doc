import { useEditorStore } from "@/store/use-editor-store";
import { useState } from "react";
import { ImageIcon, SearchIcon, UploadIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ImageButton = () => {
  const { editor } = useEditorStore();
  // 控制图片URL输入对话框的显示状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // 存储用户输入的图片URL
  const [imageUrl, setImageUrl] = useState("");

  // 在编辑器中插入图片的核心函数
  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
    setIsDialogOpen(false);
  };

  // 处理本地图片上传
  const onUpload = () => {
    // 创建隐藏的文件输入框
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*"; //限制文件选择器只允许选择图片文件
    // 监听文件选择事件
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // 将选择的文件转换为本地URL
        const url = URL.createObjectURL(file);
        onChange(url);
      }
    };
    // 触发这个隐藏的文件输入框
    input.click();
  };

  // 处理图片URL提交
  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      onChange(imageUrl); //插入图片
      setIsDialogOpen(false); //隐藏对话框
      setImageUrl(""); // 清空输入框
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* 图片插入下拉菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            title="Text Color"
            className="text-sm h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
          >
            <ImageIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        {/* 下拉菜单选项 */}
        <DropdownMenuContent>
          {/* 上传本地图片选项 */}
          <DropdownMenuItem onClick={onUpload}>
            <UploadIcon className="size-4 mr-2" />
            Upload
          </DropdownMenuItem>
          {/* 输入图片URL选项 */}
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <SearchIcon className="size-4 mr-2" />
            Paste image url
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* onOpenChange有什么用
          -用户点击遮罩层时，Dialog 会调用 onOpenChange(false)
          -用户按 ESC 键时，Dialog 会调用 onOpenChange(false)
          -用户点击'X'按钮时，Dialog 会调用 onOpenChange(false)
          -这个 false 值会被直接传给 setIsDialogOpen，从而更新状态
       */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paste image url</DialogTitle>
          </DialogHeader>
          {/* URL输入框 */}
          <Input
            placeholder="Insert image url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            // 支持回车键提交
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleImageUrlSubmit();
              }
            }}
          />
          <DialogFooter>
            <Button onClick={handleImageUrlSubmit}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
