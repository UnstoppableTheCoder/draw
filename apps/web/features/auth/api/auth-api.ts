import { axiosClient } from "@/config/axios";
import { LoginPayload, SignupPayload, AuthResponse } from "../types";

export const signup = async (payload: SignupPayload) => {
  const { data } = await axiosClient.post<AuthResponse>(
    "/auth/signup",
    payload,
  );

  return data;
};

export const signin = async (payload: LoginPayload) => {
  const { data } = await axiosClient.post<AuthResponse>("/auth/login", payload);

  return data;
};

export const signout = async () => {
  const { data } = await axiosClient.post("/auth/logout");

  return data;
};

export const me = async () => {
  const { data } = await axiosClient.get<AuthResponse>("/auth/me");

  return data;
};
