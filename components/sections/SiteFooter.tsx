import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";
import { Reveal } from "@/components/shared/Reveal";
import { footerData } from "@/lib/content";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer id="site-footer" className={`section sectionTight bgWhite ${styles.footer}`}>
      <Container>
        <Reveal order={0} className={styles.shell}>
          <div className={styles.grid}>
            <Reveal order={1} className={styles.brandCol}>
              <a className={styles.brand} href="#hero">
                <span className={styles.brandDot} aria-hidden="true"></span>
                <span>SetupFlow</span>
              </a>
              <p className={styles.copy}>
                SetupFlow helps local teams run reminders, offers, and follow-ups from one place.
              </p>
              <div className={styles.social} aria-label="Social links">
                <a href="#" aria-label="Follow SetupFlow on Facebook">f</a>
                <a href="#" aria-label="Follow SetupFlow on X">x</a>
                <a href="#" aria-label="Follow SetupFlow on Instagram">ig</a>
              </div>
            </Reveal>

            <Reveal order={2}>
              <h3 className={styles.heading}>Product</h3>
              <ul className={styles.links}>
                {footerData.productLinks.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal order={3}>
              <h3 className={styles.heading}>Company</h3>
              <ul className={styles.links}>
                {footerData.companyLinks.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal order={4}>
              <h3 className={styles.heading}>Contact</h3>
              <ul className={styles.links}>
                <li>(555) 123-4567</li>
                <li>hello@setupflow.com</li>
                <li>San Francisco, CA</li>
              </ul>
              <Button href="#" size="sm" className={styles.footerCta}>
                Book a Demo
              </Button>
            </Reveal>
          </div>

          <Reveal order={5} className={styles.bottom}>
            <p>© 2026 SetupFlow. All rights reserved.</p>
            <div className={styles.legal}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </Reveal>
        </Reveal>
      </Container>
    </footer>
  );
}
