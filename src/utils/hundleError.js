import { toast } from "react-toastify";
import { deleteCookie } from "cookies-next";

export const handleError = (error) => {
  if (error.response) {
    if (error?.response?.status === 401) {
      // deleteCookie("accesstoken");
    }
    toast.error(
      `Server Error: ${error.response.data.message || "An error occurred"}`
    );
  } else if (error.request) {
    toast.error("Error: No response received from the server");
  } else if (error.message === "Network Error") {
    toast.error("Network Error: Please check your internet connection.");
  } else {
    toast.error(`Error: ${error.message}`);
  }
};
