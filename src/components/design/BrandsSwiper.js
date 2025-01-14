import React from "react";
import { useValidationContext } from "../../contexts/ValidationContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { Image } from "react-bootstrap";
import { logoMap } from "../../assets/LogoMap";
import noImage from "../../assets/no-image.png";

// Brands swiper/carousel component to show brands sold in the store
const BrandsSwiper = () => {
  const { smallSquareLogoStyle } = useValidationContext();

  return (
    <>
      <Swiper
        loop={true}
        freeMode={true}
        spaceBetween={15}
        slidesPerGroup={1}
        speed={3000}
        autoplay={{
          delay: 0, // Delay between slides in milliseconds
          disableOnInteraction: false, // Continue autoplay after user interaction
        }}
        modules={[FreeMode, Autoplay]}
        breakpoints={{
          // Define displayed slides for different screen sizes
          320: {
            slidesPerView: 4,
          },
          576: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 5,
          },
          972: {
            slidesPerView: 6,
          },
          1024: {
            slidesPerView: 7,
          },
          1440: {
            slidesPerView: 9,
          },
        }}
      >
        {Object.entries(logoMap).map(([brand, logo], index) => (
          <SwiperSlide key={index} className="swiper-slide">
            <Image
              variant="top"
              src={logo || noImage}
              alt={brand}
              className="small-product-brand-logo"
              style={smallSquareLogoStyle(brand)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default BrandsSwiper;
