import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Help Us Find Missing Persons",
  description:
    "Report missing persons, receive real-time, location-based alerts, and collaborate with law enforcement. Join the Khoya community to make a difference.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
  },
};

export default function HomePage() {
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <header className="bg-card border-b">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 flex flex-col-reverse md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-pretty text-3xl md:text-5xl font-semibold leading-tight">
              {"Khoya - Bringing People Back Together"}
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {
                "At Khoya, we are dedicated to helping families and communities find missing persons quickly and efficiently. Our platform connects people in real-time and shares alerts to the right people, at the right time."
              }
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Button asChild className="bg-primary text-primary-foreground">
                <Link href="#report">{"Report a Missing Person"}</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="#download">{"Download the App"}</Link>
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {
                "Whether you’re reporting a missing person or responding to an alert, we empower individuals and law enforcement to act swiftly and effectively."
              }
            </p>
          </div>
          <div className="flex-1">
            <Image
              src="/placeholder.jpg"
              alt="Community working together to find missing persons"
              width={720}
              height={480}
              className="w-full h-auto rounded-lg border"
              priority
            />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-pretty">
          {"How It Works"}
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">{"1. Report a Missing Person"}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {
                "Fill out a report with details like name, last known location, description, and a photo. The more details you provide, the more effective the search will be."
              }
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">{"2. Alerts to Nearby Users"}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {
                "Our system instantly sends notifications to nearby users who can assist in locating the missing person using geolocation."
              }
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">{"3. Share on Social Media"}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {
                "Increase visibility with automatic sharing to Facebook and Instagram through our integrated platform."
              }
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-lg border bg-muted p-5">
          <h3 className="font-medium">{"4. Real-Time Updates"}</h3>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {
              "Khoya keeps you updated as the search progresses so you remain informed and involved."
            }
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">
          {"Features of Khoya"}
        </h2>
        <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <li className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">{"Real-Time Notifications"}</h3>
            <p className="mt-2 text-muted-foreground">
              {
                "Get alerts for missing persons in your area, helping communities respond quickly."
              }
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">{"Location-Based Search"}</h3>
            <p className="mt-2 text-muted-foreground">
              {"Receive alerts based on proximity to the last known location."}
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">{"Law Enforcement Collaboration"}</h3>
            <p className="mt-2 text-muted-foreground">
              {
                "We work directly with law enforcement to ensure proper procedures."
              }
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">{"Social Media Integration"}</h3>
            <p className="mt-2 text-muted-foreground">
              {
                "Automatically post alerts to Facebook and Instagram to increase awareness."
              }
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <h3 className="font-medium">{"Privacy-Focused"}</h3>
            <p className="mt-2 text-muted-foreground">
              {
                "Your personal data is secure and only used to support the search efforts."
              }
            </p>
          </li>
        </ul>
      </section>

      <section id="download" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">
          {"Join the Effort: Together, We Can Make a Difference"}
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {"Download the app and start contributing to the cause today."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="default">{"Download for iOS"}</Button>
          <Button variant="default">{"Download for Android"}</Button>
        </div>
      </section>

      <section id="report" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">
          {"Report a Missing Person"}
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {
            "Provide as much information as possible to help increase the chances of a safe return."
          }
        </p>
        <div className="mt-6">
          <Button className="bg-primary text-primary-foreground">
            {"Start Report"}
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold">{"Contact Us"}</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {
            "If you have any questions or need assistance, please reach out: Email: [Your email] • Phone: [Your phone number] • Address: [Your address]"
          }
        </p>
      </section>
    </>
  );
}
