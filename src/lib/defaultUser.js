// shared default user data used when authentication is disabled

export const defaultUser = {
  name: "John Doe",
  email: "test@gmail.com",
  profileComplete: false,
  questionnaire: [
    { questionId: "dietType", answer: ["vegetarian"] },
    { questionId: "healthGoals", answer: ["weightLoss"] },
    { questionId: "cuisine", answer: ["italian"] },
    { questionId: "mealTiming", answer: ["lunch"] },
    { questionId: "mood", answer: ["energetic"] },
  ],
};
