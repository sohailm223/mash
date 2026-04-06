// simple helper for interacting with the foods API

export async function getFoods(queryString = "") {
  
  const res = await fetch(`/api/foods?${queryString}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch foods");
  const result = await res.json();
  return result; // previously we returned result.data, causing undefined
}

export async function addFood(foodData) {
  const res = await fetch("/api/foods", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(foodData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to add food item.");
  }
  return res.json();
}


export async function getRandomFood(excludeIds = []) {
  const params = new URLSearchParams();
  params.append("random", "1");
  excludeIds.forEach((id) => params.append("exclude", id));

  const res = await fetch(`/api/foods?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch random food");
  const result = await res.json();
  // API now returns the item directly (or null), not { data: ... }
  return result;
}


