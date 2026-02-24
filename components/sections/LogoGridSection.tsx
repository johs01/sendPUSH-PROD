import Image from "next/image";
import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/shared/Reveal";
import { logos } from "@/lib/content";
import styles from "./LogoGridSection.module.css";

export function LogoGridSection() {
  return (
    <section id="logo-grid" className={`section sectionTight bgPeach ${styles.section}`}>
      <Container>
        <Reveal order={0} className={styles.copyWrap}>
          <p className={styles.copy}>Powering the world&apos;s most focused product teams</p>
        </Reveal>
        <ul className={styles.grid} aria-label="Trusted platform and integration partners">
          {logos.map((logo, index) => (
            <Reveal as="li" key={logo.src} order={Math.min(index + 1, 12)} className={styles.card}>
              <Image
                className={styles.image}
                src={logo.src}
                alt={logo.alt}
                width={180}
                height={56}
                sizes="(max-width: 799px) 45vw, (max-width: 1399px) 22vw, 14vw"
              />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
