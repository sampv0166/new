import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

const Product = ({ product, productId }) => {
  return (
    <Link to={`/product/${product.id}`}>
      <Card
        className=""
        style={{ height: "300px", objectFit: "contain" ,overflow :'hidden'}}
      >
        <Card.Img
          style={{ height: "170px", objectFit: "contain" }}
          src={product.variations[0].images[0]}
          variant="top"
          className="img-top img-fluid"
        />

        <div className="card-body ">
          <p className="card-text bold"style={{wordWrap: 'break-word',fontSize:'.8rem'}} >{product.name}</p>
        </div>
      </Card>

      
    </Link>
  );
};

export default Product;
