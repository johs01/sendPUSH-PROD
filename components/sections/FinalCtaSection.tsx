import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/shared/Reveal";
import { EmailCta } from "@/components/shared/EmailCta";
import styles from "./FinalCtaSection.module.css";

export function FinalCtaSection() {
  return (
    <section id="final-cta" className="section bgDark">
      <Container size="focus">
        <Reveal order={0} className={`sectionCenter ${styles.wrap}`}>
          <h2 className="displayDark">Stop Losing Customers to Silence.</h2>
          <p className="bodyCopy bodyDarkMuted">
            Turn every customer interaction into repeat revenue with direct messaging you control.
          </p>
          <EmailCta
            ariaLabel="Get Your First Campaign Ready email capture"
            inputId="wf-email-final"
            buttonText="Get Your First Campaign Ready"
          />
        </Reveal>
      </Container>
    </section>
  );
}
