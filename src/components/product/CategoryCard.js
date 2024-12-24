import React from "react";
import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import CamerasLogo from "../../assets/CamerasLogo.png";
import BagsLogo from "../../assets/BagsLogo.png";
import AccessoriesLogo from "../../assets/AccessoriesLogo.png";
import LensesLogo from "../../assets/LensesLogo.png";
import LightingLogo from "../../assets/LightingLogo.png";
import TripodsLogo from "../../assets/TripodsLogo.png";

const CategoryCard = ({ category, size }) => {
  const logo =
    category === "cameras"
      ? CamerasLogo
      : category === "bags"
      ? BagsLogo
      : category === "accessories"
      ? AccessoriesLogo
      : category === "lenses"
      ? LensesLogo
      : category === "lighting"
      ? LightingLogo
      : TripodsLogo;

  const categoryUpperCaseLetter =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  return (
    <Col md={size === "sm" ? 2 : 3} className={size === "sm" ? "mb-2" : "mb-4"}>
      <Card className={size === "sm" ? "small-category-card" : "category-card"}>
        <Link to={`/categories/${category}`} className="black-link-text">
          <Card.Img
            src={logo}
            alt={category}
            className={
              size === "sm" ? "small-category-card-img" : "category-card-img"
            }
          />
          <p className={size === "sm" ? "mt-2 h6 d-block" : "mt-2 h3 d-block"}>
            <b>{categoryUpperCaseLetter}</b>
          </p>
        </Link>
      </Card>
    </Col>
  );
};

export default CategoryCard;
