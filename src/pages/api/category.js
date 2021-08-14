import axios from "axios";

// add category
// POST /api/v2/admin/category

export const addCategory = async (formdata) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.success.token}`,
      },
    };

    const { data } = await axios.post(
      "https://www.khaymatapi.mvp-apps.ae/api/v2/admin/category",
      formdata,
      config
    );
  } catch (e) {
    console.log(e);
  }
};

// get categories 
// api/v2/admin/getcategory', (req, res) => {

export const getCategory = async () => {
  try {
    const {data} = await axios.get(
      "https://www.khaymatapi.mvp-apps.ae/api/v2/public/category"
    );
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const updateCategory = async (formdata) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.success.token}`,
      },
    };
    const { data } = await axios.post(
      
      `https://www.khaymatapi.mvp-apps.ae/api/v2/admin/category`,
      formdata,
      config
    );
    console.log(data);
  } catch (e) {
    console.log(e);
  }
};


export const deleteCategory = (id) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.success.token}`,
      },
    };

    axios
      .delete(
        `https://www.khaymatapi.mvp-apps.ae/api/v2/admin/category/${id}`,
        config
      )
      .then((res) => {
        console.log("category deleted sucessfully");
      });
  } catch (e) {
    console.log(e);
  }
};
