
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Espresso",
    price: 150,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1935&q=80",
    description: "Strong and concentrated coffee served in small shots."
  },
  {
    id: 2,
    name: "Cappuccino",
    price: 250,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    description: "Espresso with steamed milk foam, perfect for mornings."
  },
  {
    id: 3,
    name: "Latte",
    price: 280,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1935&q=80",
    description: "Espresso with lots of steamed milk and a light layer of foam."
  },
  {
    id: 4,
    name: "Americano",
    price: 200,
    image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    description: "Espresso diluted with hot water, similar to black coffee."
  },
  {
    id: 5,
    name: "Mocha",
    price: 300,
    image: "https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1935&q=80",
    description: "Espresso with chocolate and steamed milk, topped with whipped cream."
  },
  {
    id: 6,
    name: "Macchiato",
    price: 220,
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    description: "Espresso with a small amount of foamed milk."
  }
];
