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