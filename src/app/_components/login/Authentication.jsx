"use client";
import UseAuthContext from "@/Hooks/UseAuthContext";
import React, { useState } from "react";
import Spinner from "../spiners/Spinner";
import { Container } from "react-bootstrap";

export default function Authentication() {
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    password: "",
    email: "",
  });
  const {
    setLoading,
    handleAuth,
    hundleGetAllUsers,
    loading,
    setMessage,
    message,
    hundleUpdateProfile,
  } = UseAuthContext();
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [isCreateRoomVisible, setIsCreateRoomVisible] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleLoginClick = () => {
    setIsLoginVisible(true);
    setIsCreateRoomVisible(false);
  };

  const handleCreateRoomClick = () => {
    setIsCreateRoomVisible(true);
    setIsLoginVisible(false);
  };

  const handleCloseClick = () => {
    setIsLoginVisible(false);
    setIsCreateRoomVisible(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    handleAuth(userInfo, "login");
    setUserInfo({ fullname: "", password: "", email: "" });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    handleAuth(userInfo, "createroom");
    setUserInfo({ fullname: "", password: "", email: "" });
  };

  return (
    <>
      <Container className="w-full overflow-hidden">
        {loading && <Spinner />}
        <div className="p-4 text-white bg-gray-900 min-h-screen">
          <div>
            <h1 className="text-3xl font-bold text-center mb-8">
              Welcome to HelloTheatre
            </h1>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleLoginClick}
              className="px-4 py-2 lg:text-[15px] text-[10px] bg-blue-600 rounded hover:bg-blue-700"
            >
              Login to Theatre
            </button>
            <button
              onClick={handleCreateRoomClick}
              className="px-4 py-2 lg:text-[15px] text-[10px] bg-green-600 rounded hover:bg-green-700"
            >
              Create New Theatre
            </button>
          </div>

          {/*  for Login */}
          {isLoginVisible && (
            <div className=" py-5 ">
              <div className="lg:w-5/12 m-auto w-12/12 bg-gray-800 lg:p-5 p-4 rounded-xl shadow-xl">
                <h1 className="text-xl text-slate-400 font-bold py-2 lg:text-3xl">
                  Login
                </h1>
                {message && (
                  <p className="text-sm text-white p-2 text-center">
                    {message}
                  </p>
                )}
                <form onSubmit={handleLogin}>
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    className="w-full my-2 focus:outline-none p-2 bg-gray-700 text-white rounded"
                    placeholder="Enter your email"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    value={userInfo.password}
                    onChange={handleInputChange}
                    className="w-full my-2 focus:outline-none p-2 bg-gray-700 text-white rounded"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full p-2 mt-4 bg-blue-900 text-white rounded"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          )}

          {/*  for Create Theatre */}
          {isCreateRoomVisible && (
            <div className="py-5">
              <div className="lg:w-5/12 m-auto w-12/12 bg-gray-800 lg:p-5 p-4 rounded-xl shadow-xl">
                <h1 className="text-xl text-slate-400 font-bold py-2 lg:text-3xl">
                  Create New Theatre
                </h1>
                {message && (
                  <p className="text-sm text-white p-2 text-center">
                    {message}
                  </p>
                )}
                <form onSubmit={handleFormSubmit}>
                  <input
                    type="text"
                    name="fullname"
                    value={userInfo.fullname}
                    onChange={handleInputChange}
                    className="w-full my-2 focus:outline-none p-2 bg-gray-700 text-white rounded"
                    placeholder="Enter Theatre name"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    className="w-full my-2 focus:outline-none p-2 bg-gray-700 text-white rounded"
                    placeholder="Enter your email"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    value={userInfo.password}
                    onChange={handleInputChange}
                    className="w-full my-2 focus:outline-none p-2 bg-gray-700 text-white rounded"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full p-2 mt-4 bg-green-900 text-white rounded"
                  >
                    Create Theatre
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
