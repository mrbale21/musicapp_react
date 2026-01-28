import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import useApi from "../apis/api";
import { signInUserApi } from "../apis/endpoints/auth";
import { useNavigate } from "react-router-dom";
import { client } from "../apis/client";

interface IFormInput {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [showPassword, _setShowPassword] = useState(false);
  const [_cookies, setCookie] = useCookies(["app_user_token"]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<IFormInput>();

  const onLogin = useApi({
    api: signInUserApi,
    // LoginForm.tsx
    onSuccess: (data) => {
      if (data?.data.token) {
        const token = data.data.token;
        setCookie("app_user_token", token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        // TAMBAHKAN INI: Update instance axios secara langsung
        client.defaults.headers.Authorization = `Bearer ${token}`;

        toast.success("Login berhasil! 🎉");
        navigate("/home", { replace: true }); // Langsung ke /home agar tidak kena redirect loop
      }
    },
    onFail: (error) => {
      // Error handling is done in api.ts, but we can add specific handling here if needed
      // The error will be automatically handled by the interceptor and api.ts
      throw error; // WAJIB!
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { email, password } = data;

    try {
      await toast.promise(
        onLogin.process({
          email,
          password,
        }),
        {
          pending: "Memverifikasi akun...",
          success: "Login berhasil! 🎉",
          error: "Username atau password salah",
        },
      );
    } catch (error) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
            <i className="fas fa-music text-3xl text-spotify-green"></i>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SoundWave</h1>
          <p className="text-spotify-gray">Music recommendation system</p>
        </div>

        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Log in to your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-spotify-gray mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-spotify-gray"></i>
                </div>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "email wajib diisi",
                  })}
                  className="w-full pl-10 pr-3 py-3 bg-spotify-light-dark border border-spotify-light-gray rounded-xl text-white placeholder-spotify-gray focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-spotify-gray mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-spotify-gray"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password wajib diisi",
                    minLength: { value: 6, message: "Minimal 6 karakter" },
                  })}
                  id="password"
                  className="w-full pl-10 pr-3 py-3 bg-spotify-light-dark border border-spotify-light-gray rounded-xl text-white placeholder-spotify-gray focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* <div className="flex items-center justify-between mb-6">
              <a
                href="#"
                className="text-sm font-medium text-spotify-green hover:text-green-400"
              >
                Forgot password?
              </a>
            </div> */}

            <button
              type="submit"
              className="w-full bg-spotify-green hover:bg-green-500 text-white font-bold py-3 rounded-xl transition duration-200 mb-6"
            >
              Log In
            </button>

            <div className="text-center">
              <p className="text-spotify-gray">
                Belum punya akun?
                <button
                  type="button"
                  // onClick={onSwitchToRegister}
                  className="font-medium text-spotify-green hover:text-green-400"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>

        <div className="text-center mt-8 text-spotify-gray text-sm">
          <p>SoundWave.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
