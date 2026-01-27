import { client } from "../client";
import type { ResAuth, ResAuthMe } from "../models/user";

export function signUpUserApi({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}): Promise<ResAuth> {
  return client
    .post("/auth/register", {
      email,
      username,
      password,
    })
    .then((response) => response.data);
}

export function signInUserApi({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ResAuth> {
  return client
    .post("/auth/login", {
      email,
      password,
    })
    .then((response) => response.data);
}

export const checkTokenApi = ({
  token,
}: {
  token: string;
}): Promise<ResAuthMe> => {
  return client
    .get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
};
