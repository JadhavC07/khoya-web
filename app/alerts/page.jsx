import MissingPersonTab from "@/components/MissingPersonTab";

export const metadata = {
  title: "Missing Persons Alerts",
  description:
    "View active missing person alerts in your area and help bring loved ones home.",
  alternates: { canonical: "/alerts" },
  openGraph: {
    url: "/alerts",
    title: "Missing Persons Alerts | Khoya",
    description:
      "View active missing person alerts in your area and help bring loved ones home.",
  },
};

export default function AlertsPage() {
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Missing Persons",
        item: "/alerts",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-pretty">
            Missing Persons Alerts
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            View active missing person alerts in your area. If you have any
            information, please contact the authorities immediately.
          </p>
        </div>
        <MissingPersonTab />
      </div>
    </>
  );
}
