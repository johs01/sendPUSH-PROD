import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/shared/Reveal";
import { EmailCta } from "@/components/shared/EmailCta";
import { processSteps } from "@/lib/content";
import styles from "./ProcessSection.module.css";

export function ProcessSection() {
  return (
    <section id="process" className="section bgSalmon">
      <Container>
        <Reveal order={0} className={`sectionCenter ${styles.header}`}>
          <p className="eyebrow">Simple process</p>
          <h2>Our Solution Is Stupidly Simple to Use and Insanely Effective</h2>
        </Reveal>

        <div className={styles.grid}>
          {processSteps.map((step, index) => (
            <Reveal key={step.title} as="article" order={index + 1} className={`${styles.card} ${styles[step.tone]}`}>
              <div className={styles.stepPill}>
                <span className={`${styles.badge} ${styles[`badge${step.tone[0].toUpperCase()}${step.tone.slice(1)}`]}`}>
                  {step.badge}
                </span>
                <span>{step.title}</span>
              </div>
              <p>{step.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal order={4} className="sectionCenter">
          <EmailCta ariaLabel="Start in Under 10 Minutes email capture" inputId="wf-email-process" buttonText="Start in Under 10 Minutes" />
        </Reveal>
      </Container>
    </section>
  );
}
