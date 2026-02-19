"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import styles from "./Reveal.module.css";

type RevealProps<T extends ElementType> = {
  as?: T;
  order?: number;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "className" | "children">;

const orderClass = (order: number) => {
  const normalized = Math.max(0, Math.min(12, order));
  return styles[`order${normalized}` as keyof typeof styles] || styles.order0;
};

export function Reveal<T extends ElementType = "div">({
  as,
  order = 0,
  className,
  children,
  ...rest
}: RevealProps<T>) {
  const Component = as || "div";
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const classes = useMemo(
    () =>
      [
        styles.reveal,
        orderClass(order),
        visible ? styles.visible : "",
        className
      ]
        .filter(Boolean)
        .join(" "),
    [order, visible, className]
  );

  return (
    <Component ref={ref as never} className={classes} {...rest}>
      {children}
    </Component>
  );
}
