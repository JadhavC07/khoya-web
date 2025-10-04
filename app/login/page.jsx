"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import Link from "next/link";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { status, error, accessToken } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          type="email"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          type="password"
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-primary text-primary-foreground py-2 rounded"
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
        {status === "error" && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        {accessToken && (
          <div className="text-green-500 text-sm">Login successful!</div>
        )}
      </form>
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="underline text-primary">
          Register
        </Link>
      </div>
    </div>
  );
}
