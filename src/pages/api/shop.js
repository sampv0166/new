// get categories
// api/v2/admin/getshop', (req, res) => {

import axios from "axios";

export const getShops = async (usertoken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${usertoken}`,
      },
    };

    const { data } = await axios.get(
      "https://khaymatapi.mvp-apps.ae/api/v2/public/shop",
      config
    );
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const addShop = async (formdata) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.success.token}`,
      },
    };
    const { data } = await axios.post(
      "https://www.khaymatapi.mvp-apps.ae/api/v2/admin/shop",
      formdata,
      config
    );
  } catch (e) {
    console.log(e);
  }
};

export const updateShop = async (formdata) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.success.token}`,
      },
    };
    const { data } = await axios.post(
      `https://www.khaymatapi.mvp-apps.ae/api/v2/admin/shop`,
      formdata,
      config
    );
    console.log(data);
  } catch (e) {
    console.log(e);
  }
};

export const deleteShop = (formdata) => {
  try {
    console.log(formdata)
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const config = {
      headers: {
        "Content-Type": "application/",
        Authorization: `Bearer ${userInfo.success.token}`,
      },
    };

    axios
      .post(
        'https://www.khaymatapi.mvp-apps.ae/api/v2/admin/deleteshop',
        formdata,
        config
      )
      .then((res) => {
        console.log("category deleted sucessfully");
      });
  } catch (e) {
    console.log(e);
  }
};
