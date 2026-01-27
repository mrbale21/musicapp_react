// // LoginForm.tsx - FIXED for Mobile
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useApi from "../../apis/api";
// import { signInUserApi } from "../../apis/endpoints/auth";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { useCookies } from "react-cookie";
// import { useUserData } from "../../hooks/zustand";
// import { toast } from "react-toastify";
// import { Eye, EyeOff, Loader2 } from "lucide-react";
// import type { AuthProps } from "../../apis/models/auth";

// interface IFormInput {
//   username: string;
//   password: string;
//   tenant_code: string;
// }

// export const LoginForm: React.FC<AuthProps> = ({ onToggleMode }) => {
//   const [cookies, setCookie] = useCookies(["app_user_token"]);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { setUser } = useUserData();
//   const navigate = useNavigate();
//   const {
//     register
//     handleSubmit,
//     formState: { errors },
//   } = useForm<IFormInput>();

//   const onLogin = useApi({
//     api: signInUserApi,
//     onSuccess: (data) => {
//       if (!data?.token) {
//         toast.error("Token tidak ditemukan");
//         setIsLoading(false);
//         return;
//       }

//       if (data) {
//         setCookie("app_user_token", data.token, {
//           path: "/",
//           maxAge: 60 * 60 * 24 * 7,
//         });

//         toast.success("Login berhasil! 🎉");

//         setTimeout(() => navigate("/orders", { replace: true }), 150);
//       } else {
//         toast.error("Token tidak ditemukan");
//         setIsLoading(false);
//       }
//     },
//     onFail: (error) => {
//       setIsLoading(false);

//       const status = error;

//       if (status === 401) toast.error("Username atau password salah");
//       else if (status === 404) toast.error("Kode tenant tidak ditemukan");
//       else if (status === 500) toast.error("Server bermasalah");
//       else toast.error("Terjadi kesalahan, coba lagi");

//       throw error; // WAJIB!
//     },
//   });

//   const onSubmit: SubmitHandler<IFormInput> = async (data) => {
//     setIsLoading(true);

//     const { username, password, tenant_code } = data;

//     try {
//       await toast.promise(
//         onLogin.process({
//           username,
//           password,
//           tenant_code,
//         }),
//         {
//           pending: "Memverifikasi akun...",
//           success: "Login berhasil! 🎉",
//           error: "Username atau password salah",
//         }
//       );
//     } catch (error) {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     toast.info(
//       <div>
//         <p className="font-medium mb-1">Hubungi Admin</p>
//         <p className="text-sm opacity-90">
//           Silakan hubungi admin sistem untuk reset password.
//         </p>
//       </div>,
//       { autoClose: 5000 }
//     );
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-4 md:space-y-6 w-full"
//       noValidate
//     >
//       {/* Username */}
//       <div>
//         <label
//           htmlFor="username"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Username<span className="text-red-500 ml-1">*</span>
//         </label>
//         <input
//           id="username"
//           type="text"
//           {...register("username", {
//             required: "Username wajib diisi",
//             minLength: { value: 3, message: "Minimal 3 karakter" },
//             pattern: {
//               value: /^[a-zA-Z0-9_]+$/,
//               message: "Hanya huruf, angka, dan underscore",
//             },
//           })}
//           className={`w-full px-4 py-3 text-base md:text-sm border rounded-lg focus:ring-2
//             ${errors.username ? "border-red-500 bg-red-50" : "border-gray-300"}
//             ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
//           `}
//           placeholder="cth: budi_123"
//           disabled={isLoading}
//           inputMode="text"
//           autoCapitalize="none"
//           autoCorrect="off"
//           spellCheck="false"
//         />

//         {errors.username && (
//           <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
//             ⚠ {errors.username.message}
//           </p>
//         )}
//       </div>

//       {/* Password */}
//       <div>
//         <label
//           htmlFor="password"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Password<span className="text-red-500 ml-1">*</span>
//         </label>

//         <div className="relative">
//           <input
//             id="password"
//             type={showPassword ? "text" : "password"}
//             {...register("password", {
//               required: "Password wajib diisi",
//               minLength: { value: 6, message: "Minimal 6 karakter" },
//             })}
//             className={`w-full px-4 py-3 pr-12 text-base md:text-sm border rounded-lg focus:ring-2
//               ${
//                 errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
//               }
//               ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
//             `}
//             placeholder="Minimal 6 karakter"
//             disabled={isLoading}
//             autoComplete="current-password"
//           />

//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md
//               ${showPassword ? "text-amber-600" : "text-gray-500"}
//             `}
//           >
//             {showPassword ? (
//               <EyeOff className="w-5 h-5" />
//             ) : (
//               <Eye className="w-5 h-5" />
//             )}
//           </button>
//         </div>

//         {errors.password && (
//           <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
//             ⚠ {errors.password.message}
//           </p>
//         )}
//       </div>

//       {/* Tenant Code */}
//       <div>
//         <label
//           htmlFor="tenant_code"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Kode Tenant<span className="text-red-500 ml-1">*</span>
//         </label>
//         <input
//           id="tenant_code"
//           type="text"
//           {...register("tenant_code", {
//             required: "Kode tenant wajib diisi",
//             minLength: { value: 3, message: "Minimal 3 karakter" },
//             maxLength: { value: 10, message: "Maksimal 10 karakter" },
//           })}
//           className={`w-full px-4 py-3 text-base md:text-sm border rounded-lg focus:ring-2 uppercase
//             ${
//               errors.tenant_code
//                 ? "border-red-500 bg-red-50"
//                 : "border-gray-300"
//             }
//             ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
//           `}
//           placeholder="cth: CAFE001"
//           disabled={isLoading}
//           inputMode="text"
//           autoCapitalize="characters"
//           autoCorrect="off"
//           spellCheck="false"
//         />

//         {errors.tenant_code && (
//           <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
//             ⚠ {errors.tenant_code.message}
//           </p>
//         )}

//         <p className="mt-1 text-xs text-gray-500">
//           Kode unik untuk identifikasi cabang cafe/restaurant Anda
//         </p>
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3">
//         <button
//           type="button"
//           onClick={handleForgotPassword}
//           disabled={isLoading}
//           className="text-sm text-amber-600 hover:text-amber-700 py-2"
//         >
//           Lupa Password?
//         </button>

//         <button
//           type="button"
//           onClick={onToggleMode}
//           disabled={isLoading}
//           className="text-sm text-gray-700 hover:text-amber-600 py-2"
//         >
//           Belum punya akun?{" "}
//           <span className="font-medium text-amber-600">Daftar disini</span>
//         </button>
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={isLoading}
//         className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all
//           ${
//             isLoading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-amber-600 hover:bg-amber-700"
//           }
//         `}
//       >
//         {isLoading ? (
//           <span className="flex items-center justify-center gap-2">
//             <Loader2 className="w-5 h-5 animate-spin" />
//             <span className="md:hidden">Memproses...</span>
//             <span className="hidden md:inline">Sedang masuk...</span>
//           </span>
//         ) : (
//           "Masuk ke Sistem"
//         )}
//       </button>

//       {/* Info */}
//       <div className="text-center pt-2">
//         <p className="text-xs text-gray-500">
//           Akun demo:{" "}
//           <code className="bg-gray-100 px-2 py-1 rounded text-amber-600 font-mono">
//             demo / demodemo / CAFE001
//           </code>
//         </p>
//       </div>
//     </form>
//   );
// };

// export default LoginForm;
