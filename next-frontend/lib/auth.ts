"use client";

const TOKEN_KEY = "mx_token";
const USERNAME_KEY = "mx_username";
const NAME_KEY = "mx_name";

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(NAME_KEY);
  }
}

export function setUsername(username: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USERNAME_KEY, username);
  }
}

export function getUsername(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(USERNAME_KEY) || "User";
  }
  return "User";
}

export function setName(name: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(NAME_KEY, name);
  }
}

export function getName(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(NAME_KEY) || "User";
  }
  return "User";
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
