import { Product } from "@/types";

export const products: Product[] = [
  {
    id: 1,
    name: "Ethiopian Yirgacheffe",
    description: "A light-bodied coffee with floral and citrus notes, perfect for a bright morning.",
    price: 12.99,
    image: "/images/ethiopian-yirgacheffe.jpg",
    category: "Single Origin",
    inStock: true
  },
  {
    id: 2,
    name: "Colombian Supremo",
    description: "Medium-bodied with a balanced flavor profile and nutty undertones.",
    price: 11.99,
    image: "/images/colombian-supremo.jpg",
    category: "Single Origin",
    inStock: true
  },
  {
    id: 3,
    name: "Kenyan AA",
    description: "Full-bodied with wine-like acidity and berry notes.",
    price: 13.99,
    image: "/images/kenyan-aa.jpg",
    category: "Single Origin",
    inStock: true
  },
  {
    id: 4,
    name: "Morning Blend",
    description: "A smooth blend perfect for starting your day.",
    price: 10.99,
    image: "/images/morning-blend.jpg",
    category: "Blend",
    inStock: true
  },
  {
    id: 5,
    name: "Dark Roast",
    description: "Rich and bold with chocolate and caramel notes.",
    price: 11.99,
    image: "/images/dark-roast.jpg",
    category: "Blend",
    inStock: false
  }
];
