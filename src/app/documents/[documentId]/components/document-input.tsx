"use client";
import { useMutation } from "convex/react";
import { useRef, useState, useTransition, useCallback, Suspense } from "react";
import { useDebounce } from "@/hooks/use-debounce";

import { toast } from "sonner";

import { useStatus } from "@liveblocks/react";
import { Cloud, CloudOff, LoaderIcon } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
interface DocumentInputProps {
  title: string;
  id: Id<"documents">;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
  const status = useStatus();
  const [value, setValue] = useState(title);
  //低优先级
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const mutate = useMutation(api.documents.updateById);

  const debouncedUpdate = useDebounce((newValue: string) => {
    if (newValue === title) return;
    startTransition(() => {
      mutate({ id, title: newValue })
        .then(() => toast.success("Document updated"))
        .catch(() => toast.error("Something went wrong"));
    });
  }, 300);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUpdate(newValue);
  }, [debouncedUpdate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      mutate({ id, title: value })
        .then(() => toast.success("Document updated"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const showLoader =
    isPending || status === "connecting" || status === "reconnecting";

  const showError = status === "disconnected";

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="relative w-fit max-w-[50ch]">
          <span className="inline-block min-w-[120px] invisible whitespace-pre px-1.5 text-lg">
            {value || " "}
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={() => setIsEditing(false)}
            className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
          />
        </form>
      ) : (
        <span
          onClick={() => {
            setIsEditing(true);
            requestAnimationFrame(() => {
              inputRef.current?.focus();
            });
          }}
          className="text-lg px-1.5 cursor-pointer truncate"
        >
          {title}
        </span>
      )}
      <Suspense fallback={<span className="size-4" />}>
        {showError && <CloudOff className="size-5" color="#5732E3"/>}
        {!showError && !showLoader && <Cloud color="#5732E3" className="size-5"/>}
      </Suspense>
      {showLoader && (
        <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};
