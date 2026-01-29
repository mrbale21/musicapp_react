import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import useApi from "../apis/api";
import { signInUserApi } from "../apis/endpoints/auth";
import { useNavigate } from "react-router-dom";

interface IFormInput {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [_cookies, setCookie] = useCookies(["app_user_token"]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  // Auto-hide password setelah 3 detik
  useEffect(() => {
    let timer: number;
    if (passwordVisible) {
      timer = setTimeout(() => {
        setPasswordVisible(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [passwordVisible]);

  const togglePasswordVisibility = () => {
    const newState = !showPassword;
    setShowPassword(newState);
    setPasswordVisible(newState);
  };

  const onLogin = useApi({
    api: signInUserApi,
    onSuccess: (data) => {
      if (!data?.data.token) {
        toast.error("Token tidak ditemukan");
        return;
      }

      if (data) {
        setCookie("app_user_token", data.data.token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        toast.success("Login berhasil! 🎉");
        navigate("/", { replace: true });
      } else {
        toast.error("Token tidak ditemukan");
      }
    },
    onFail: (error) => {
      const status = error;
      if (status === 401) toast.error("Email atau password salah");
      else if (status === 500) toast.error("Server bermasalah");
      else toast.error("Terjadi kesalahan, coba lagi");
      throw error;
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { email, password } = data;
    setIsLoading(true);

    try {
      await toast.promise(
        onLogin.process({
          email,
          password,
        }),
        {
          pending: "Memverifikasi akun...",
          success: "Login berhasil! 🎉",
          error: "Email atau password salah",
        },
      );
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-linear-to-br from-gray-900 via-purple-900/20 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-pink-600/30 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
            style={{
              left: `${15 + i * 35}%`,
              top: `${10 + i * 25}%`,
              animation: `float 3s ease-in-out ${i * 0.5}s infinite`,
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

      <div className="w-full max-w-sm z-10">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-70 animate-pulse"></div>
            <div className="relative w-16 h-16 rounded-2xl bg-black flex items-center justify-center border border-purple-500/30 shadow-lg">
              <i className="fas fa-headphones text-2xl bg-linear-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent"></i>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
            </div>
          </div>

          <h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-1">
            SoundWave
          </h1>
          <p className="text-gray-400 text-sm">
            Temukan musik yang cocok untukmu
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-black/60 backdrop-blur-lg rounded-2xl border border-purple-500/20 shadow-xl shadow-purple-900/30 p-5 mb-5">
          {/* Form Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">Masuk ke Akun</h2>
            </div>
            <p className="text-gray-400 text-xs">
              Selamat datang kembali! Masuk untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-purple-500 to-pink-500"></div>
                <label className="text-sm font-medium text-gray-300">
                  Email
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-envelope text-purple-400/70 text-sm"></i>
                </div>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email wajib diisi",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Format email tidak valid",
                    },
                  })}
                  className="w-full pl-10 pr-3 py-3 bg-gray-900/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                  placeholder="nama@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-pink-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-purple-500 to-pink-500"></div>
                  <label className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                </div>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  <i
                    className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"} text-xs`}
                  ></i>
                  {passwordVisible ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-lock text-purple-400/70 text-sm"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password wajib diisi",
                    minLength: { value: 6, message: "Minimal 6 karakter" },
                  })}
                  className="w-full pl-10 pr-10 py-3 bg-gray-900/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                  placeholder="••••••••"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <i
                    className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"} text-gray-400/70 text-sm`}
                  ></i>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-pink-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden group mb-4"
            >
              <div className="relative w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-sm">Memproses...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">Masuk Sekarang</span>
                    <i className="fas fa-arrow-right text-sm"></i>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Divider */}
          {/* <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-black/60 text-xs text-gray-500">
                atau
              </span>
            </div>
          </div> */}

          {/* Social Login */}
          {/* <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 bg-gray-900/40 hover:bg-gray-800 border border-gray-800 rounded-xl text-xs text-gray-300 transition-all duration-200"
            >
              <i className="fab fa-google text-red-400"></i>
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 bg-gray-900/40 hover:bg-gray-800 border border-gray-800 rounded-xl text-xs text-gray-300 transition-all duration-200"
            >
              <i className="fab fa-facebook text-blue-400"></i>
              <span>Facebook</span>
            </button>
          </div> */}
        </div>

        {/* Register Link */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/10 px-4 py-3">
            <div className="text-left">
              <p className="text-gray-400 text-xs">Belum punya akun?</p>
              <p className="text-white text-xs font-medium">Daftar Sekarang!</p>
            </div>
            <button
              onClick={() => navigate("/register")}
              type="button"
              className="bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-medium py-2 px-3 rounded-xl text-xs transition-all duration-200 flex items-center gap-1"
            >
              <span>Daftar</span>
              <i className="fas fa-arrow-right text-xs"></i>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse delay-150"></div>
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse delay-300"></div>
          </div>
          <p className="text-gray-500 text-xs">
            © 2026 SoundWave • Dengar. Rasakan. Nikmati.
          </p>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent"></div>
    </div>
  );
};

export default LoginForm;
