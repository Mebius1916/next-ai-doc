import { useEffect, useRef, useState } from "react";

export const useAutoScroll = () => {
  const [canScroll, setCanScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = (() => {
    let lastExec = 0;
    return () => {
      const now = Date.now();
      const remaining = 300 - (now - lastExec);
      if (remaining <= 0) {
        if (canScroll && messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView();
        }
        lastExec = now;
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          if (canScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView();
          }
          lastExec = Date.now();
          timeoutRef.current = null;
        }, remaining);
      }
    };
  })();

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY < 0) {
        setCanScroll(false);
      }
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return { messagesEndRef, scrollToBottom, canScroll, setCanScroll, timeoutRef };
};