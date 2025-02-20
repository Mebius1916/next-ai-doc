"use client";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { templates } from "@/lib/templates";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
export const TemplateGallery = () => {
  const create = useMutation(api.documents.create); //在数据库中创建文档
  const [isCreating, setIsCreating] = useState(false);
  // 点击模板时，创建新文档
  const onTemplateClick = (title: string, initialContent: string) => {
    setIsCreating(true); // button禁用
    create({ title, initialContent }) // 调用后端API创建新文档
      .catch(() => toast.error("Failed to create document"))
      .then((documentId) => {
        toast.success("Document created");
        window.open(`/documents/${documentId}`, "_blank"); // 创建成功后跳转到新文档页面
      })
      .finally(() => {
        setIsCreating(false); // 无论成功失败，最后都解禁button
      });
  };

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-y-4">
      <h3 className="font-medium">Start a new document</h3>
      <Carousel>
        <CarouselContent className="-ml-4">
          {templates.map((template) => (
            <CarouselItem
              key={template.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4"
            >
              <div
                className={cn(
                  "aspect-[3/4] flex flex-col gap-y-2.5",
                  isCreating && "pointer-events-none opacity-50"
                )}
              >
                <button
                  type="button"
                  disabled={isCreating}
                  onClick={() => onTemplateClick(template.label, "")}
                  style={{
                    backgroundImage: `url(${template.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="size-full rounded-sm border hover:bg-purple-50
                  "
                />
                <p className="text-sm font-medium truncate">{template.label}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
