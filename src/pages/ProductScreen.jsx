import React, { useEffect, useState } from "react";
import { Button, Col, Image, Pagination, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import Product from "../components/Product";
import { deleteProduct, getProduct } from "./api/products";
import Paginate from "../components/Paginate";
import { LinkContainer } from "react-router-bootstrap";

const ProductScreen = ({ match, history, location, setRefresh, refresh,products,setProduct }) => {

  const [pages, setPages] = useState([]);

  const deleteProductHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      deleteProduct(id);
      console.log(id + " product deleted");
    }
  };

  const paginationClicked = async (number) => {
    console.log(number);
    const { data } = await getProduct(number);
    setProduct(data.data);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await getProduct(1);
      setPages(data);
      setProduct(data.data);

      let currentToCompare = data.data;
      setProduct(currentToCompare);

      console.log(pages);

      console.log(data);
    };
    fetchProducts();
  }, [refresh]);

  let items = [];
  for (let number = 1; number <= pages.last_page; number++) {
    items.push(
      <Pagination.Item
        key={number}
        onClick={(event) => paginationClicked(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div>
      <div>
        {products ? (
          <div>
            <div className="d-flex justify-content-between">
              <Pagination>{items}</Pagination>
              <Link to="/addproduct">
                <div>
                  <button className="btn btn-outline-success px-3 py-3 my-2">
                    Add New Product
                  </button>
                </div>
              </Link>
            </div>
            <Row>
              {products.map((product) => (
                <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} productId={product.id} />
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <div>
            <div class="spinner-grow text-success" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-danger" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-warning" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductScreen;
