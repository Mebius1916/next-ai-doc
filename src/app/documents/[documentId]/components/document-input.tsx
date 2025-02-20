"use client";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { useDebounce } from "@/hooks/use-debounce";

import { toast } from "sonner";

import { useStatus } from "@liveblocks/react";
import { LoaderIcon } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface DocumentInputProps {
  title: string;
  id: Id<"documents">;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
  const status = useStatus();
  const [value, setValue] = useState(title);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const mutate = useMutation(api.documents.updateById); //调用updateById逻辑

  //输入防抖
  const debouncedUpdate = useDebounce((newValue: string) => {
    if (newValue === title) return;
    setIsPending(true);
    mutate({ id, title: newValue })
      .then(() => {
        toast.success("Document updated");
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsPending(false);
      });
  });

  //输入框变化时触发
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    //修改数据库
    debouncedUpdate(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    mutate({ id, title: value })
      .then(() => {
        toast.success("Document updated");
        setIsEditing(false);
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsPending(false));
  };

  const showLoader =
    isPending || status === "connecting" || status === "reconnecting";

  const showError = status === "disconnected";

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="relative w-fit max-w-[50ch]">
          <span className="invisible whitespace-pre px-1.5 text-lg">
            {value || " "}
          </span>

          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            //失去焦点时触发
            onBlur={() => setIsEditing(false)}
            className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate focus:outline-none focus:ring-0"
          />
        </form>
      ) : (
        <span
          onClick={() => {
            setIsEditing(true);
            //确保在dom更新后执行操作
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
          className="text-lg px-1.5 cursor-pointer truncate"
        >
          {title}
        </span>
      )}
      {showError && <BsCloudSlash className="size-4" />}
      {!showError && !showLoader && <BsCloudCheck />}
      {showLoader && (
        <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};
