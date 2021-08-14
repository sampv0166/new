import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { deleteCategory, getCategory } from "./api/category";
import { Link } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { getShops } from "./api/shop";
import { deleteSubCategory, getSubCategory } from "./api/subcategory";

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

const SubCategoryScreen = ({ history }) => {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    const fetchSubCategory = async () => {
      const { data } = await getSubCategory(user.success.token);
      setCategory(data);
      console.log(category);
      // console.log(users);
    };

    fetchSubCategory();
    console.log(category);
  }, []);

  
  const deleteCaetgoryHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      deleteSubCategory(id);

      const user = JSON.parse(localStorage.getItem("userInfo"));

      const fetchCategory = async () => {
        const { data } = await getCategory(user.success.token);
        setCategory(data);
        console.log(category);
        // console.log(users);
      };

      fetchCategory();

      console.log(id + " category deleted");
    }
  };

  return (
    <div>
      <h2 className="page-header">Users</h2>
      <Link to="/addnewsubcategory">
        <Button className="my-2">Add New Sub Category</Button>
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
                            <Link to={`/editsubcategory/${item.id}`}>
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

export default SubCategoryScreen;
