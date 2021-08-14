import React, { useEffect } from 'react';

import { Link } from 'react-router-dom';

import Chart from 'react-apexcharts';

import { useSelector } from 'react-redux';

import StatusCard from '../components/status-card/StatusCard';

import Table from '../components/table/Table';

import Badge from '../components/badge/Badge';

import statusCards from '../assets/JsonData/status-card-data.json';
import { getOrders } from './api/Orders';
import { useState } from 'react';

const orderStatus = {
  shipping: 'primary',
  pending: 'warning',
  paid: 'success',
  refund: 'danger',
};

let arr;
const Orders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const fetchOrders = async () => {
      const data = await getOrders(user.success.token);
      setOrders(data.data);
      arr = data.data;
      console.log(orders);
    };

    fetchOrders();
  }, []);

  const themeReducer = useSelector((state) => state.ThemeReducer.mode);
  return (
    <div>
      <h2 className="page-header">Orders</h2>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <div>
                <div className="table-wrapper">
                  <table className>
                    {console.log(orders)}
                    <thead>
                      <th> Order Id</th>
                      <th> User</th>
                      <th> Total Price</th>
                      <th> Date</th>
                      <th> Status</th>;
                    </thead>

                    <tbody>
                      {orders.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{item.user.name}</td>
                          <td>{item.total_amount}</td>
                          <td>{item.created_at}</td>
                          <td>
                            {item.payment_status === 0 ? (
                              <Badge type={'warning'} content={'pending'} />
                            ) : (
                              ''
                            )}

                            {item.payment_status === 1 ? (
                              <Badge type={'success'} content={'confirmed'} />
                            ) : (
                              ''
                            )}

                            {item.payment_status === 2 ? (
                              <Badge type={'primary'} content={'shipping'} />
                            ) : (
                              ''
                            )}

                            {item.payment_status === 3 ? (
                              <Badge type={'danger'} content={'rejected'} />
                            ) : (
                              ''
                            )}

                            {item.payment_status === 4 ? (
                              <Badge type={'primary'} content={'delivered'} />
                            ) : (
                              ''
                            )}

                            {item.payment_status === 5 ? (
                              <Badge type={'danger'} content={'cancelled'} />
                            ) : (
                              ''
                            )}
                          </td>

                          <td>
                            <Link to={`/orderdetails/${item.id}`}>
                              <button
                                style={{
                                  cursor: 'pointer',
                                  backgroundColor: 'transparent',
                                }}
                                className="rounded"
                              >
                                {' '}
                                <i className="bx bx-detail">View Details</i>
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
