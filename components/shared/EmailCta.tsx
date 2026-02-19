import { Button } from "@/components/primitives/Button";
import styles from "./EmailCta.module.css";

type EmailCtaProps = {
  ariaLabel: string;
  inputId: string;
  buttonText: string;
  buttonHref?: string;
  className?: string;
};

export function EmailCta({
  ariaLabel,
  inputId,
  buttonText,
  buttonHref = "#tenant-trial-cta",
  className
}: EmailCtaProps) {
  const classes = [styles.shell, className].filter(Boolean).join(" ");

  return (
    <div className={classes} role="group" aria-label={ariaLabel}>
      <label className="visually-hidden" htmlFor={inputId}>
        Email address
      </label>
      <input
        className={styles.input}
        id={inputId}
        name="email"
        type="email"
        autoComplete="email"
        placeholder="name@email.com"
      />
      <Button className={styles.button} size="lg" href={buttonHref}>
        {buttonText}
      </Button>
    </div>
  );
}
