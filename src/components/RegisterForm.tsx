import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import useApi from "../apis/api";
import { signUpUserApi } from "../apis/endpoints/auth";
import { useNavigate } from "react-router-dom";

interface IFormInput {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const password = watch("password");

  const onRegister = useApi({
    api: signUpUserApi,
    onSuccess: () => {
      toast.success("Pendaftaran berhasil! 🎉");

      // Redirect ke login setelah 1.5 detik
      setTimeout(() => {
        toast.info("Silakan masuk dengan akun baru Anda");
        navigate("/login", { replace: true });
      }, 1500);
    },
    onFail: (error) => {
      const status = error;
      if (status === 400) toast.error("Data tidak valid");
      else if (status === 409)
        toast.error("Email atau username sudah terdaftar");
      else if (status === 500) toast.error("Server bermasalah");
      else toast.error("Terjadi kesalahan, coba lagi");
      throw error;
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { email, username, password } = data;
    setIsLoading(true);

    try {
      await toast.promise(
        onRegister.process({
          email,
          username,
          password,
        }),
        {
          pending: "Mendaftarkan akun...",
          success: "Pendaftaran berhasil! 🎉",
          error: "Gagal mendaftar",
        },
      );
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-linear-to-br from-gray-900 via-purple-900/20 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-600/30 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
            style={{
              left: `${15 + i * 35}%`,
              top: `${20 + i * 20}%`,
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
              <i className="fas fa-user-plus text-2xl bg-linear-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent"></i>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
            </div>
          </div>

          <h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-1">
            Daftar SoundWave
          </h1>
          <p className="text-gray-400 text-sm">
            Bergabung dengan komunitas musik
          </p>
        </div>

        {/* Register Form Card */}
        <div className="bg-black/60 backdrop-blur-lg rounded-2xl border border-purple-500/20 shadow-xl shadow-purple-900/30 p-5 mb-5">
          {/* Form Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">Buat Akun Baru</h2>
            </div>
            <p className="text-gray-400 text-xs">
              Isi data berikut untuk mulai
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

            {/* Username Input */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-purple-500 to-pink-500"></div>
                <label className="text-sm font-medium text-gray-300">
                  Username
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-user text-purple-400/70 text-sm"></i>
                </div>
                <input
                  type="text"
                  {...register("username", {
                    required: "Username wajib diisi",
                    minLength: {
                      value: 3,
                      message: "Minimal 3 karakter",
                    },
                    maxLength: {
                      value: 20,
                      message: "Maksimal 20 karakter",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Hanya huruf, angka, underscore",
                    },
                  })}
                  className="w-full pl-10 pr-3 py-3 bg-gray-900/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                  placeholder="namapengguna"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-pink-400">
                  {errors.username.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Akan ditampilkan di profil
              </p>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-purple-500 to-pink-500"></div>
                  <label className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  <i
                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}
                  ></i>
                  {showPassword ? "Sembunyikan" : "Tampilkan"}
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
                    minLength: {
                      value: 6,
                      message: "Minimal 6 karakter",
                    },
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
              {/* Password Strength Indicator */}
              <div className="mt-2 grid grid-cols-4 gap-1">
                <div
                  className={`h-1 rounded-full ${password?.length >= 1 ? "bg-red-500" : "bg-gray-700"}`}
                ></div>
                <div
                  className={`h-1 rounded-full ${password?.length >= 3 ? "bg-orange-500" : "bg-gray-700"}`}
                ></div>
                <div
                  className={`h-1 rounded-full ${password?.length >= 5 ? "bg-yellow-500" : "bg-gray-700"}`}
                ></div>
                <div
                  className={`h-1 rounded-full ${password?.length >= 8 ? "bg-green-500" : "bg-gray-700"}`}
                ></div>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-purple-500 to-pink-500"></div>
                  <label className="text-sm font-medium text-gray-300">
                    Konfirmasi Password
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  <i
                    className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}
                  ></i>
                  {showConfirmPassword ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-check-circle text-purple-400/70 text-sm"></i>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Konfirmasi password wajib",
                    validate: (value) =>
                      value === password || "Password tidak cocok",
                  })}
                  className="w-full pl-10 pr-10 py-3 bg-gray-900/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                  placeholder="••••••••"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <i
                    className={`fas ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"} text-gray-400/70 text-sm`}
                  ></i>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-pink-400">
                  {errors.confirmPassword.message}
                </p>
              )}
              {!errors.confirmPassword && watch("confirmPassword") && (
                <p className="mt-1 text-xs text-green-400 flex items-center gap-1">
                  <i className="fas fa-check-circle text-xs"></i>
                  Password cocok
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
                    <span className="text-sm">Mendaftarkan...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus text-sm"></i>
                    <span className="text-sm">Daftar Sekarang</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-black/60 text-xs text-gray-500">
                Sudah punya akun?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <button
            onClick={() => navigate("/login")}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900/40 hover:bg-gray-800 border border-gray-800 rounded-xl text-sm text-gray-300 transition-all duration-200"
          >
            <i className="fas fa-sign-in-alt text-purple-400"></i>
            <span>Masuk ke Akun</span>
            <i className="fas fa-arrow-right text-xs"></i>
          </button>
        </div>

        {/* Features Preview */}
        {/* <div className="text-center">
          <div className="inline-flex items-center gap-4 px-4 py-3 bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <i className="fas fa-music text-purple-400 text-xs"></i>
              </div>
              <span className="text-xs text-gray-300">Playlist Personal</span>
            </div>
            <div className="w-px h-6 bg-gray-800"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <i className="fas fa-star text-purple-400 text-xs"></i>
              </div>
              <span className="text-xs text-gray-300">Rekomendasi Premium</span>
            </div>
          </div>
        </div> */}

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

export default RegisterForm;
