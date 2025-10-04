"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { submitMissingPersonReport } from "@/redux/alertsSlice";

export default function ReportPage() {
  const auth = useSelector((state) => state.auth);
  const { reportStatus, reportError, reportSuccess } = useSelector((state) => state.alerts);
  const isLoggedIn = !!auth.accessToken;
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
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
    dispatch(submitMissingPersonReport({ formData, accessToken: auth.accessToken }));
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-10 text-center">
        <h2 className="text-xl font-bold mb-4">Login Required</h2>
        <p className="mb-6">You must be logged in to report a missing person.</p>
        <Link href="/login" className="mr-2 underline text-primary">
          Login
        </Link>
        <span>or</span>
        <Link href="/register" className="ml-2 underline text-primary">
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-10">
      <h2 className="text-xl font-bold mb-4">Report a Missing Person</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full"
        />
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 rounded"
          disabled={reportStatus === "loading"}
        >
          {reportStatus === "loading" ? "Submitting..." : "Submit Report"}
        </button>
        {reportSuccess && <div className="text-green-600 mt-2">{reportSuccess}</div>}
        {reportError && <div className="text-red-600 mt-2">{reportError}</div>}
      </form>
    </div>
  );
}