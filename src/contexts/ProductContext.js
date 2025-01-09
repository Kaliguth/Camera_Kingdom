import React, { createContext, useContext, useState, useEffect } from "react";
import { productsRef } from "../firebase/firestore";
import { addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productsLoading, setProductsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      setProductsLoading(true);

      const prductsCollection = await getDocs(productsRef);
      const sortedProducts = prductsCollection.docs
        .map((doc) => {
          const productData = { id: doc.id, ...doc.data() };

          return productData;
        })
        .sort((a, b) => {
          const brandComparison = a.brand.localeCompare(b.brand);
          if (brandComparison !== 0) {
            return brandComparison;
          }
          return a.model.localeCompare(b.model);
        });

      setAllProducts(sortedProducts);
      setProductsLoading(false);
    };

    getAllProducts();
  }, []);

  // Get a product document reference (for document changes)
  const getProductDocRef = (id) => {
    const productRef = doc(productsRef, id);

    return productRef;
  };

  const getProduct = (id) => {
    const product = allProducts.find((product) => product.id === id) || null;

    return product;
  };

  const addReview = (productId, newReview) => {
    // Validate the review input and return an error if empty
    if (!newReview || newReview.message.trim() === "") {
      return Promise.reject(new Error("Cannot submit an empty review"));
    }

    // Create updated products list by adding the review to the correct product
    const updatedProducts = allProducts.map((product) =>
      product.id === productId
        ? {
            ...product,
            reviews: [...product.reviews, newReview],
          }
        : product
    );

    // Get the updated product
    const updatedProduct = updatedProducts.find(
      (product) => product.id === productId
    );

    const productRef = getProductDocRef(productId);

    return updateDoc(productRef, {
      reviews: updatedProduct.reviews,
    })
      .then(() => {
        setAllProducts(updatedProducts);
      })
      .catch((error) => {
        console.log("Error submitting review: ", error);
        return Promise.reject(
          new Error(
            "Failed to submit your review. Please try again or contact support"
          )
        );
      });
  };

  const removeReview = (productId, reviewIndex) => {
    const productRef = getProductDocRef(productId);

    // Create updated products list by removing the review at the given index
    const updatedProducts = allProducts.map((product) =>
      product.id === productId
        ? {
            ...product,
            reviews: product.reviews.filter(
              (_, index) => index !== reviewIndex
            ),
          }
        : product
    );

    // Get the updated product
    const updatedProduct = updatedProducts.find(
      (product) => product.id === productId
    );

    // Update the product's reviews in Firestore
    return updateDoc(productRef, {
      reviews: updatedProduct.reviews,
    })
      .then(() => {
        // Update the local products only if the Firestore update succeeds
        setAllProducts(updatedProducts);
      })
      .catch((error) => {
        console.log("Error removing review: ", error);
        return Promise.reject(
          new Error(
            "Failed to remove your review. Please try again or contact support"
          )
        );
      });
  };

  const getFeaturedProducts = () => {
    const featuredProducts = [];
    const usedIndexes = [];

    // Generate random indexes until we have 5 unique items or run out of products
    while (
      featuredProducts.length < 10 &&
      featuredProducts.length < allProducts.length
    ) {
      const randomIndex = Math.floor(Math.random() * allProducts.length);

      // Check if this index was already used
      if (!usedIndexes.includes(randomIndex)) {
        if (
          allProducts[randomIndex].likes.length >= 3 ||
          allProducts[randomIndex].reviews.length >= 2
        ) {
          featuredProducts.push(allProducts[randomIndex]);
        }
        usedIndexes.push(randomIndex);
      }

      // If all products were iterated over - stop generating
      // (There can be less than 10 related products)
      if (usedIndexes.length === allProducts.length) {
        break;
      }
    }

    // Return the array of featured products
    return featuredProducts;
  };

  const getRelatedProducts = (product) => {
    const relatedProducts = [];
    const usedIndexes = [];

    // Generate random indexes until we have 15 unique items or run out of products
    while (
      relatedProducts.length < 15 &&
      relatedProducts.length < allProducts.length
    ) {
      const randomIndex = Math.floor(Math.random() * allProducts.length);

      // Check if this index was already used
      if (!usedIndexes.includes(randomIndex)) {
        usedIndexes.push(randomIndex);

        const currentProduct = allProducts[randomIndex];

        if (currentProduct !== product) {
          if (
            currentProduct.type === product.type ||
            currentProduct.brand === product.brand
          ) {
            relatedProducts.push(allProducts[randomIndex]);
          }
        }
      }

      // If all products were iterated over - stop generating
      // (There can be less than 15 related products)
      if (usedIndexes.length === allProducts.length) {
        break;
      }
    }

    return relatedProducts;
  };

  // Method to update stocks of products inside a cart when a purchase is made
  const updateProductsStock = (cart) => {
    // Creating array of all stock updates
    const stockUpdates = cart.map((item) => {
      // Getting each product's doc ref and calculating the new stock
      // (Users cannot input a quantity larger than the product's stock so there will never be negative stock)
      const productRef = getProductDocRef(item.id);
      const newStock = item.stock - item.quantity;

      // Update the product's stock
      return updateDoc(productRef, { stock: newStock })
        .then(() => {
          // Update local products list with the new product's stock
          setAllProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === item.id ? { ...product, stock: newStock } : product
            )
          );
        })
        .catch((error) => {
          console.log("Error updating product stocks: ", error);
          throw new Error(
            "An unexpected error occured. Please try again or contact support."
          );
        });
    });

    // Return a Promise that completes when all updates are done
    return Promise.all(stockUpdates);
  };

  // Method to update a product likes
  const updateProductLikes = (product, userId) => {
    const productRef = getProductDocRef(product.id);
    const updatedLikes = product.likes?.includes(userId)
      ? product.likes.filter((like) => like !== userId)
      : [...product.likes, userId];

    return updateDoc(productRef, { likes: updatedLikes })
      .then(() => {
        setAllProducts((prevProducts) =>
          prevProducts.map((currentProduct) =>
            currentProduct.id === product.id
              ? { ...currentProduct, likes: updatedLikes }
              : currentProduct
          )
        );
      })
      .catch((error) => {
        console.log("Error updating product likes: ", error);
        throw new Error(
          "Failed to like the product. Please try again or contact support."
        );
      });
  };

  const deleteProduct = (product) => {
    const productRef = getProductDocRef(product.id);

    return deleteDoc(productRef)
      .then(() => {
        setAllProducts((prevProducts) =>
          prevProducts.filter(
            (currentProduct) => currentProduct.id !== product.id
          )
        );
      })
      .catch((error) => {
        console.log("Error deleting product: ", error);
        throw new Error("Failed to delete the product. Please try again.");
      });
  };

  const addNewProduct = (product) => {
    // Validations:
    // Throws error if brand is empty
    if (!product.brand || product.brand.trim() === "") {
      return Promise.reject(new Error("Brand cannot be empty"));
    }
    // Throws error if model is empty
    if (!product.model || product.model.trim() === "") {
      return Promise.reject(new Error("Model cannot be empty"));
    }
    // Throws error if type is empty
    if (!product.type || product.type.trim() === "") {
      return Promise.reject(new Error("Type cannot be empty"));
    }
    // Throws error if price is 0 or below
    if (product.price <= 0) {
      return Promise.reject(new Error("Price cannot be set as 0"));
    }
    // Throws error if description is empty
    if (!product.description || product.description.trim() === "") {
      return Promise.reject(new Error("Description cannot be empty"));
    }
    // Throws error if there are no images
    if (product.images.length === 0) {
      return Promise.reject(new Error("Products must have at least one image"));
    }
    // Throws error if product overview is empty (first index of specs)
    if (product.specs[0].text[0].trim() === "") {
      return Promise.reject(new Error("Product overview cannot be empty"));
    }
    // Loop to go over the rest of the specs (if exist)
    for (let i = 1; i < product.specs.length; i++) {
      const spec = product.specs[i];
      // Throw error if any spec name is empty
      if (spec.name.trim() === "") {
        return Promise.reject(new Error("Spec names cannot be empty"));
      }
      // Throw error if any spec detail is empty
      for (let detail of spec.text) {
        if (detail.trim() === "") {
          return Promise.reject(new Error("Spec details cannot be empty"));
        }
      }
    }

    // Add the new product to Firestore
    return addDoc(productsRef, product)
      .then((productRef) => {
        // Get the new product's document ID
        const productId = productRef.id;

        // Update allProducts list with the new product
        setAllProducts((prevProducts) => [
          ...prevProducts,
          { ...product, id: productId },
        ]);
      })
      .catch((error) => {
        console.log("Error adding new product: ", error);
        throw new Error("Failed to add the product. Please try again.");
      });
  };

  const updateProductProperties = (product) => {
    // Validations:
    // Throws error if brand is empty
    if (!product.brand || product.brand.trim() === "") {
      return Promise.reject(new Error("Brand cannot be empty"));
    }
    // Throws error if model is empty
    if (!product.model || product.model.trim() === "") {
      return Promise.reject(new Error("Model cannot be empty"));
    }
    // Throws error if type is empty
    if (!product.type || product.type.trim() === "") {
      return Promise.reject(new Error("Type cannot be empty"));
    }
    // Throws error if price is 0 or below
    if (product.price <= 0) {
      return Promise.reject(new Error("Price cannot be set as 0"));
    }
    // Throws error if description is empty
    if (!product.description || product.description.trim() === "") {
      return Promise.reject(new Error("Description cannot be empty"));
    }
    // Throws error if there are no images
    if (product.images.length === 0) {
      return Promise.reject(new Error("Products must have at least one image"));
    }
    // Throws error if product overview is empty (first index of specs)
    if (product.specs[0].text[0].trim() === "") {
      return Promise.reject(new Error("Product overview cannot be empty"));
    }
    // Loop to go over the rest of the specs (if exist)
    for (let i = 1; i < product.specs.length; i++) {
      const spec = product.specs[i];
      // Throw error if any spec name is empty
      if (spec.name.trim() === "") {
        return Promise.reject(new Error("Spec names cannot be empty"));
      }
      // Throw error if any spec detail is empty
      for (let detail of spec.text) {
        if (detail.trim() === "") {
          return Promise.reject(new Error("Spec details cannot be empty"));
        }
      }
    }

    const productRef = getProductDocRef(product.id);
    return updateDoc(productRef, product)
      .then(() => {
        setAllProducts((prevProducts) =>
          prevProducts.map((currentProduct) =>
            currentProduct.id === product.id
              ? product
              : currentProduct
          )
        );
      })
      .catch((error) => {
        console.log("Error updating product: ", error);
        throw new Error(
          "Failed to update the product. Please try again or contact support."
        );
      });
  };

  const globalVal = {
    productsLoading,
    allProducts,
    getProduct,
    getProductDocRef,
    addReview,
    removeReview,
    getRelatedProducts,
    getFeaturedProducts,
    updateProductsStock,
    updateProductLikes,
    deleteProduct,
    addNewProduct,
    updateProductProperties,
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
