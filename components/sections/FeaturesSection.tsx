import { Container } from "@/components/primitives/Container";
import { Grid } from "@/components/primitives/Grid";
import { Reveal } from "@/components/shared/Reveal";
import { features } from "@/lib/content";
import styles from "./FeaturesSection.module.css";

export function FeaturesSection() {
  return (
    <section id="features" className="section bgWhite">
      <Container>
        <Reveal order={0} className={`sectionCenter ${styles.header}`}>
          <p className="eyebrow">Capabilities</p>
          <h2>All the Power, None of the Complexity</h2>
          <p className="bodyCopy bodyCopyMuted">
            Built for fast-moving teams that want results without extra tools.
          </p>
        </Reveal>

        <Grid columns="3" className={styles.featureGrid}>
          {features.map((feature, index) => (
            <Reveal key={feature.title} as="article" order={index + 1} className={styles.card}>
              <span className={`${styles.icon} ${styles[feature.iconTone]}`} aria-hidden="true"></span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </Reveal>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
