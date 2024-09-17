"use client";
import { useContext, useState } from "react";
import { getApiCall, patchApiCall, postApiCall } from "@/api/fatchData";
import { setCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AuthContex } from "@/Contexts/AuthContex";

export default function UseAuthContext() {
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContex);
  const { state, dispatch } = useContext(AuthContex);
  const { user } = state;
  const [message, setMessage] = useState(false);
  const router = useRouter();

  if (!authContext) {
    throw new Error("Application Error");
  }

  // for loging
  const handleAuth = async (data, action) => {
    setLoading(true);
    try {
      const response = await postApiCall(`auth/${action}`, data);
      if (response?.statusCode === 200) {
        setCookie("accesstoken", response?.token);
        dispatch({ type: "ADD_AUTH_DATA", payload: response?.data || null });
        toast.success(
          `${action.charAt(0).toUpperCase() + action.slice(1)} successful!`
        );
        router.push("/", { scroll: true });
        window.location.reload();
        setMessage(response?.message);
      }
      setMessage(response?.message);
    } catch (error) {
      setMessage(error?.message);
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // for updating profile
  const hundleUpdateProfile = async (data) => {
    setLoading(true);
    try {
      const response = await patchApiCall(`auth/update`, data);
      if (response?.statusCode === 200) {
        dispatch({
          type: "ADD_AUTHDATA",
          payload: response?.data || null,
        });
        toast.success(response.message);
        setMessage(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Update profile failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // for get all user
  const hundleGetAllUsers = async () => {
    setLoading(true);
    try {
      const response = await getApiCall(`user`, data);
      if (
        response?.statusCode === 200 &&
        user?.length !== response?.data?.length
      ) {
        dispatch({ type: "ADD_AUTHDATA", payload: response?.data || null });
        toast.success(response.message);
      }
    } catch (error) {
      // toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    setLoading,
    handleAuth,
    hundleGetAllUsers,
    loading,
    setMessage,
    message,
    hundleUpdateProfile,
  };
}
