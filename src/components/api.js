/**
 * Common API methods for Food operations.
 * Using relative paths ('/api/...') works automatically for local and production.
 */

export async function getFoods(queryString = "") {
  const res = await fetch(`/api/foods?${queryString}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch foods");
  }

  const result = await res.json();
  return result.data;
}

export async function addFood(foodData) {
  const res = await fetch("/api/foods", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(foodData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add food item.");
  }

  return res.json();
}

// fetch a single random food item (optionally excluding some ids)
export async function getRandomFood(excludeIds = []) {
  const params = new URLSearchParams();
  params.append("random", "1");
  excludeIds.forEach((id) => params.append("exclude", id));

  const res = await fetch(`/api/foods?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch random food");
  }

  const result = await res.json();
  return result.data;
}

// save a like/dislike preference to the user profile
export async function savePreference(foodId, action) {
  const res = await fetch("/api/users", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ foodId, action }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to save preference");
  }
  return res.json();
}

export async function getProfile() {
  const res = await fetch("/api/users", { cache: "no-store", credentials: "include" });
  if (!res.ok) {
    // convert server error JSON if possible
    try {
      const err = await res.json();
      return { success: false, ...err };
    } catch {
      return { success: false, message: "Failed to fetch profile" };
    }
  }
  return res.json();
}

// auth endpoints
export async function register({ name, email, password }) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function login({ email, password }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function logout() {
  const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  return res.json();
}

// questionnaire management
export async function submitQuestionnaire(answers) {
  const res = await fetch("/api/users", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  return res.json();
}

export async function skipQuestionnaire() {
  const res = await fetch("/api/users", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skip: true }),
  });
  return res.json();
}
