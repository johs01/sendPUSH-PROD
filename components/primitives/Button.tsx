import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type SharedButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type AnchorLikeButtonProps = SharedButtonProps & {
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

type NativeButtonProps = SharedButtonProps & {
  href?: never;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClassMap: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost
};

const sizeClassMap: Record<ButtonSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg
};

function composeClassName(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return [styles.button, variantClassMap[variant], sizeClassMap[size], className]
    .filter(Boolean)
    .join(" ");
}

function isAnchorLikeButtonProps(
  props: AnchorLikeButtonProps | NativeButtonProps
): props is AnchorLikeButtonProps {
  return typeof (props as AnchorLikeButtonProps).href === "string";
}

export function Button(props: AnchorLikeButtonProps | NativeButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children
  } = props;

  const classes = composeClassName(variant, size, className);

  if (isAnchorLikeButtonProps(props)) {
    const {
      href,
      variant: _variant,
      size: _size,
      className: _className,
      children: _children,
      ...anchorRest
    } = props;

    return (
      <Link href={href} className={classes} {...anchorRest}>
        <span>{children}</span>
      </Link>
    );
  }

  const {
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    type = "button",
    ...buttonRest
  } = props;

  return (
    <button type={type} {...buttonRest} className={classes}>
      <span>{children}</span>
    </button>
  );
}
