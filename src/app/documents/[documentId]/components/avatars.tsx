//该文件为右上角在线协作用户头像
import { Separator } from "@/components/ui/separator";
import {
  ClientSideSuspense,
  useOthers,
  useSelf,
} from "@liveblocks/react/suspense";
import Image from "next/image";

const AVATAR_SIZE = 32;
interface AvatarProps {
  src: string;
  name: string;
}

const Avatar = ({ src, name }: AvatarProps) => {
  return (
    <div
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
      className="group -ml-2 flex shrink-0 place-content-center relative border-2 border-white rounded-full bg-gray-400"
    >
      <Image
        src={src}
        alt={`${name}`}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        className="rounded-full w-full h-full object-cover"
      />

      <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-xs rounded-lg mt-2.5 z-10 bg-black whitespace-nowrap transition-opacity">
        {name}
      </div>
    </div>
  );
};

const AvatarStack = () => {
  const users = useOthers();
  const currentUser = useSelf();
  return (
    <>
      <div className="flex items-center">
        {currentUser && (
          <div className="relative ml-2">
            <Avatar src={currentUser.info?.avatar || ''} name="You" />
          </div>
        )}
        <div className="flex">
          {users.map(({ connectionId, info }) => {
            return (
              <Avatar key={connectionId} src={info?.avatar || ''} name={info?.name || ''} />
            );
          })}
        </div>
      </div>
      <Separator orientation="vertical" className="h-6" />
    </>
  );
};

export const Avatars = () => {
  return (
    <ClientSideSuspense fallback={null}>
      <AvatarStack />
    </ClientSideSuspense>
  );
};
