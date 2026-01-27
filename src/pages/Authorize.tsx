// pages/Authorize.tsx
import { useCookies } from "react-cookie";
import useApi from "../apis/api";
import { checkTokenApi } from "../apis/endpoints/auth";
import React, { useEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { client } from "../apis/client";
import { useUserData } from "../hooks/zustand";
import LoadingSpinner from "../components/common/LoadingSpinner";

export const Authorize = () => {
  const location = useLocation();
  const { setUser } = useUserData();
  const [cookies, , removeCookie] = useCookies(["app_user_token"]);
  const [status, setStatus] = useState<"loading" | "ok">("loading");
  const hasRun = useRef(false);

  const checkToken = useApi({
    api: checkTokenApi,
    onSuccess: (data) => {
      client.defaults.headers.Authorization = `Bearer ${cookies.app_user_token}`;
      setUser(data?.data ?? null);
      setStatus("ok");
    },
    onFail: () => {
      removeCookie("app_user_token", {
        path: "/",
      });

      localStorage.removeItem("app_user_token");
      sessionStorage.removeItem("app_user_token");

      delete client.defaults.headers.Authorization;

      setUser(null);

      return <Navigate to="/auth" replace />;
    },
  });

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = cookies.app_user_token;

    if (!token) {
      setStatus("ok"); // Allow rendering but will redirect
      return;
    }

    client.defaults.headers.Authorization = `Bearer ${token}`;
    checkToken.process({ token });
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  // Jika tidak ada token, redirect ke login
  if (!cookies.app_user_token) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Jika ada token, render children routes
  return <Outlet />;
};
