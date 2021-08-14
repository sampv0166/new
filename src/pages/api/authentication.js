import axios from "axios";

//#Registration
//POST /api/v2/public/register
export const userRegister = ({ name, email, password, photo }) => {
  try {
    axios
      .post("https://www.khaymatapi.mvp-apps.ae/api/v2/public/register", {
        name,
        email,
        password,
        photo,
      })
      .then((res) => {
        console.log(res);
      });
  } catch (e) {
    console.log(e);
  }
};

//#Login
//POST /api/v2/public/login
export const userLogin = async (email, password) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "https://khaymatapi.mvp-apps.ae/api/v2/public/login",
      { email, password },
      config
    );
    return data;
  } catch (e) {
    return e;
  }
};

//#Current USER info
//GET /api/v2/public/myprofile

export const getCurrentUserInfo = async () => {
  try {
    const data = await axios.get("/api/v2/public/myprofile");
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};
