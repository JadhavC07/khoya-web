"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSelector, useDispatch } from "react-redux";
import { submitMissingPersonReport } from "@/redux/alertsSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ReportPage() {
  const auth = useSelector((state) => state.auth);
  const { reportStatus, reportError, reportSuccess } = useSelector(
    (state) => state.alerts
  );
  const isLoggedIn = !!auth.accessToken;
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    image: null,
  });

  const handleChange = (e) => {
    const target = e.target;
    const { name, value, files } = target;
    if (name === "image" && files) {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("location", form.location);
    if (form.image) {
      formData.append("image", form.image);
    }
    dispatch(
      submitMissingPersonReport({ formData, accessToken: auth.accessToken })
    );
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Report", item: "/report" },
    ],
  };

  if (!isLoggedIn) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbsJsonLd),
          }}
        />
        <div className="mx-auto max-w-md px-4 py-16">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <CardTitle className="text-xl">
                  Authentication Required
                </CardTitle>
              </div>
              <CardDescription>
                You must be logged in to report a missing person.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Please sign in to your account or create a new one to submit a
                missing person report.
              </p>
              <div className="flex gap-3">
                <Button asChild className="flex-1">
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Report a Missing Person</CardTitle>
            <CardDescription>
              Provide detailed information to help us spread the word and bring
              your loved one home safely.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              encType="multipart/form-data"
            >
              <div className="space-y-2">
                <Label htmlFor="title">Full Name *</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter the missing person's full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Provide detailed physical description, clothing, and circumstances"
                  required
                  rows={5}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Last Known Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, state, or specific address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Photo *</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Upload a clear, recent photo of the missing person
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={reportStatus === "loading"}
              >
                {reportStatus === "loading"
                  ? "Submitting Report..."
                  : "Submit Report"}
              </Button>
              {reportSuccess && (
                <Alert>
                  <AlertDescription className="text-green-600">
                    {reportSuccess}
                  </AlertDescription>
                </Alert>
              )}
              {reportError && (
                <Alert variant="destructive">
                  <AlertDescription>{reportError}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
