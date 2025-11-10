export interface Expense {
  id: string;
  title: string;
  nominal: number;
  type: "income" | "expense";
  category: "salary" | "food" | "transport" | string;
  date: string;
}
