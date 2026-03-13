export const preferenceQuestions = [
  {
    type: "radio",
    title: "Q1 Are you vegetarian or non-vegetarian?",
    name: "dietType",
    options: ["veg", "non-veg"],
  },
  {
    type: "radio",
    title: "Q2 Do you prefer spicy or mild?",
    name: "spiceLevel",
    options: ["Spicy", "Mild", "Normal"],
  },
  {
    type: "checkbox",
    title: "Q3 Any allergies? (max 5)",
    name: "allergies",
    options: ["No allergies", "Oil", "High protein food", "Sugar", "Peanuts", "Dairy"],
  },
  {
    type: "radio",
    title: "Q4 Do you want healthy suggestions?",
    name: "healthSuggestions",
    options: ["Yes", "No"],
  },
  {
    type: "radio",
    title: "Q5 What is your weight goal?",
    name: "weightGoal",
    options: ["Weight Loss", "Weight Gain", "Maintain"],
  },
];