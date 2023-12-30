import Cookies from "js-cookie";

const getToken = () => {
  return Cookies.get("intopros_admin_token");
};

const setToken = (token: string) => {
  return Cookies.set("intopros_admin_token", token);
};

const deleteToken = () => {
  return Cookies.remove("intopros_admin_token");
};

export { getToken, setToken, deleteToken };
