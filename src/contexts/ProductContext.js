import React, { createContext, useContext, useState, useEffect } from "react";
import { productsRef } from "../firebase/firestore";
import { getDocs } from "firebase/firestore";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      const snapshot = await getDocs(productsRef);
      // console.log(snapshot.docs);
      const sortedProducts = snapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        .sort((a, b) => {
          const brandComparison = a.brand.localeCompare(b.brand);
          if (brandComparison !== 0) {
            return brandComparison;
          }
          return a.model.localeCompare(b.model);
        });

      setAllProducts(sortedProducts);
    };

    getAllProducts();
  }, []);

  const getProduct = (id) => {
    return allProducts.find((product) => product.id === id);
  };

  const getRelatedProducts = (category) => {
    return allProducts.filter((product) => product.category === category);
  };

  const globalVal = {
    allProducts,
    getProduct,
    getRelatedProducts,
  };

  return (
    <ProductContext.Provider value={globalVal}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(ProductContext);
};
