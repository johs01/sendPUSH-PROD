"use client";

import { FormEvent, useRef, useState } from "react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";
import { Reveal } from "@/components/shared/Reveal";
import styles from "./TenantTrialSection.module.css";

export function TenantTrialSection() {
  const [successMessage, setSuccessMessage] = useState("");
  const successRef = useRef<HTMLParagraphElement | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nameInput = form.elements.namedItem("fullName") as HTMLInputElement | null;
    const firstName = nameInput?.value.trim().split(" ")[0] || "there";

    setSuccessMessage(`Thanks ${firstName}. Your 30-day tenant trial request is in. We will contact you shortly.`);
    form.reset();

    window.requestAnimationFrame(() => {
      successRef.current?.focus();
    });
  };

  return (
    <section id="tenant-trial-cta" className="section bgPeach">
      <Container size="focus">
        <Reveal order={0} className={`sectionCenter ${styles.header}`}>
          <p className="eyebrow">30-Day Trial</p>
          <h2>Start Your Tenant Trial in Minutes</h2>
          <p className="bodyCopy bodyCopyMuted">
            Complete this quick form to launch your 30-day trial and start messaging your customers with SetupFlow.
          </p>
        </Reveal>

        <Reveal as="form" order={1} className={styles.form} id="wf-tenant-trial-form" onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor="wf-tenant-name">Full Name <span aria-hidden="true">*</span></label>
              <input id="wf-tenant-name" name="fullName" type="text" autoComplete="name" required placeholder="Jane Smith" />
            </div>
            <div className={styles.field}>
              <label htmlFor="wf-tenant-business">Business Name <span aria-hidden="true">*</span></label>
              <input
                id="wf-tenant-business"
                name="businessName"
                type="text"
                autoComplete="organization"
                required
                placeholder="Acme Wellness Studio"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="wf-tenant-email">Business Email <span aria-hidden="true">*</span></label>
              <input
                id="wf-tenant-email"
                name="businessEmail"
                type="email"
                autoComplete="email"
                required
                placeholder="name@business.com"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="wf-tenant-location">Business Location <span aria-hidden="true">*</span></label>
              <input
                id="wf-tenant-location"
                name="businessLocation"
                type="text"
                autoComplete="address-level2"
                required
                placeholder="City, State, Country"
              />
            </div>
            <div className={`${styles.field} ${styles.full}`}>
              <label htmlFor="wf-tenant-website">Business Website</label>
              <input
                id="wf-tenant-website"
                name="businessWebsite"
                type="url"
                autoComplete="url"
                placeholder="https://example.com"
                aria-describedby="wf-tenant-website-help"
              />
              <p id="wf-tenant-website-help" className={styles.help}>
                Optional - include this if your business has a website.
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            <Button type="submit" className={styles.submitButton}>
              Start 30-Day Trial
            </Button>
          </div>

          <p
            ref={successRef}
            id="wf-tenant-form-success"
            className={styles.success}
            aria-live="polite"
            tabIndex={-1}
            hidden={!successMessage}
          >
            {successMessage}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
