import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/shared/Reveal";
import { stats } from "@/lib/content";
import styles from "./StatsSection.module.css";

export function StatsSection() {
  return (
    <section id="stats" className="section sectionTight bgWhite">
      <Container>
        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <Reveal key={stat.label} as="article" order={index} className={styles.card}>
              <p className={styles.value}>{stat.value}</p>
              <p className={styles.label}>{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
