import clsx from "clsx";
import { useTheme } from "next-themes";

export const BoardCart = (props: {
  text: string;
  onClick?: () => void;
  selected: boolean;
}) => {
  const { theme } = useTheme();

  const baseClasses =
    "flex flex-row cursor-pointer text-[15px] font-bold mr-6 ml-[-0.5rem] px-6 py-[15px] transition-colors duration-300 rounded-r-full";
  const unselectedTextColor = "text-[#828FA3]";

  const selectedClasses = "bg-[#635fc7] text-white";

  const hoverClasses =
    theme === "dark"
      ? "hover:bg-white hover:text-[#635fc7]"
      : "hover:bg-[rgba(99,95,199,0.1)] hover:text-[#635fc7]";

  return (
    <div
      onClick={props.onClick}
      className={clsx(
        baseClasses,
        props.selected ? selectedClasses : unselectedTextColor,
        hoverClasses
      )}
    >
      <img
        className="mr-2"
        src="/assets/icon-board.svg"
        alt="board"
        width={10}
        height={13}
      />
      <p className={clsx(!props.selected && "font-medium")}>{props.text}</p>
    </div>
  );
};
