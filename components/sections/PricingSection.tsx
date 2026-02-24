"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";
import { Reveal } from "@/components/shared/Reveal";
import { pricingPlans } from "@/lib/content";
import styles from "./PricingSection.module.css";

type BillingMode = "monthly" | "yearly";

export function PricingSection() {
  const [billingMode, setBillingMode] = useState<BillingMode>("monthly");

  const billedLabel = useMemo(() => (billingMode === "yearly" ? "yearly" : "monthly"), [billingMode]);

  return (
    <section id="pricing" className="section bgWhite">
      <Container>
        <Reveal order={0} className={styles.header}>
          <p className="eyebrow">Pricing</p>
          <h2>Pricing That Scales With Your Campaign Goals</h2>
          <p className="bodyCopy bodyCopyMuted">
            Start lean, scale when your audience and campaign volume grow. Every plan includes SetupFlow templates,
            automation tools, and performance reporting.
          </p>
        </Reveal>

        <Reveal order={1} className={styles.toggleWrap}>
          <div className={styles.toggle} role="group" aria-label="Billing period">
            <button
              type="button"
              data-pricing-toggle="monthly"
              className={`${styles.toggleButton} ${billingMode === "monthly" ? styles.active : ""}`}
              aria-pressed={billingMode === "monthly"}
              onClick={() => setBillingMode("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              data-pricing-toggle="yearly"
              className={`${styles.toggleButton} ${billingMode === "yearly" ? styles.active : ""}`}
              aria-pressed={billingMode === "yearly"}
              onClick={() => setBillingMode("yearly")}
            >
              <span>Yearly</span>
              <span className={styles.discount}>30% OFF</span>
            </button>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {pricingPlans.map((plan, index) => {
            const yearly = billingMode === "yearly";
            return (
              <Reveal
                as="article"
                key={plan.name}
                order={index + 2}
                className={`${styles.card} ${plan.highlighted ? styles.pro : ""}`}
              >
                <div className={styles.top}>
                  <div className={styles.planHead}>
                    <h3>{plan.name}</h3>
                    {plan.popularLabel ? <span className={styles.popular}>{plan.popularLabel}</span> : null}
                  </div>
                  <p className={styles.planCopy}>{plan.copy}</p>

                  {plan.contactLabel ? (
                    <div className={styles.contactBlock}>
                      <p className={styles.contact}>{plan.contactLabel}</p>
                      <p className={styles.contactNote}>{plan.contactNote}</p>
                    </div>
                  ) : (
                    <div className={styles.priceBlock}>
                      <div className={styles.priceRow}>
                        <div className={styles.priceViewport}>
                          <div
                            data-pricing-stack={plan.name.toLowerCase()}
                            className={`${styles.priceStack} ${yearly ? styles.priceYearly : styles.priceMonthly}`}
                          >
                            <span>{plan.monthly}</span>
                            <span>{plan.yearly}</span>
                          </div>
                        </div>
                        <span className={styles.period}>/month</span>
                      </div>
                      <p className={`${styles.billed} wf-pricing-billed-label`}>
                        Billed {billedLabel}
                        {plan.name === "Pro" ? ", per workspace." : "."}
                      </p>
                    </div>
                  )}
                </div>

                <div className={styles.bottom}>
                  <Button href="#tenant-trial-cta" className={styles.planButton}>
                    {plan.cta}
                  </Button>
                  <ul className={styles.featureList}>
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <span aria-hidden="true" className={styles.dot}></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal order={5} className={`sectionCenter ${styles.details}`}>
          <Button href="#faq" variant="secondary" className={styles.detailsButton}>
            View all billing details
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
