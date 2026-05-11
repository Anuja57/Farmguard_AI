import { apiBaseUrl } from "./utils";

function getToken() {
  return localStorage.getItem("farmguard_token");
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const payload = await response.json();
      message = payload.detail || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  return response.json();
}

export async function login(data) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function register(data) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function askAI(data) {
  return request("/ask-ai", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getWeather(location) {
  return request(`/weather/${encodeURIComponent(location)}`);
}

export async function getMarketPrices(crop) {
  return request(`/market-prices/${encodeURIComponent(crop)}`);
}

export async function getNotifications() {
  return request("/notifications");
}

export async function getAnalytics() {
  return request("/analytics");
}

export async function detectDisease({ cropName, description, file }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", description || "");
  return request(`/detect-disease?crop_name=${encodeURIComponent(cropName)}`, {
    method: "POST",
    body: formData,
  });
}
