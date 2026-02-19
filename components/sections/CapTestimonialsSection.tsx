import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/shared/Reveal";
import { capabilityTestimonials } from "@/lib/content";
import styles from "./CapTestimonialsSection.module.css";

export function CapTestimonialsSection() {
  return (
    <section id="capabilities-testimonials" className="section bgWhite">
      <Container>
        <Reveal order={0} className={`sectionCenter ${styles.header}`}>
          <p className="eyebrow">Customer feedback</p>
          <h2>Loved by Teams Worldwide</h2>
          <p className="bodyCopy bodyCopyMuted">
            See what local teams are saying about how SetupFlow improves response rates, reduces manual work, and keeps
            customers coming back.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {capabilityTestimonials.map((item, index) => (
            <Reveal key={item.name} as="article" order={index + 1} className={styles.card}>
              <p className={styles.stars} aria-label="5 out of 5 stars" role="img">
                ★★★★★
              </p>
              <p className={styles.quote}>{`"${item.quote}"`}</p>
              <div className={styles.person}>
                <span className={styles.avatar} aria-hidden="true">
                  {item.initials}
                </span>
                <div>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.role}>{item.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
