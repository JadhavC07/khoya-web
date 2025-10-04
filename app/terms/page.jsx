export const metadata = {
  title: "Terms & Conditions",
  description:
    "Terms governing your use of the Khoya platform. Please read carefully before using our services.",
  alternates: { canonical: "/terms" },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TermsOfService",
    name: "Khoya Terms of Service",
    url: `${siteUrl}/terms`,
    about: "Terms and conditions for using the Khoya platform",
    publisher: { "@type": "Organization", name: "Khoya" },
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Terms of Service",
        item: `${siteUrl}/terms`,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:py-16 prose prose-stone dark:prose-invert">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <h1>{"Terms of Service"}</h1>
      <p>
        <em>{"Effective Date: [Date]"}</em>
      </p>

      <h2>{"1. Introduction"}</h2>
      <p>
        {
          "These Terms of Service govern your use of the Khoya platform. By accessing or using our platform, you agree to comply with these terms."
        }
      </p>

      <h2>{"2. Platform Description"}</h2>
      <p>
        {
          "Khoya is a platform designed to help report missing persons, notify nearby users, and collaborate with law enforcement."
        }
      </p>

      <h2>{"3. User Responsibilities"}</h2>
      <ul>
        <li>{"Provide accurate information."}</li>
        <li>{"Respect privacy; do not share false information."}</li>
        <li>{"Comply with applicable laws."}</li>
      </ul>

      <h2>{"4. Prohibited Uses"}</h2>
      <ul>
        <li>{"No fraudulent or malicious activity."}</li>
        <li>{"No illegal, offensive, or rights-violating content."}</li>
        <li>{"Do not interfere with platform functionality."}</li>
      </ul>

      <h2>{"5. Account Termination"}</h2>
      <p>
        {
          "We may suspend or terminate accounts for violations. You may terminate your account by contacting us."
        }
      </p>

      <h2>{"6. Data Ownership"}</h2>
      <p>
        {
          "You retain ownership of your data. By submitting content, you grant Khoya a non-exclusive, royalty-free license to use it for awareness and assisting searches."
        }
      </p>

      <h2>{"7. Limitations of Liability"}</h2>
      <ul>
        <li>{"We are not liable for failure to find a missing person."}</li>
        <li>
          {"We are not liable for incorrect information submitted by users."}
        </li>
        <li>
          {
            "Do not rely on the platform for emergencies in place of authorities."
          }
        </li>
      </ul>

      <h2>{"8. Indemnification"}</h2>
      <p>
        {
          "You agree to indemnify Khoya for claims arising from your use of the platform."
        }
      </p>

      <h2>{"9. Changes to These Terms"}</h2>
      <p>
        {"We may update terms at any time. Continued use signifies acceptance."}
      </p>

      <h2>{"10. Governing Law"}</h2>
      <p>{"These terms are governed by the laws of [Your Country]."}</p>

      <h2>{"11. Contact Us"}</h2>
      <p>{"Email: [Your email] • Address: [Your address]"}</p>

      <h3>{"Additional Considerations"}</h3>
      <ul>
        <li>
          {
            "Social media integrations may interact with your accounts as described."
          }
        </li>
        <li>
          {
            "Privacy and Terms pages are easy to find and navigate on all devices."
          }
        </li>
      </ul>
    </article>
  );
}
