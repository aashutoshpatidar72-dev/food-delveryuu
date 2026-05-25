import { FoodItem } from "./types";

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: "classic-deluxe-burger",
    name: "Classic Deluxe Burger",
    subName: "Deluxe Burger",
    rating: 4.8,
    reviewsCount: 300,
    deliveryTime: "30 Min",
    price: 5.84,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
    ingredients: "Ground beef, hamburger buns, salt, pepper, optional Cheese, lettuce, tomato, onions, pickles, mayonnaise.",
    category: "Burger"
  },
  {
    id: "burger-and-strips",
    name: "Burger & Strips",
    subName: "Crispy Combo",
    rating: 4.7,
    reviewsCount: 180,
    deliveryTime: "25 Min",
    price: 4.00,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=400",
    ingredients: "Crispy chicken breast, potato rolls, seasoning, spiced dipping strips, cheddar sauce, leaf lettuce.",
    category: "Burger"
  },
  {
    id: "mandu-momo",
    name: "Mandu Momo",
    subName: "Steamed Dumplings",
    rating: 4.9,
    reviewsCount: 220,
    deliveryTime: "20 Min",
    price: 2.00,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400",
    ingredients: "Flour wrappers, minced chicken or vegetable stuffing, onion, garlic, ginger, cilantro, dipping dumpling sauce.",
    category: "Muffin" // Video categorizes some items or shows them under custom scroll
  },
  {
    id: "spicy-fried-chicken",
    name: "Spicy Fried Chicken",
    subName: "Burger King style",
    rating: 4.5,
    reviewsCount: 150,
    deliveryTime: "35 Min",
    price: 5.00,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400",
    ingredients: "Chicken portions, buttermilk marinade, cayenne pepper flour dredging, dynamic oil frying, hot glaze.",
    category: "All"
  },
  {
    id: "pepperoni-pizza",
    name: "Pepperoni Pizza Slice",
    subName: "Stone Baked",
    rating: 4.6,
    reviewsCount: 290,
    deliveryTime: "15 Min",
    price: 3.50,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
    ingredients: "High-protein flour, yeast, tomato reduction, rich mozzarella, dynamic sliced cured pork pepperoni.",
    category: "Pizza"
  }
];

export const CATEGORIES = ["All", "Burger", "Pizza", "Muffin", "Hot dog"];
export const RELATED_THUMBNAILS = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&q=80&w=150" // cola drink
];
