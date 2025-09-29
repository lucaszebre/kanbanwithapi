import { useSidebarStore } from "@/state/sidebarcontext";
import Image from "next/image";
import styles from "../../styles/Hide.module.css";
import React from "react";

const Hide = () => {
  // state to toggle the sidebar
  const { isSidebarOpen, setIsSidebarOpen } = useSidebarStore();

  return (
    <div
      className={styles.HideContainer}
      style={{
        display: isSidebarOpen ? "none" : "block",
      }}
    >
      <div
        className={styles.HideBlock}
        onClick={() => {
          setIsSidebarOpen(true);
        }}
      >
        <Image
          src="/assets/icon-hide-sidebar.svg"
          alt="hideBar"
          width={20}
          height={20}
          fetchPriority="high"
        />
      </div>
    </div>
  );
};

export default Hide;
