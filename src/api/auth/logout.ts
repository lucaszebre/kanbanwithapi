import Cookies from "js-cookie"; // Assuming you use js-cookie

export const logout = async () => {
  try {
    Cookies.remove("key");
  } catch (error) {
    console.error(error);
  }
};
