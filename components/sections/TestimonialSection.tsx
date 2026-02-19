import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/shared/Reveal";
import { EmailCta } from "@/components/shared/EmailCta";
import styles from "./TestimonialSection.module.css";

type TestimonialBlock = {
  quote: string;
  author: string;
};

type TestimonialSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  testimonials: TestimonialBlock[];
  background: "white" | "dark";
  ctaText?: string;
  emailCtaText?: string;
  emailInputId?: string;
};

export function TestimonialSection({
  id,
  eyebrow,
  title,
  testimonials,
  background,
  ctaText,
  emailCtaText,
  emailInputId
}: TestimonialSectionProps) {
  const isDark = background === "dark";

  return (
    <section id={id} className={`section ${isDark ? "bgDark" : "bgWhite"}`}>
      <Container size="focus">
        <Reveal order={0} className={`sectionCenter ${styles.header}`}>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className={isDark ? "displayDark" : ""}>{title}</h2>
        </Reveal>

        <Reveal as="article" order={1} className={`${styles.card} ${isDark ? styles.darkCard : ""}`}>
          {testimonials.map((item) => (
            <div key={item.author} className={styles.quoteRow}>
              <p className={styles.quote}>{`"${item.quote}"`}</p>
              <p className={styles.author}>{item.author}</p>
            </div>
          ))}
        </Reveal>

        {ctaText ? (
          <Reveal order={2} className="sectionCenter">
            <Button href="#tenant-trial-cta">{ctaText}</Button>
          </Reveal>
        ) : null}

        {emailCtaText && emailInputId ? (
          <Reveal order={2} className="sectionCenter">
            <EmailCta ariaLabel={`${emailCtaText} email capture`} inputId={emailInputId} buttonText={emailCtaText} />
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
