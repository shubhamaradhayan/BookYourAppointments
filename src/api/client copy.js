import axios from "axios";

/*
 * BookFlow API client.
 *
 * Access tokens are short-lived JWTs. The refresh token is kept separately
 * and used only when the API returns 401.
 *
 * For a higher-security production deployment, move the refresh token to an
 * HttpOnly SameSite cookie on the backend. This client keeps the implementation
 * compatible with the current Core PHP API.
 */

const API_BASE_URL = import.meta.env.DEV
  ? "/bookflow-api/index.php"
  : "./api/index.php";

const ACCESS_TOKEN_KEY = "bookflow_access_token";
const REFRESH_TOKEN_KEY = "bookflow_refresh_token";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAuthTokens(accessToken, refreshToken) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearAuthTokens() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshRequest = null;

async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = axios
      .post(
        API_BASE_URL,
        {
          refresh_token: getRefreshToken(),
        },
        {
          params: { route: "auth/refresh" },
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        if (!response.data?.success) {
          throw new Error("Unable to refresh session.");
        }

        setAuthTokens(
          response.data.access_token,
          response.data.refresh_token
        );

        return response.data.access_token;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      !getRefreshToken() ||
      originalRequest?.params?.route === "auth/refresh"
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthTokens();
      window.dispatchEvent(new Event("bookflow:session-expired"));

      return Promise.reject(refreshError);
    }
  }
);

export function apiGet(route, params = {}) {
  return apiClient.get("", {
    params: {
      route,
      ...params,
    },
  });
}

export function apiPost(route, data = {}) {
  return apiClient.post("", data, {
    params: { route },
  });
}

export function apiPut(route, data = {}) {
  return apiClient.put("", data, {
    params: { route },
  });
}

export function apiPatch(route, data = {}) {
  return apiClient.patch("", data, {
    params: { route },
  });
}

export function apiDelete(route) {
  return apiClient.delete("", {
    params: { route },
  });
}

export function uploadFile(route, formData) {
  return apiClient.post("", formData, {
    params: { route },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export default apiClient;
