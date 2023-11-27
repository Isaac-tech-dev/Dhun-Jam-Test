import React, { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenF, setModalIsOpenF] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };
  const openModalF = () => {
    setModalIsOpenF(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeModalF = () => {
    setModalIsOpenF(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://stg.dhunjam.in/account/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (response.ok) {
        // Successful login, handle accordingly (redirect, set authentication state, etc.)
        console.log("Login successful");
        openModal();
        // Redirect to another page
        navigate("/dashboard");
      } else {
        // Handle unsuccessful login
        console.error("Login failed");
        //alert("Login failed");
        openModalF();
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error during login:", error);
    } finally {
      openModalF();
      setLoading(false);
    }
  };

  const override = css`
    display: block;
    margin: 0 auto;
  `;

  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "500px",
      borderRadius: "10px",
      height: "auto",
    },
  };

  return (
    <div className="bg-[#030303] h-screen m-auto p-0 flex justify-center items-center">
      <div className="w-[80vh] flex flex-col justify-center items-center">
        <h1 className="text-white text-[32px] font-bold text-center mb-4">
          Venue Admin Login
        </h1>

        <form onSubmit={handleLogin} className="w-full">
          {/* Username */}
          <div className="px-2 py-4 w-full">
            <h2 className="text-white text-base">Username:</h2>
            <input
              placeholder="username"
              className="bg-transparent border-2 rounded-xl px-4 py-2 text-white w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {/* Password */}
          <div className="px-2 py-4 relative w-full">
            <h2 className="text-white text-base">Password:</h2>
            <div className="flex items-center">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                placeholder="password"
                className="bg-transparent border-2 rounded-xl px-4 py-2 text-white w-full"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute right-4 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <EyeOff size={20} color="#fff" />
                ) : (
                  <Eye size={20} color="#fff" />
                )}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="px-2 py-4 w-full items-center justify-center flex">
            <button
              type="submit"
              className="bg-[#6741D9] hover:bg-[#F0C3F1] text-white font-bold py-2 px-4 rounded w-3/5"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader css={override} size={15} color={"#fff"} />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Modal for Success */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Login Successful"
          style={modalStyles}
        >
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-center text-[32px]">Login Successful</h2>
            <button
              onClick={closeModal}
              className="bg-[#6741D9] text-white px-4 py-2 rounded-xl"
            >
              Okay
            </button>
          </div>
        </Modal>

        {/* Modal for Failed */}
        <Modal
          isOpen={modalIsOpenF}
          onRequestClose={closeModalF}
          contentLabel="Login Successful"
          style={modalStyles}
        >
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-center text-[24px]">
              Login Failed. Check Credentials
            </h2>
            <button
              onClick={closeModalF}
              className="bg-[#6741D9] text-white px-4 py-2 rounded-xl"
            >
              Okay
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Login;
