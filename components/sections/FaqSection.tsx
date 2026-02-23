import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/shared/Reveal";
import { faqs } from "@/lib/content";
import styles from "./FaqSection.module.css";

export function FaqSection() {
  return (
    <section id="faq" className="section bgWhite">
      <Container size="focus">
        <Reveal order={0} className={`sectionCenter ${styles.header}`}>
          <p className="eyebrow">FAQ</p>
          <h2>Frequently Asked Questions</h2>
        </Reveal>

        <div className={styles.list}>
          {faqs.map((item, index) => (
            <Reveal
              as="details"
              key={item.question}
              order={index + 1}
              className={`${styles.item} wf-faq-item`}
              open={item.open}
            >
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
