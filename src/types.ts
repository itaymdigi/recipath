export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  category: string;
}

export interface Meal {
  id: number;
  recipeId: number;
  date: Date;
}