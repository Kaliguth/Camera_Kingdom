import React, { createContext, useContext, useState, useEffect } from "react";
import { productsRef } from "../firebase/firestore";
import { getDocs, doc } from "firebase/firestore";

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

  const globalVal = {
    allProducts,
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
