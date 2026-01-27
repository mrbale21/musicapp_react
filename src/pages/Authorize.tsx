import { useCookies } from "react-cookie";
import useApi from "../apis/api";
import { checkTokenApi } from "../apis/endpoints/auth";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { client } from "../apis/client";
import { useUserData } from "../hooks/zustand";
import LoadingSpinner from "../components/common/LoadingSpinner";

export const Authorize = () => {
  const location = useLocation();
  const { setUser } = useUserData();
  const [cookies, , removeCookie] = useCookies(["app_user_token"]);
  const [status, setStatus] = useState<"loading" | "ok" | "unauth">("loading");

  const checkToken = useApi({
    api: checkTokenApi,
    onSuccess: (data) => {
      client.defaults.headers.Authorization = `Bearer ${cookies.app_user_token}`;
      setUser(data?.data ?? null);
      setStatus("ok");
    },
    onFail: () => {
      removeCookie("app_user_token", { path: "/" });
      delete client.defaults.headers.Authorization;
      setUser(null);
      setStatus("unauth");
    },
  });

  useEffect(() => {
    const token = cookies.app_user_token;

    if (!token) {
      setStatus("unauth");
      return;
    }

    client.defaults.headers.Authorization = `Bearer ${token}`;
    checkToken.process({ token });
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
