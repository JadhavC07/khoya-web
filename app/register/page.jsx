import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "Register",
  description:
    "Create a Khoya account to report missing persons and help bring loved ones home.",
  alternates: { canonical: "/register" },
  openGraph: {
    url: "/register",
    title: "Register | Khoya",
    description:
      "Create a Khoya account to report missing persons and help bring loved ones home.",
  },
};

export default function RegisterPage() {
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Register", item: "/register" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <div className="mx-auto max-w-md px-4 py-16">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Join Khoya to help bring missing persons home
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Login here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
