import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/shared/Reveal";
import { PlaceholderCard } from "@/components/shared/PlaceholderCard";
import { problemPoints } from "@/lib/content";
import styles from "./ProblemSection.module.css";

export function ProblemSection() {
  return (
    <section id="problem" className="section bgCyan">
      <Container>
        <div className={styles.split}>
          <Reveal order={0} className={styles.content}>
            <p className="eyebrow">The real problem</p>
            <h2>Your Messages to Your Customers Aren&apos;t Getting Through.</h2>
            <ol className={styles.list}>
              {problemPoints.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>
            <Button href="#tenant-trial-cta">See How It Works</Button>
          </Reveal>

          <Reveal order={1}>
            <PlaceholderCard label="Problem visual placeholder · 16:10" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
