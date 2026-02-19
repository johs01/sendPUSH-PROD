import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/shared/Reveal";
import { PlaceholderCard } from "@/components/shared/PlaceholderCard";
import type { UseCaseItem } from "@/lib/content";
import styles from "./UseCaseSection.module.css";

type UseCaseSectionProps = {
  useCase: UseCaseItem;
};

const toneClassMap: Record<UseCaseItem["tone"], string> = {
  salmon: "bgSalmon",
  white: "bgWhite",
  peach: "bgPeach"
};

export function UseCaseSection({ useCase }: UseCaseSectionProps) {
  return (
    <section id={useCase.id} className={`section ${toneClassMap[useCase.tone]}`}>
      <Container>
        <div className={`${styles.split} ${useCase.reverse ? styles.reverse : ""}`}>
          <Reveal order={useCase.reverse ? 1 : 0}>
            <PlaceholderCard label={useCase.placeholderLabel} />
          </Reveal>

          <Reveal order={useCase.reverse ? 0 : 1} className={styles.content}>
            <p className="eyebrow">{useCase.eyebrow}</p>
            <h2>{useCase.title}</h2>
            <p className="bodyCopy">{useCase.body}</p>
            <ul className={styles.checklist}>
              {useCase.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <Button href="#tenant-trial-cta">{useCase.cta}</Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
