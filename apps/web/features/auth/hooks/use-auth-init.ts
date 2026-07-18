"use client";

import { useEffect } from "react";

import { me } from "../api/auth-api";
import { useSetUser } from "../store/selectors";

export function useAuthInit() {
  const setUser = useSetUser();

  useEffect(() => {
    const init = async () => {
      try {
        const data = await me();

        setUser(data.user);
      } catch (error) {
        console.log(error);
        setUser(null);
      }
    };

    init();
  }, [setUser]);
}
