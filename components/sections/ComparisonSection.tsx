import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/shared/Reveal";
import { comparisonRows } from "@/lib/content";
import styles from "./ComparisonSection.module.css";

export function ComparisonSection() {
  return (
    <section id="comparison" className="section bgCyan">
      <Container>
        <Reveal order={0} className={`sectionCenter ${styles.header}`}>
          <p className="eyebrow">Comparison</p>
          <h2>See How SetupFlow Beats Generic Campaign Tools</h2>
        </Reveal>

        <Reveal order={1} className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Feature</th>
                <th>SetupFlow</th>
                <th>Bulk SMS App</th>
                <th>Email Tool</th>
                <th>Manual Follow-Up</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <td data-label="Feature">{row.feature}</td>
                  <td data-label="SetupFlow">{row.setupflow}</td>
                  <td data-label="Bulk SMS App">{row.bulkSms}</td>
                  <td data-label="Email Tool">{row.emailTool}</td>
                  <td data-label="Manual Follow-Up">{row.manualFollowUp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal order={2} className="sectionCenter">
          <Button href="#tenant-trial-cta">See Pricing and Plans</Button>
        </Reveal>
      </Container>
    </section>
  );
}
