export interface Recipe {
  id: string;
  title: string;
  ingredients: string | string[]; // Allow for both string and array of strings
  instructions: string;
  photoURL?: string; // Make photoURL optional
  userId: string;
}

export interface Meal {
  id: number;
  recipeId: string;
  date: Date;
}