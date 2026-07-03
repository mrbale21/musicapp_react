import type { UserLike, UserPlay } from "./user_activity";

export interface ResAuth {
  data: {
    token: string;
    user: UserModel;
    message: string;
    status: string;
  };
}
export interface ResAuthMe {
  data: UserModel; // Untuk /auth/me, data langsung berisi User
  message: string;
  status: string;
}
// models/User.ts
export interface UserModel {
  id: number;
  username: string;
  email: string;
  password?: string; // Usually omitted in responses
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  role: string;

  // Relationships
  likes?: UserLike[];
  plays?: UserPlay[];
}

// models/UserRegister.ts
export interface UserRegister {
  username: string;
  email: string;
  password: string;
}

// models/UserLogin.ts
export interface UserLogin {
  email: string;
  password: string;
}

// models/AuthResponse.ts
export interface AuthResponse {
  token: string;
  user: UserModel;
}
