export interface Recipe {
  id: string;
  userId: string;
  name: string;
  ingredients: string[];
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  category: string;
  photoURL?: string;
}

export interface Meal {
  id: number;
  recipeId: string;
  date: Date;
}