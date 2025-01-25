import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";
import { hapiApi } from "../../utils/utility";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [err, seterr] = useState<{ isErr: boolean; msg: string }>({
    isErr: false,
    msg: "",
  });
  const [isLoading, setisLoading] = useState<boolean>(false);

  //function to handle the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setisLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      seterr({ isErr: true, msg: "Passwords do not match" });
      return;
    }

    try {
      const res = await hapiApi.post(`/api/signup`, {
        email,
        password,
        name,
      });
      toast.success(res.data.message);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data.error);
    }
    setisLoading(false);
  };

  return (
    <main className="h-screen flex items-center">
      <Link to="/" className="btn-accent-one absolute top-2 right-2">
        <FaArrowRight />
      </Link>
      <div className="h-full w-1/2 side-wall hidden sm:block"></div>
      <form
        onSubmit={handleSubmit}
        className="w-[40%] max-w-[400px] flex flex-col py-1 rounded-lg px-3 mx-auto sm:ml-auto"
      >
        <h2 className="font-bold border-b-2 border-textPrimary">Sign up</h2>

        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          className="input-field"
          required
        />

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
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          className="input-field"
          required
        />

        {err.isErr && <p className="text-red-500">{err.msg}</p>}

        <button
          type="submit"
          className="btn-accent-one mt-2 border-2 border-textPrimary"
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
        <p>
          Already have an account ?
          <Link
            to="/login"
            className="text-blue-600 decoration-blue-600 underline"
          >
            Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Signup;
