export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string;
}

export interface Meal {
  id: number;
  recipeId: number;
  date: Date;
}