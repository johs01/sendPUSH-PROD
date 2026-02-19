import type { ElementType, ReactNode } from "react";
import styles from "./Stack.module.css";

type StackGap = "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16";
type StackAlign = "start" | "center" | "end" | "stretch";

type StackProps<T extends ElementType> = {
  as?: T;
  gap?: StackGap;
  align?: StackAlign;
  className?: string;
  children: ReactNode;
};

const gapClassMap: Record<StackGap, string> = {
  "2": styles.gap2,
  "3": styles.gap3,
  "4": styles.gap4,
  "5": styles.gap5,
  "6": styles.gap6,
  "8": styles.gap8,
  "10": styles.gap10,
  "12": styles.gap12,
  "16": styles.gap16
};

const alignClassMap: Record<StackAlign, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch
};

export function Stack<T extends ElementType = "div">({
  as,
  gap = "4",
  align = "stretch",
  className,
  children
}: StackProps<T>) {
  const Component = as || "div";

  const classes = [
    styles.stack,
    gapClassMap[gap],
    alignClassMap[align],
    className
  ]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes}>{children}</Component>;
}
