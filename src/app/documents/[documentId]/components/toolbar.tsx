"use client";
import { ToolbarButton } from "@/components/toolbar/toolBarButton";
import { useEditorStore } from "@/store/use-editor-store";
import { Separator } from "@/components/ui/separator";
import { FontFamilyButton } from "@/components/toolbar/fontFamilyButton";
import { getToolbarSections } from "@/lib/useSections";
import { HeadingLevelButton } from "@/components/toolbar/headingButton";
import { TextColorbutton } from "@/components/toolbar/textColorButton";
import { HighlightButton } from "@/components/toolbar/highLightButton";
import { LinkButton } from "@/components/toolbar/linkButton";
import { ImageButton } from "@/components/toolbar/imageButton";
import { AlignButton } from "@/components/toolbar/alignButton";
import { ListButton } from "@/components/toolbar/ListButton";
import { FontSizeButton } from "@/components/toolbar/fontSizeButton";
import { LineHeightButton } from "@/components/toolbar/lineHeightButton";
export const Toolbar = () => {
  const { editor } = useEditorStore();
  const sections = getToolbarSections(editor || undefined);
  return (
    <div className="flex mx-auto w-[816px] ">
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
