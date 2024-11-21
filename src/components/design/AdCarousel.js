import React from "react";
import { Carousel } from "react-bootstrap";
import BlackFriday from "../../assets/BlackFriday.png";
import NikonZ6 from "../../assets/Nikon-Z6.png";
import NikonZ8 from "../../assets/Nikon-Z8.png";
import LeicaQ3 from "../../assets/Leica-Q3.png";

const ads = [BlackFriday, NikonZ6, NikonZ8, LeicaQ3];

const AdCarousel = () => {
  return (
    <Carousel interval={4000} pause="hover" indicators={true}>
      {ads.map((ad, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={ad}
            alt={`${ad}`}
            style={{ height: "390px", objectFit: "cover" }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default AdCarousel;
