import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import { ShopContext } from "../context/shopContext.jsx";
const Login = () => {
  const { backendUrl, setToken, token, navigate } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          toast.success(data.message);
          setToken(data.token);
          localStorage.setItem("token", data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        {
          const { data } = await axios.post(backendUrl + "/api/user/register", {
            name,
            email,
            password,
          });
          if (data.success) {
            toast.success(data.message);
            setToken(data.token);
            localStorage.setItem("token", data.token);
          } else {
            toast.error(data.message);
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="m-auto mt-14 flex w-[90%] flex-col items-center gap-4 text-gray-800 sm:max-w-96"
    >
      <div className="mt-10 mb-2 inline-flex items-center gap-2">
        <hr className="h-[1.5px] w-8 border-none bg-gray-800" />
        <p className="prata-regular text-3xl"> {currentState} </p>
        <hr className="h-[1.5px] w-8 border-none bg-gray-800" />
      </div>
      {currentState === "Sign Up" ? (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full rounded border border-gray-800 px-3 py-2"
          placeholder="Name"
          required
        />
      ) : (
        <></>
      )}

      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="w-full rounded border border-gray-800 px-3 py-2"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full rounded border border-gray-800 px-3 py-2"
        placeholder="Password"
        required
      />
      {currentState === "Login" ? (
        <div className="mt-[-8px] flex w-full justify-between text-sm">
          <p className="cursor-pointer">Forget your password ?</p>
        </div>
      ) : (
        <></>
      )}

      <button className="mt-2 w-full rounded bg-black px-8 py-2 font-light text-white">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
      <div className="text-sm">
        {currentState === "Login" ? (
          <p>
            Don't have an account?{" "}
            <a
              className="cursor-pointer text-blue-600 underline"
              onClick={() => setCurrentState("Sign Up")}
            >
              Create Here
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <a
              className="cursor-pointer text-blue-600 underline"
              onClick={() => setCurrentState("Login")}
            >
              Login Here
            </a>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
