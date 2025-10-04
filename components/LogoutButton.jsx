"use client";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { accessToken, refreshToken, status } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    if (accessToken && refreshToken) {
      dispatch(logoutUser({ accessToken, refreshToken }));
    }
  };

  useEffect(() => {
    if (status === "idle" && !accessToken) {
      router.push("/login");
    }
  }, [status, accessToken, router]);

  return (
    <Button
      onClick={handleLogout}
      variant="secondary"
      size="sm"
      disabled={status === "loading"}
      aria-label="Logout"
    >
      {status === "loading" ? "Logging out..." : "Logout"}
    </Button>
  );
}
