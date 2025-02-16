import { FaCaretDown } from "react-icons/fa";

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Marker = ({
  position,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
      style={{ [isLeft ? "left" : "right"]: `${position}px` }} //动态拼接
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
      <div
        className="absolute left-1/2 top-4 transform -translate-x-1/2"
        style={{
          width: "1px",
          height: "100vh",
          transform: "scaleX(0.5)",
          backgroundColor: "#3b72f6",
          display:isDragging ? "block" : "none",
        }}
      />
    </div>
  );
};