import { useEditorStore } from "@/store/use-editor-store";
import { ImageIcon } from "lucide-react";
import { CldUploadButton, CloudinaryUploadWidgetResults } from "next-cloudinary";

export const ImageButton = () => {
  const onChange = (src: string) => {
    const currentEditor = useEditorStore.getState().editor; 
    currentEditor?.chain().focus().setImage({ src }).run();
  }

  const uploadPhoto = (result: CloudinaryUploadWidgetResults) => {
    const secureUrl = typeof result.info === 'object' ? result.info?.secure_url : "";
    onChange(secureUrl);
  };



  return (
    <div className="flex flex-col items-center justify-center">
      {/* 图片插入下拉菜单 */}
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={uploadPhoto}
        uploadPreset="kdm7bzdm"
      >
        <ImageIcon className="size-4" color="#A9A9A9"/>
      </CldUploadButton>
    </div>
  );
};
