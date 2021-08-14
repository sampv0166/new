import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Badge from '../components/badge/Badge';
import { getOrders } from './api/Orders';

const OrderDetailsScreen = ({ history, match }) => {
  const [order, setOrders] = useState(null);

  const orderid = match.params.id;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const fetchOrders = async () => {
      const data = await getOrders(user.success.token);
      data.data.map((order) => {
        if (order.id == orderid) {
          setOrders(order);
        }
      });
    };

    fetchOrders();
  }, []);

  return (
    <div>
      {order && (
        <Row>
          <Col md={8}>
            <Card border="light" className="bg-white shadow-sm">
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>
                      {' '}
                      {order.payment_status === 0 ? (
                        <Badge type={'warning'} content={'Pending'} />
                      ) : (
                        ''
                      )}
                      {order.payment_status === 1 ? (
                        <Badge type={'success'} content={'Confirmed'} />
                      ) : (
                        ''
                      )}
                      {order.payment_status === 2 ? (
                        <Badge type={'primary'} content={'Shipping'} />
                      ) : (
                        ''
                      )}
                      {order.payment_status === 3 ? (
                        <Badge type={'danger'} content={'Rejected'} />
                      ) : (
                        ''
                      )}
                      {order.payment_status === 4 ? (
                        <Badge type={'primary'} content={'Delivered'} />
                      ) : (
                        ''
                      )}
                      {order.payment_status === 5 ? (
                        <Badge type={'danger'} content={'Cancelled'} />
                      ) : (
                        ''
                      )}
                    </h2>
                    <p>
                      <strong>Name: </strong> {order.user.name}
                    </p>
                    <p>
                      <strong>Email: </strong>
                      {order.user.email}
                    </p>
                    <p>
                      <strong>Address: </strong>
                      {order.address}
                    </p>
                    <p>
                      <strong>Phone: </strong>
                      {order.phone}
                    </p>
                    <p>
                      <strong>Whatsapp: </strong>
                      {order.haswhatsapp === true ? 'Yes' : 'No'}
                    </p>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <h2>Order Items</h2>

                    <ListGroup variant="flush">
                      {order.products.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={1}>
                              <Image
                                src={item.image}
                                alt={item.name_en}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product_id}`}>
                                {item.name_en}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.quantity} x ${item.mrp_price} = $
                              {item.quantity * item.mrp_price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>{order.products.length}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.delivery_charge}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.tax}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.total_amount}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <input type="select" />
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default OrderDetailsScreen;
