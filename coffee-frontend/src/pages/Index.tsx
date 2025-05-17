import React, { useState } from "react";
import { products, Product } from "@/data/products";
import ProductCard from "@/components/common/ProductCard";
import PaymentModal from "@/components/features/Payment/PaymentModal";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <section className="bg-primary-light py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Coffee Kiosk
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our selection of premium coffee, ready to be delivered to your door with 
            simple M-PESA payments.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Coffee Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onBuy={handleBuy} 
              />
            ))}
          </div>
        </div>
      </section>
      
      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        product={selectedProduct}
      />
    </>
  );
};

export default Index;
