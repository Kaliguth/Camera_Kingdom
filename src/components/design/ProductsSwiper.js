import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import SmallProductCard from "../product/SmallProductCard";

const ProductsSwiper = ({ products }) => {
  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "black",
          "--swiper-pagination-color": "black",
        }}
        loop={false}
        spaceBetween={15}
        slidesPerView={7}
        slidesPerGroup={3}
        navigation={true}
        modules={[FreeMode, Navigation]}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="swiper-slide">
            <SmallProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ProductsSwiper;
