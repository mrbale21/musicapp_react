// import React, { useEffect, useState } from "react";
// import type { AuthProps, RegisterFormData } from "../../apis/models/auth";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import useApi from "../../apis/api";
// import { signUpUserApi } from "../../apis/endpoints/auth";
// import { toast } from "react-toastify";

// export const RegisterForm: React.FC<AuthProps> = ({
//   onToggleMode,
//   isLogin,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<RegisterFormData>();

//   const [isLoading, setIsLoading] = useState(false);
//   const onRegister = useApi({
//     api: signUpUserApi,
//   });

//   const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
//     setIsLoading(true);

//     try {
//       const result = await toast.promise(
//         onRegister.process({
//           fullname: data.fullName,
//           role: data.role,
//           username: data.username,
//           password: data.password,
//         }),
//         {
//           pending: "Membuat akun...",
//           success: "Registrasi berhasil! 🎉",
//           error: "Registrasi gagal",
//         }
//       );

//       // Reset form setelah sukses
//       reset();
//     } catch (error) {
//       console.error("Registration error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <div>
//         <label
//           htmlFor="fullName"
//           className="block text-sm font-medium text-gray-700 mb-2"
//         >
//           Full Name
//         </label>
//         <input
//           type="text"
//           id="fullName"
//           {...register("fullName", {
//             required: "FullName is required",
//             minLength: {
//               value: 2,
//               message: "Full name must be at least 2 characters",
//             },
//           })}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
//           placeholder="Enter your full name"
//         />
//         {errors.fullName && (
//           <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
//         )}
//       </div>

//       <div>
//         <label
//           htmlFor="username"
//           className="block text-sm font-medium text-gray-700 mb-2"
//         >
//           Username
//         </label>
//         <input
//           type="text"
//           id="username"
//           {...register("username", {
//             required: "Username is required",
//             minLength: {
//               value: 3,
//               message: "Username must be at least 3 characters",
//             },
//           })}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
//           placeholder="Enter your username"
//         />
//         {errors.username && (
//           <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
//         )}
//       </div>

//       <div>
//         <label
//           htmlFor="role"
//           className="block text-sm font-medium text-gray-700 mb-2"
//         >
//           Role
//         </label>
//         <select
//           id="role"
//           {...register("role", { required: "Role is required" })}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
//         >
//           <option value="">Select Role</option>
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//           <option value="kasir">Kasir</option>
//         </select>
//         {errors.role && (
//           <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
//         )}
//       </div>

//       <div>
//         <label
//           htmlFor="password"
//           className="block text-sm font-medium text-gray-700 mb-2"
//         >
//           Password
//         </label>
//         <input
//           type="password"
//           id="password"
//           {...register("password", {
//             required: "Password is required",
//             minLength: {
//               value: 6,
//               message: "Password must be at least 6 characters",
//             },
//           })}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
//           placeholder="Create a password"
//         />
//         {errors.password && (
//           <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
//         )}
//       </div>

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {isLoading ? "Creating Account..." : "Create Account"}
//       </button>

//       <div className="text-center">
//         <span className="text-gray-600 text-sm">
//           Already have an account?{" "}
//           <button
//             type="button"
//             onClick={onToggleMode}
//             className="text-amber-600 hover:text-amber-500 font-medium transition-colors"
//           >
//             Sign in
//           </button>
//         </span>
//       </div>
//     </form>
//   );
// };
