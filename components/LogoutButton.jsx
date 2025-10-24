"use client";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/authSlice";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { accessToken, refreshToken, status } = useSelector(
    (state) => state.auth
  );

  const handleLogout = async () => {
    if (!accessToken || !refreshToken) return;

    try {
      await dispatch(logoutUser({ accessToken, refreshToken })).unwrap();

      // Redirect to home after successful logout
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API fails, clear local state
      dispatch({ type: "auth/clearAuth" });
      router.push("/");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={status === "loading"}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      {status === "loading" ? "Logging out..." : "Logout"}
    </Button>
  );
}
