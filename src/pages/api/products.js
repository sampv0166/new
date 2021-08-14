import axios from "axios";

// add product
// POST /api/v2/admin/product

export const addProduct = async (formdata, ProductVariationList) => {
  console.log(ProductVariationList);
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.success.token}`,
      },
    };

    const { data } = await axios.post(
      "https://www.khaymatapi.mvp-apps.ae/api/v2/admin/product",
      formdata,
      config
    );
    console.log(data);

    ProductVariationList.map((variations, index) => {
      console.log(variations.images);
      const arr = variations.images.map((file) => file);
      console.log(arr);

      let variationformdata = new FormData();
      let images;
    
      variationformdata.set("product_id", data.id);
      variationformdata.set("price", variations.price);
      variationformdata.set("variation_name_ar", variations.variation_name_ar);
      variationformdata.set("variation_name_en", variations.variation_name_en);
      variationformdata.set("offerprice", variations.offerprice);
      variationformdata.set("stocks", variations.stocks);
      variationformdata.set("sku", variations.sku);
      variationformdata.set("color_name", variations.color_name);
      variationformdata.set("color_value", variations.color_value);
      variationformdata.set("hasoffer", variations.hasoffer);
      variationformdata.set("size_value", variations.size_value);    
      //variationformdata.append("images", [arr]);

      for (var i = 0; i < arr.length; i++) {

        variationformdata.append(`images[${i}]`, arr[i]);
        
      }
      // variationformdata.append('images', JSON.stringify(arr));

      // arr.forEach(item => {
      //variationformdata.append(`images[]`, JSON.stringify(item));
      ///});
      //variationformdata.append("images", arr);

      for (var value of variationformdata.values()) {
        console.log(value);
      }

      const { vardata } = axios.post(
        "https://www.khaymatapi.mvp-apps.ae/api/v2/admin/variation",
        variationformdata,
        config
      );
      console.log(vardata);
    });
    ///history.push(`/product/${data.id}`)
  } catch (e) {
    console.log(e);
  }
};

// update produuct
// POST /api/v2/admin/product

export const updateProduct = async (formdata) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.success.token}`,
      },
    };

    const { data } = await axios.post( 
      `https://www.khaymatapi.mvp-apps.ae/api/v2/admin/product`,
      formdata,
      config
    );
    console.log(data);
  } catch (e) {
    console.log(e);
  }
};


//delete product
// DELETE /api/v2/admin/product/{id}

export const deleteProduct = (id) => {
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
        `https://www.khaymatapi.mvp-apps.ae/api/v2/admin/product/${id}`,
        config
      )
      .then((res) => {
        console.log("category deleted sucessfully");
      });
  } catch (e) {
    console.log(e);
  }
};

// get products
// /api/v2/admin/getproducts
export const getProduct = async (page) => {
  try {
    const data = await axios.get(
      `https://www.khaymatapi.mvp-apps.ae/api/v2/public/product?page=${page}`
    );
    return data;
  } catch (e) {
    console.log(e);
  }
};
