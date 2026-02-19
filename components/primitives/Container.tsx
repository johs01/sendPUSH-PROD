import type { ElementType, ReactNode } from "react";
import styles from "./Container.module.css";

type ContainerSize = "main" | "focus" | "full" | "cta";

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
};

const sizeClassMap: Record<ContainerSize, string> = {
  main: styles.main,
  focus: styles.focus,
  full: styles.full,
  cta: styles.cta
};

export function Container<T extends ElementType = "div">({
  as,
  size = "main",
  className,
  children
}: ContainerProps<T>) {
  const Component = as || "div";
  const classes = [styles.container, sizeClassMap[size], className]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes}>{children}</Component>;
}
