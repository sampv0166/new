import React from "react";

import Table from "../components/table/Table";

import customerList from "../assets/JsonData/customers-list.json";
import { useState } from "react";
import { useEffect } from "react";
import { getUsers } from "./api/users";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const customerTableHead = ["", "name", "email", "User", " ", " ", " "];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
  <tr key={index}>
    <td>{item.id}</td>
    <td>{item.name}</td>
    <td>{item.email}</td>
    <td>{item.typeofuser}</td>
    <td>
      <i className="bx bx-lock"></i>
    </td>
  </tr>
);

const Customers = () => {
  const [users, setUser] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const fetchUsers = async () => {
      const data = await getUsers(user.success.token);
      setUser(data.data);
      console.log(data.data);
    };

    fetchUsers();
  }, []);

  const deletePUserHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      //deleteProduct(id);
      console.log(id + " user deleted");
    }
  };

  return (
    <div>
      <h2 className="page-header">Users</h2>
      <Link to="/addnewuser">
        <Button className="my-2">Add New User</Button>
      </Link>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        {customerTableHead.map((item, index) => (
                          <th key={index}>{item}</th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.typeofuser}</td>
                          <td>
                            <Link to={`/permissions/${item.id}`}>
                              <i className="bx bx-lock bx-color-fill"></i>
                            </Link>
                          </td>

                          <td>
                            <button
                              style={{ cursor: "pointer" }}
                              className="rounded"
                              onClick={() => deletePUserHandler(item.id)}
                            ></button>
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

export default Customers;
