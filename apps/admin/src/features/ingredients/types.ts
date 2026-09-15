/** Flattened, table-friendly view of a contract `Ingredient`. */
export type IngredientRow = {
  id: string;
  code: string;
  name: string;
  aliases: string;
  status: 'active' | 'inactive';
  emoji: string | null;
  icon: string | null;
};
