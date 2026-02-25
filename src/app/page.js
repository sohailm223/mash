async function getFoods() {
  const res = await fetch("http://localhost:3000/api/foods", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch foods");
  }

  return res.json();
}

export default async function Home() {
  const foods = await getFoods();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">MealMind 🍽️</h1>

      {foods.map((food) => (
        <div key={food._id} className="border p-4 mb-3 rounded">
          <h2 className="font-semibold">{food.name}</h2>
          <p>Calories: {food.calories}</p>
        </div>
      ))}
    </div>
  );
}