"use client";

const BASE = process.env.NEXT_PUBLIC_API_BASE!;

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status}`);
  }

  return res.json().catch(() => ({}));
}

export async function apiLogin(username: string, password: string) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  }) as Promise<{ token: string }>;
}

export async function apiRegister(name: string, username: string, password: string) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify({ name, username, password }),
  });
}

export async function apiAddActivity(token: string, meetingCode: string) {
  return request("/add_to_activity", {
    method: "POST",
    body: JSON.stringify({ token, meeting_code: meetingCode }),
  });
}

export async function apiGetActivity(token: string) {
  const url = `/get_all_activity?token=${encodeURIComponent(token)}`;
  return request(url) as Promise<Array<{ meetingCode: string; date: string }>>;
}
