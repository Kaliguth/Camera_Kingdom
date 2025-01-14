import React from "react";
import { Carousel } from "react-bootstrap";
import BlackFriday from "../../assets/BlackFriday.png";
import NikonZ6 from "../../assets/Nikon-Z6.png";
import NikonZ8 from "../../assets/Nikon-Z8.png";
import LeicaQ3 from "../../assets/Leica-Q3.png";

// Carousel component to show ads - used in home page
const ads = [BlackFriday, NikonZ6, NikonZ8, LeicaQ3];

const AdCarousel = () => {
  return (
    <Carousel interval={4000} pause="hover" indicators={true}>
      {ads.map((ad, index) => (
        <Carousel.Item key={index} className="ad-carousel-item">
          <img src={ad} alt={`${ad}`} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default AdCarousel;
