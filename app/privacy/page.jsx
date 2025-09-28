import  { Metadata } from "next";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Khoya collects, uses, and protects your personal data. Your privacy and safety are our priority.",
  alternates: { canonical: "/privacy" },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "Khoya Privacy Policy",
    url: `${siteUrl}/privacy`,
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
        name: "Privacy Policy",
        item: `${siteUrl}/privacy`,
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
      <h1>{"Privacy Policy"}</h1>
      <p>
        <em>{"Effective Date: [Date]"}</em>
      </p>

      <h2>{"1. Introduction"}</h2>
      <p>
        {
          "Welcome to Khoya! We are committed to protecting your privacy. This Privacy Policy outlines the types of personal information that we collect, how we use it, and the measures we take to protect your data. By using our platform, you agree to the collection and use of information in accordance with this policy."
        }
      </p>

      <h2>{"2. Information We Collect"}</h2>
      <ul>
        <li>
          <strong>{"Personal Identification Information:"}</strong>{" "}
          {
            "When you create an account, report a missing person, or interact with our platform, we collect personal data such as name, contact details (email, phone number), and location."
          }
        </li>
        <li>
          <strong>{"Geolocation Information:"}</strong>{" "}
          {
            "We collect and store the location data of missing persons to help notify nearby people and law enforcement."
          }
        </li>
        <li>
          <strong>{"Media Content:"}</strong>{" "}
          {
            "Images, videos, and other media submitted by users when reporting a missing person."
          }
        </li>
      </ul>

      <h2>{"3. How We Use Your Information"}</h2>
      <ul>
        <li>{"Notify users of missing persons in their vicinity."}</li>
        <li>
          {
            "Enable public awareness through social media integrations (Facebook, Instagram)."
          }
        </li>
        <li>
          {
            "Provide law enforcement with relevant information to assist in locating missing individuals."
          }
        </li>
        <li>
          {
            "Improve our platform by analyzing user activity and interactions with our services."
          }
        </li>
      </ul>

      <h2>{"4. Data Sharing"}</h2>
      <p>
        {
          "We do not sell or rent your personal data to third parties. However, we may share your information with law enforcement and trusted service providers who are obligated to protect your data."
        }
      </p>

      <h2>{"5. Data Security"}</h2>
      <p>
        {
          "We use industry-standard encryption and secure storage practices. No method is 100% secure, but we work to safeguard your data."
        }
      </p>

      <h2>{"6. Your Rights"}</h2>
      <ul>
        <li>{"Access your data."}</li>
        <li>{"Update your data."}</li>
        <li>{"Delete your data."}</li>
        <li>{"Opt-out of communications."}</li>
      </ul>

      <h2>{"7. Cookies"}</h2>
      <p>
        {
          "We use cookies to enhance user experience. You can control cookie settings in your browser."
        }
      </p>

      <h2>{"8. Changes to This Privacy Policy"}</h2>
      <p>
        {
          "We may update this policy from time to time. Changes appear on this page with an updated effective date."
        }
      </p>

      <h2>{"9. Contact Us"}</h2>
      <p>{"Email: [Your email] • Address: [Your address]"}</p>
    </article>
  );
}
