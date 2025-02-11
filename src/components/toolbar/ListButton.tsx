import { ListIcon, ListOrderedIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";

export const ListButton = () => {
  const { editor } = useEditorStore();
  const lists = [
    {
      label: "Bullet List",
      icon: ListIcon,
      isActive: () => editor?.isActive("bulletlist"),
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      icon: ListOrderedIcon,
      isActive: () => editor?.isActive("orderedlist"),
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            title="Align"
            className="text-sm h-7 min-w-7 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
            type="button"
          >
            <ListIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0">
          {lists.map(({ label, icon: Icon, onClick, isActive }) => (
            <button
              key={label}
              onClick={onClick}
              className={cn(
                "w-full flex items-center gap-x-2 px-1 py-1 rounded-sm hover:bg-neutral-200/80",
                isActive() && "bg-neutral-200/80"
              )}
            >
              <Icon className="size-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
