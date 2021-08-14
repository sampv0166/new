import axios from "axios";

export const getOrders = async () => {
  try {
    const { data } = await axios.get(
      "https://www.khaymatapi.mvp-apps.ae/api/v2/admin/orders"
    );
    return data;
  } catch (e) {
    console.log(e);
  }
};
