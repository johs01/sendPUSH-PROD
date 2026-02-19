import type { ReactNode } from "react";
import styles from "./Grid.module.css";

type GridColumns = "2" | "3" | "4" | "6";

type GridProps = {
  columns?: GridColumns;
  className?: string;
  children: ReactNode;
};

const columnClassMap: Record<GridColumns, string> = {
  "2": styles.columns2,
  "3": styles.columns3,
  "4": styles.columns4,
  "6": styles.columns6
};

export function Grid({ columns = "3", className, children }: GridProps) {
  const classes = [styles.grid, columnClassMap[columns], className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
