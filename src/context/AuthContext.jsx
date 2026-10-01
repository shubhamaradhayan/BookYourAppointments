import { createContext, useContext, useEffect, useState } from "react";

import {
  apiGet,
  apiPost,
  clearAuthTokens,
  getAccessToken,
  setAuthTokens,
} from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadCurrentUser() {
    if (!getAccessToken()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await apiGet("auth/me");

      if (response.data?.success) {
        setUser(response.data.user);
      } else {
        // clearAuthTokens();
        setUser(null);
      }
    } catch {
      // clearAuthTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function loginWithGoogle(credential) {
    const response = await apiPost("auth/google", {
      credential,
    });

    if (response.data?.success) {
      setAuthTokens(
        response.data.access_token,
        response.data.refresh_token
      );
      setUser(response.data.user);
    }

    return response.data;
  }

  async function linkGoogleAccount(credential) {
    const response = await apiPost("auth/google/link", {
      credential,
    });

    return response.data;
  }

  async function login(email, password) {
    const response = await apiPost("auth/login", {
      email,
      password,
    });

    if (response.data?.success) {
      setAuthTokens(
        response.data.access_token,
        response.data.refresh_token
      );
      console.log(response.data.access_token,
        response.data.refresh_token);
      
      setUser(response.data.user);
    }

    return response.data;
  }

  async function register(payload) {
    const response = await apiPost("auth/register", payload);

    if (response.data?.success) {
      setAuthTokens(
        response.data.access_token,
        response.data.refresh_token
      );
      setUser(response.data.user);
    }

    return response.data;
  }

  async function logout() {
    const refreshToken = sessionStorage.getItem("bookflow_refresh_token");

    try {
      await apiPost("auth/logout", {
        refresh_token: refreshToken,
      });
    } finally {
      clearAuthTokens();
      setUser(null);
    }
  }

  useEffect(() => {
    loadCurrentUser();

    function handleExpiredSession() {
      setUser(null);
      setLoading(false);
    }

    window.addEventListener(
      "bookflow:session-expired",
      handleExpiredSession
    );

    return () => {
      window.removeEventListener(
        "bookflow:session-expired",
        handleExpiredSession
      );
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        linkGoogleAccount,
        register,
        logout,
        refreshUser: loadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
