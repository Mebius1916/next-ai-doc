//toRead
"use client";
import { BellIcon } from "lucide-react";
import { ClientSideSuspense } from "@liveblocks/react";
import { useInboxNotifications } from "@liveblocks/react";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Inbox = () => {
  return (
    <>
      <ClientSideSuspense
        fallback={
          <Button variant="ghost" className="relative" size="icon" disabled>
            <BellIcon className="size-5" />
          </Button>
        }
      >
        <InboxMenu />
      </ClientSideSuspense>
      <Separator orientation="vertical" className="h-6" />
    </>
  );
};

const InboxMenu = () => {
  const { inboxNotifications } = useInboxNotifications();

  const notificationCount = inboxNotifications?.length ?? 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative" size="icon">
            <BellIcon className="size-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-sky-500 text-xs text-white flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          {notificationCount > 0 ? (
            <InboxNotificationList>
              {inboxNotifications?.map((inboxNotification) => (
                <InboxNotification
                  key={inboxNotification.id}
                  inboxNotification={inboxNotification}
                />
              ))}
            </InboxNotificationList>
          ) : (
            <div className="p-2 w-[400px] text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
