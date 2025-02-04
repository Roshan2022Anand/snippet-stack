import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { hapiApi } from "../../utils/utility";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  
  const [isLoading, setisLoading] = useState<boolean>(false);

  //function to handle the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setisLoading(true)
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const res = await hapiApi.get(`/api/login`, {
        params: {
          email,
          password,
        },
      });
      toast.success(res.data.message);
      navigate("/");
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) toast.error(err.response?.data.error);
    }
    setisLoading(false);
  };

  return (
    <main className=" w-full h-screen flex items-center bg-bgPrimary justify-between">
      <Link to="/" className="btn-accent-one absolute top-2 left-2">
        <FaArrowLeft />
      </Link>
      <form
        onSubmit={handleSubmit}
        className="w-[40%] max-w-[400px] flex flex-col py-1 rounded-lg px-3 mx-auto sm:ml-auto"
      >
        <h2 className="font-bold border-b-2 border-textPrimary">Login</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          className="input-field"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="input-field"
          required
        />
        <button
          type="submit"
          className="btn-accent-one mt-2 border-2 border-textPrimary"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
        <p>
          New to snippet stack ?
          <Link
            to="/signup"
            className="text-blue-600 decoration-blue-600 underline"
          >
            Sign up
          </Link>
        </p>
      </form>
      <div className="h-full w-1/2 side-wall hidden sm:block"></div>
    </main>
  );
};

export default Login;
