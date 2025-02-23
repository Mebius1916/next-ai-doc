import { ChevronDown } from "lucide-react";

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
      <ChevronDown className="absolute left-1/2 top-0 h-full transform -translate-x-1/2" color="#5732E3"/>
      <div
        className="absolute left-1/2 top-4 transform -translate-x-1/2"
        style={{
          width: "1px",
          height: "100vh",
          transform: "scaleX(0.5)",
          backgroundColor: "#5732E3",
          display:isDragging ? "block" : "none",
        }}
      />
    </div>
  );
};