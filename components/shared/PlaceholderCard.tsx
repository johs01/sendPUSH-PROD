import styles from "./PlaceholderCard.module.css";

type PlaceholderCardProps = {
  label: string;
  className?: string;
};

export function PlaceholderCard({ label, className }: PlaceholderCardProps) {
  const classes = [styles.card, className].filter(Boolean).join(" ");

  return <div className={classes} data-label={label} aria-label={label}></div>;
}
