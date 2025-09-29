import Image from "next/image";
import styles from "../../styles/BoardCarts.module.css";

const BoardCart = (props: {
  text: string;
  onClick?: () => void;
  selected: boolean;
}) => {
  return (
    <div
      onClick={props.onClick}
      className={`${styles.BoardCartContainer} ${
        props.selected ? styles.selected : ""
      }`}
    >
      <Image
        className={styles.BoardImage}
        src="/assets/icon-board.svg"
        alt="board"
        width={10}
        height={13}
      />
      <p className={styles.BoardCartText}>{props.text}</p>
    </div>
  );
};

export default BoardCart;
