import UseAuthContext from "@/Hooks/UseAuthContext";
import React, { useState } from "react";

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
    <div className="p-4 text-white bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-center mb-8">
          Welcome to HelloTheatre
        </h1>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleLoginClick}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Login to Room
        </button>
        <button
          onClick={handleCreateRoomClick}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          Create New Room
        </button>
      </div>

      {/* Modal for Login */}
      {isLoginVisible && (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black/50 flex items-center justify-center">
          <div className="lg:w-5/12 w-11/12 bg-gray-800 p-5 rounded-xl shadow-xl">
            <h1 className="text-xl text-slate-400 font-bold py-2 lg:text-3xl">
              Login
            </h1>
            {message && (
              <p className="text-sm text-white p-2 text-center">message{}</p>
            )}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                className="w-full my-4 p-2 mb-4 bg-gray-700 text-white rounded"
                placeholder="Enter your email"
                required
              />
              <input
                type="password"
                name="password"
                value={userInfo.password}
                onChange={handleInputChange}
                className="w-full my-4 p-2 mb-4 bg-gray-700 text-white rounded"
                placeholder="Enter your password"
                required
              />
              <button
                type="submit"
                className="w-full p-2 mt-4 bg-blue-900 text-white rounded"
              >
                Login
              </button>
              <button
                onClick={handleCloseClick}
                className="w-full p-2 mt-4 bg-red-600 text-white rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Create Room */}
      {isCreateRoomVisible && (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black/50 flex items-center justify-center">
          <div className="lg:w-5/12 w-11/12 bg-gray-800 p-5 rounded-xl shadow-xl">
            <h1 className="text-xl text-slate-400 font-bold py-2 lg:text-3xl">
              Create New Room
            </h1>
            {message && (
              <p className="text-sm text-white p-2 text-center">message{}</p>
            )}
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="fullname"
                value={userInfo.fullname}
                onChange={handleInputChange}
                className="w-full my-4 p-2 mb-4 bg-gray-700 text-white rounded"
                placeholder="Enter room name"
                required
              />
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                className="w-full my-4 p-2 mb-4 bg-gray-700 text-white rounded"
                placeholder="Enter your email"
                required
              />
              <input
                type="password"
                name="password"
                value={userInfo.password}
                onChange={handleInputChange}
                className="w-full my-4 p-2 mb-4 bg-gray-700 text-white rounded"
                placeholder="Enter your password"
                required
              />
              <button
                type="submit"
                className="w-full p-2 mt-4 bg-green-900 text-white rounded"
              >
                Create Room
              </button>
              <button
                onClick={handleCloseClick}
                className="w-full p-2 mt-4 bg-red-600 text-white rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
