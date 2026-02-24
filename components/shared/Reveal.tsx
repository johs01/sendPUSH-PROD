"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  type CSSProperties,
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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const classes = useMemo(
    () =>
      [
        "reveal",
        visible ? "is-visible" : "",
        styles.reveal,
        visible ? styles.visible : "",
        className
      ]
        .filter(Boolean)
        .join(" "),
    [visible, className]
  );

  const revealDelayStyle = useMemo(
    () =>
      ({
        "--reveal-delay": `${Math.max(order, 0) * 55}ms`
      }) as CSSProperties,
    [order]
  );

  const mergedStyle = useMemo(() => {
    const baseStyle = (rest as { style?: CSSProperties }).style;
    return baseStyle ? ({ ...baseStyle, ...revealDelayStyle } as CSSProperties) : revealDelayStyle;
  }, [rest, revealDelayStyle]);

  return (
    <Component ref={ref as never} className={classes} {...rest} style={mergedStyle}>
      {children}
    </Component>
  );
}
