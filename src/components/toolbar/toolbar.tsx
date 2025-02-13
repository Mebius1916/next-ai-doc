"use client";
import { ToolbarButton } from "./toolBarButton";
import { useEditorStore } from "@/store/use-editor-store";
import { Separator } from "@/components/ui/separator";
import { FontFamilyButton } from "./fontFamilyButton";
import { getToolbarSections } from "@/lib/useSections";
import { HeadingLevelButton } from "./headingButton";
import { TextColorbutton } from "./textColorButton";
import { HighlightButton } from "./highLightButton";
import { LinkButton } from "./linkButton";
import { ImageButton } from "./imageButton";
import { AlignButton } from "./alignButton";
import { ListButton } from "./ListButton";
import { FontSizeButton } from "./fontSizeButton";
import { LineHeightButton } from "./lineHeightButton";
export const Toolbar = () => {
  const { editor } = useEditorStore();
  const sections = getToolbarSections(editor || undefined);
  return (
    <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex item-center gap-x-0.5 overflow-x-auto ">
      {sections[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      {/* 分隔符组件 */}
      <div className="flex flex-col items-center justify-center">
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      </div>

      <FontFamilyButton />
      <div className="flex flex-col items-center justify-center">
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      </div>
      <HeadingLevelButton />
      <div className="flex flex-col items-center justify-center">
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      </div>
      {/* TODO:Font size */}
      <FontSizeButton />
      <div className="flex flex-col items-center justify-center">
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      </div>
      {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}

      <TextColorbutton />
      <HighlightButton />
      <div className="flex flex-col items-center justify-center">
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
      </div>
      <LinkButton />
      <ImageButton />
      <AlignButton />
      <ListButton />
      <LineHeightButton />
      {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
    </div>
  );
};
