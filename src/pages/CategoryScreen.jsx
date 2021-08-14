import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { deleteCategory, getCategory } from "./api/category";
import { Link } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { getShops } from "./api/shop";

const customerTableHead = ["id", "Name", "Name Ar", "Image", "", ""];

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
    <td>
      <i className="bx bx-pencil"></i>
    </td>
    <td>
      <i className="bx bx-trash"></i>
    </td>
  </tr>
);

const CategoryScreen = ({ history }) => {
  const [category, setCategory] = useState([]);
  const [categoryrefresh, setcategoryrefresh] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    const fetchCategory = async () => {
      const data = await getCategory(user.success.token);
      setCategory(data);
      console.log(category);
    };
    
    fetchCategory();
    console.log(category);
  }, [categoryrefresh]);

  const deleteCaetgoryHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      await deleteCategory(id);

      const fetchCategory = async () => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        const data = await getCategory(user.success.token);
        setCategory(data);
      };
      setcategoryrefresh((oldKey) => oldKey + 1);

      fetchCategory();

      console.log(id + " category deleted");
    }
  };

  return (
    <div>
      <h2 className="page-header">Users</h2>
      <Link to="/addnewcategory">
        <Button className="my-2">Add New Category</Button>
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
                      {category.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{item.name_en}</td>
                          <td>{item.name_ar}</td>

                          <td>
                            <Card.Img
                              style={{
                                height: "150px",
                                width: "150px",
                                objectFit: "contain",
                              }}
                              src={item.fullimageurl}
                              variant="top"
                            />
                          </td>
                          <td>
                            <Link to={`/editcategory/${item.id}`}>
                              <i
                                className="bx bx-pencil"
                                style={{
                                  cursor: "pointer",
                                  fontSize: "1.5rem",
                                }}
                              ></i>
                            </Link>
                          </td>
                          <td>
                            <button
                              style={{ cursor: "pointer", fontSize: "1.5rem" }}
                              className="rounded"
                              onClick={() => deleteCaetgoryHandler(item.id)}
                            >
                              {" "}
                              <i className="bx bx-trash"></i>
                            </button>
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

export default CategoryScreen;
