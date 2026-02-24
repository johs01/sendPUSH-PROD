import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/shared/Reveal";
import { EmailCta } from "@/components/shared/EmailCta";
import { PlaceholderCard } from "@/components/shared/PlaceholderCard";
import { heroBullets } from "@/lib/content";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section id="hero" className="section bgPeach">
      <Container>
        <div className={styles.grid}>
          <Reveal order={0} className={styles.content}>
            <p className="eyebrow">Customer messaging system</p>
            <h1>Have Your Own Customer List. Message Them Anytime - Free.</h1>
            <p className={`bodyCopy ${styles.copy}`}>
              Build your direct customer list, automate outreach, and send high-converting campaigns without relying
              on social algorithms.
            </p>
            <ul className={styles.checklist}>
              {heroBullets.map((item) => (
                <li key={item.text}>{item.text}</li>
              ))}
            </ul>
            <EmailCta ariaLabel="Start Free in 2 Minutes email capture" inputId="wf-email-hero" buttonText="Start Free in 2 Minutes" />
          </Reveal>
          <Reveal order={1}>
            <PlaceholderCard label="Hero image placeholder · 16:10" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
