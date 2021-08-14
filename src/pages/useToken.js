import { useState } from 'react';

export default function useUserInfo() {
  const getUser = () => {
    const userInfoFromStorage = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    return userInfoFromStorage;
  };

  const [user, setUser] = useState(getUser());

  const saveUser = (userInfo) => {
    console.log(userInfo);
    if (userInfo.success) {
      console.log(userInfo + 'ok');
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
    setUser(userInfo);
  };

  return {
    setUser: saveUser,
    user,
  };
}
