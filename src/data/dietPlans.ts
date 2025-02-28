interface Meal {
  name: string;
  items: string[];
  waterReminder?: string;
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
        name: "Breakfast (8:00 AM)",
        items: ["Oatmeal with berries", "Almonds", "Green tea"],
        waterReminder: "Drink 2 glasses of water"
      },
      lunch: {
        name: "Lunch (1:00 PM)",
        items: ["Grilled fish", "Brown rice", "Steamed vegetables"],
        waterReminder: "Drink 2-3 glasses of water"
      },
      dinner: {
        name: "Dinner (7:00 PM)",
        items: ["Lentil soup", "Whole grain bread", "Mixed salad"],
        waterReminder: "Drink 2 glasses of water"
      },
      snacks: {
        name: "Snacks",
        items: ["Fresh fruits", "Nuts", "Yogurt"],
        waterReminder: "Keep sipping water throughout the day"
      }
    }
  },
  {
    name: "Diabetic-Friendly Diet",
    description: "A balanced diet to help manage blood sugar levels.",
    meals: {
      breakfast: {
        name: "Breakfast (8:00 AM)",
        items: ["Multigrain toast", "Egg whites", "Low-fat milk"],
        waterReminder: "Drink 2 glasses of water"
      },
      lunch: {
        name: "Lunch (1:00 PM)",
        items: ["Quinoa bowl", "Grilled chicken", "Vegetables"],
        waterReminder: "Drink 2-3 glasses of water"
      },
      dinner: {
        name: "Dinner (7:00 PM)",
        items: ["Dal", "Brown rice", "Vegetable curry"],
        waterReminder: "Drink 2 glasses of water"
      },
      snacks: {
        name: "Snacks",
        items: ["Apple slices", "Roasted chana", "Green tea"],
        waterReminder: "Keep sipping water throughout the day"
      }
    }
  },
  {
    name: "High-Protein Vegetarian Diet",
    description: "Plant-based diet rich in protein for muscle maintenance and energy.",
    meals: {
      breakfast: {
        name: "Breakfast (8:00 AM)",
        items: ["Paneer bhurji", "Whole wheat roti", "Sprouts"],
        waterReminder: "Start your day with 2 glasses of water"
      },
      lunch: {
        name: "Lunch (1:00 PM)",
        items: ["Chickpea curry", "Quinoa", "Spinach salad"],
        waterReminder: "Drink 2 glasses of water with meal"
      },
      dinner: {
        name: "Dinner (7:00 PM)",
        items: ["Tofu stir-fry", "Brown rice", "Steamed broccoli"],
        waterReminder: "1-2 glasses of water"
      },
      snacks: {
        name: "Snacks",
        items: ["Greek yogurt", "Mixed nuts", "Protein shake"],
        waterReminder: "Stay hydrated between meals"
      }
    }
  },
  {
    name: "Low-Carb Indian Diet",
    description: "Traditional Indian cuisine modified for low carbohydrate intake.",
    meals: {
      breakfast: {
        name: "Breakfast (8:00 AM)",
        items: ["Besan chilla", "Mint chutney", "Coconut water"],
        waterReminder: "2 glasses of water"
      },
      lunch: {
        name: "Lunch (1:00 PM)",
        items: ["Cauliflower rice", "Paneer tikka", "Raita"],
        waterReminder: "2-3 glasses of water"
      },
      dinner: {
        name: "Dinner (7:00 PM)",
        items: ["Grilled fish curry", "Cabbage thoran", "Cucumber salad"],
        waterReminder: "1-2 glasses of water"
      },
      snacks: {
        name: "Snacks",
        items: ["Roasted makhana", "Buttermilk", "Almond barfi"],
        waterReminder: "Regular water intake"
      }
    }
  },
  {
    name: "Anti-Inflammatory Diet",
    description: "Foods that help reduce inflammation and boost immunity.",
    meals: {
      breakfast: {
        name: "Breakfast (8:00 AM)",
        items: ["Turmeric milk", "Chia seed pudding", "Berries"],
        waterReminder: "Start with 2 glasses of warm water"
      },
      lunch: {
        name: "Lunch (1:00 PM)",
        items: ["Salmon curry", "Cauliflower rice", "Ginger tea"],
        waterReminder: "2 glasses of water"
      },
      dinner: {
        name: "Dinner (7:00 PM)",
        items: ["Mushroom soup", "Grilled vegetables", "Golden milk"],
        waterReminder: "1 glass of water"
      },
      snacks: {
        name: "Snacks",
        items: ["Walnuts", "Green tea", "Dark chocolate"],
        waterReminder: "Regular hydration"
      }
    }
  }
];