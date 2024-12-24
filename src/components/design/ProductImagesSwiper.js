import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import noImage from "../../assets/no-image.png";

const ProductImagesSwiper = ({ product, size }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "black",
          "--swiper-pagination-color": "black",
        }}
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        className={
          size === "large" ? "image-swiper-large" : "image-swiper-small"
        }
      >
        {product.images.map((image, index) => (
          <SwiperSlide key={index} className="swiper-slide">
            <img
              src={image}
              alt={`Slide ${index}`}
              onError={(e) => {
                e.target.src = noImage;
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {size === "large" && (
        <Swiper
          onSwiper={setThumbsSwiper}
          // loop={true}
          spaceBetween={0}
          slidesPerView={5}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="image-thumbnails-swiper"
        >
          {product.images.map((image, index) => (
            <SwiperSlide key={index} className="swiper-slide">
              <img
                src={image}
                alt={`Slide ${index}`}
                onError={(e) => {
                  e.target.src = noImage;
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default ProductImagesSwiper;
