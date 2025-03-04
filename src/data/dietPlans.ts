interface Meal {
  name: string;
  items: string[];
  waterReminder?: string;
  reminder?: boolean; // Added for reminder toggle
}

interface DietPlan {
  name: string;
  description: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal;
  };
}

export const dietPlans: DietPlan[] = [
  {
    name: "Heart-Healthy Diet",
    description: "A diet focused on reducing heart disease risk and maintaining healthy blood pressure.",
    meals: {
      breakfast: {
        name: "Breakfast (7:00 AM)", // Updated from "8:00 AM"
        items: ["Oatmeal with berries", "Almonds", "Green tea"],
        waterReminder: "Drink 2 glasses of water",
        reminder: false // Added reminder field
      },
      lunch: {
        name: "Lunch (12:30 PM)", // Updated from "1:00 PM"
        items: ["Grilled fish", "Brown rice", "Steamed vegetables"],
        waterReminder: "Drink 2-3 glasses of water",
        reminder: false // Added reminder field
      },
      dinner: {
        name: "Dinner (6:30 PM)", // Updated from "7:00 PM"
        items: ["Lentil soup", "Whole grain bread", "Mixed salad"],
        waterReminder: "Drink 2 glasses of water",
        reminder: false // Added reminder field
      },
      snacks: {
        name: "Snacks (Throughout the day)", // Updated from "Snacks"
        items: ["Fresh fruits", "Nuts", "Yogurt"],
        waterReminder: "Keep sipping water throughout the day",
        reminder: false // Added reminder field
      }
    }
  },
  {
    name: "Diabetic-Friendly Diet",
    description: "A balanced diet to help manage blood sugar levels.",
    meals: {
      breakfast: {
        name: "Breakfast (7:00 AM)", // Updated from "8:00 AM"
        items: ["Multigrain toast", "Egg whites", "Low-fat milk"],
        waterReminder: "Drink 2 glasses of water",
        reminder: false // Added reminder field
      },
      lunch: {
        name: "Lunch (12:30 PM)", // Updated from "1:00 PM"
        items: ["Quinoa bowl", "Grilled chicken", "Vegetables"],
        waterReminder: "Drink 2-3 glasses of water",
        reminder: false // Added reminder field
      },
      dinner: {
        name: "Dinner (6:30 PM)", // Updated from "7:00 PM"
        items: ["Dal", "Brown rice", "Vegetable curry"],
        waterReminder: "Drink 2 glasses of water",
        reminder: false // Added reminder field
      },
      snacks: {
        name: "Snacks (Throughout the day)", // Updated from "Snacks"
        items: ["Apple slices", "Roasted chana", "Green tea"],
        waterReminder: "Keep sipping water throughout the day",
        reminder: false // Added reminder field
      }
    }
  },
  {
    name: "High-Protein Vegetarian Diet",
    description: "Plant-based diet rich in protein for muscle maintenance and energy.",
    meals: {
      breakfast: {
        name: "Breakfast (7:00 AM)", // Updated from "8:00 AM"
        items: ["Paneer bhurji", "Whole wheat roti", "Sprouts"],
        waterReminder: "Start your day with 2 glasses of water",
        reminder: false // Added reminder field
      },
      lunch: {
        name: "Lunch (12:30 PM)", // Updated from "1:00 PM"
        items: ["Chickpea curry", "Quinoa", "Spinach salad"],
        waterReminder: "Drink 2 glasses of water with meal",
        reminder: false // Added reminder field
      },
      dinner: {
        name: "Dinner (6:30 PM)", // Updated from "7:00 PM"
        items: ["Tofu stir-fry", "Brown rice", "Steamed broccoli"],
        waterReminder: "1-2 glasses of water",
        reminder: false // Added reminder field
      },
      snacks: {
        name: "Snacks (Throughout the day)", // Updated from "Snacks"
        items: ["Greek yogurt", "Mixed nuts", "Protein shake"],
        waterReminder: "Stay hydrated between meals",
        reminder: false // Added reminder field
      }
    }
  },
  {
    name: "Low-Carb Indian Diet",
    description: "Traditional Indian cuisine modified for low carbohydrate intake.",
    meals: {
      breakfast: {
        name: "Breakfast (7:00 AM)", // Updated from "8:00 AM"
        items: ["Besan chilla", "Mint chutney", "Coconut water"],
        waterReminder: "2 glasses of water",
        reminder: false // Added reminder field
      },
      lunch: {
        name: "Lunch (12:30 PM)", // Updated from "1:00 PM"
        items: ["Cauliflower rice", "Paneer tikka", "Raita"],
        waterReminder: "2-3 glasses of water",
        reminder: false // Added reminder field
      },
      dinner: {
        name: "Dinner (6:30 PM)", // Updated from "7:00 PM"
        items: ["Grilled fish curry", "Cabbage thoran", "Cucumber salad"],
        waterReminder: "1-2 glasses of water",
        reminder: false // Added reminder field
      },
      snacks: {
        name: "Snacks (Throughout the day)", // Updated from "Snacks"
        items: ["Roasted makhana", "Buttermilk", "Almond barfi"],
        waterReminder: "Regular water intake",
        reminder: false // Added reminder field
      }
    }
  },
  {
    name: "Anti-Inflammatory Diet",
    description: "Foods that help reduce inflammation and boost immunity.",
    meals: {
      breakfast: {
        name: "Breakfast (7:00 AM)", // Updated from "8:00 AM"
        items: ["Turmeric milk", "Chia seed pudding", "Berries"],
        waterReminder: "Start with 2 glasses of warm water",
        reminder: false // Added reminder field
      },
      lunch: {
        name: "Lunch (12:30 PM)", // Updated from "1:00 PM"
        items: ["Salmon curry", "Cauliflower rice", "Ginger tea"],
        waterReminder: "2 glasses of water",
        reminder: false // Added reminder field
      },
      dinner: {
        name: "Dinner (6:30 PM)", // Updated from "7:00 PM"
        items: ["Mushroom soup", "Grilled vegetables", "Golden milk"],
        waterReminder: "1 glass of water",
        reminder: false // Added reminder field
      },
      snacks: {
        name: "Snacks (Throughout the day)", // Updated from "Snacks"
        items: ["Walnuts", "Green tea", "Dark chocolate"],
        waterReminder: "Regular hydration",
        reminder: false // Added reminder field
      }
    }
  }
];