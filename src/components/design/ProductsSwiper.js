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
        // slidesPerView={7}
        slidesPerGroup={3}
        navigation={true}
        modules={[FreeMode, Navigation]}
        breakpoints={{
          // Define displayed slides for different screen sizes
          320: {
            slidesPerView: 3,
          },
          576: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 3,
          },
          972: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
          1440: {
            slidesPerView: 7,
          },
        }}
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
