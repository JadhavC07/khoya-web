"use client";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { accessToken, refreshToken, logoutStatus, logoutError } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    if (accessToken && refreshToken) {
      dispatch(logoutUser({ accessToken, refreshToken }));
    }
  };

  useEffect(() => {
    if (logoutStatus === "success") {
      router.push("/login");
    }
  }, [logoutStatus, router]);

  return (
    <>
      <button
        onClick={handleLogout}
        className="text-sm rounded-md px-3 py-2 bg-secondary text-secondary-foreground"
        disabled={logoutStatus === "loading"}
        aria-label="Logout"
      >
        {logoutStatus === "loading" ? "Logging out..." : "Logout"}
      </button>
      {logoutStatus === "error" && (
        <span className="text-red-500 ml-2">{logoutError}</span>
      )}
    </>
  );
}
