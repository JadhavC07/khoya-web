"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/authSlice";
import { RootState } from "@/redux/store";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        type="email"
      />
      <input
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
        type="password"
      />
      <button type="submit" disabled={status === "loading"}>
        Login
      </button>
      {status === "error" && <div className="text-red-500">{error}</div>}
      {status === "success" && (
        <div className="text-green-500">Login successful!</div>
      )}
    </form>
  );
}
