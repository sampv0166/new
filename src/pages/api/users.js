import axios from "axios";
// add product
// POST /api/v2/admin/product

export const addUser = (formdata) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.success.token}`,
      },
    };

    axios
      .post(
        "https://www.khaymatapi.mvp-apps.ae/api/v2/admin/createuser",
        formdata,
        config
      )
      .then((res) => {
        console.log(res);
      });
  } catch (e) {
    console.log(e);
  }
};

// update produuct
// POST /api/v2/admin/product

export const updateUser = (formdata) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.success.token}`,
      },
    };

    axios
      .post(
        "https://www.khaymatapi.mvp-apps.ae/api/v2/admin/createuser",
        formdata,
        config
      )
      .then((res) => {
        console.log(res);
      });
  } catch (e) {
    console.log(e);
  }
};

//delete product
// DELETE /api/v2/admin/product/{id}

export const deleteUser = (id) => {
  try {
    axios.delete(`api/v2/admin/product/${id}`).then((res) => {
      console.log("Product deleted sucessfully");
    });
  } catch (e) {
    console.log(e);
  }
};

// get products
// /api/v2/admin/getproducts
export const getUsers = async (usertoken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${usertoken}`,
      },
    };

    const { data } = await axios.get(
      "https://khaymatapi.mvp-apps.ae/api/v2/admin/users",
      config
    );
    return data;
  } catch (e) {
    console.log(e);
  }
};
