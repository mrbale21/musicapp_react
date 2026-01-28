import { useCookies } from "react-cookie";
import useApi from "../apis/api";
import { checkTokenApi } from "../apis/endpoints/auth";
import { useEffect, useState, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { client } from "../apis/client";
import { useUserData } from "../hooks/zustand";
import LoadingSpinner from "../components/common/LoadingSpinner";

export const Authorize = () => {
  const location = useLocation();
  const { setUser } = useUserData();
  const [cookies, , removeCookie] = useCookies(["app_user_token"]);
  const [status, setStatus] = useState<"loading" | "ok" | "unauth">("loading");
  const isCheckingRef = useRef(false);

  const checkToken = useApi({
    api: checkTokenApi,
    onSuccess: (data) => {
      const token = cookies.app_user_token;
      if (token) {
        client.defaults.headers.Authorization = `Bearer ${token}`;
      }
      setUser(data?.data ?? null);
      setStatus("ok");
      isCheckingRef.current = false;
    },
    onFail: (error) => {
      console.error("Token validation failed:", error);
      removeCookie("app_user_token", { path: "/" });
      delete client.defaults.headers.Authorization;
      setUser(null);
      setStatus("unauth");
      isCheckingRef.current = false;
    },
  });

  // Di Authorize.tsx
  useEffect(() => {
    const token = cookies.app_user_token;
    if (!token) {
      setStatus("unauth");
      return;
    }

    const verifyToken = async () => {
      try {
        // Pasang header secara paksa ke instance sebelum memproses
        client.defaults.headers.Authorization = `Bearer ${token}`;

        // Beri sedikit nafas agar cookie/header ter-apply di environment browser
        await new Promise((resolve) => setTimeout(resolve, 50));

        await checkToken.process({ token });
        setStatus("ok");
      } catch (err) {
        setStatus("unauth");
      }
    };

    if (!isCheckingRef.current) {
      isCheckingRef.current = true;
      verifyToken();
    }
  }, [cookies.app_user_token]);

  // ⏳ Loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  // 🔐 Unauthorized
  if (status === "unauth") {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // ✅ Authorized
  return <Outlet />;
};
