import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const response = await axios.post("/api/auth/signin", formData);
      const data = await response.data;
      setLoading(false);
      // set error state to true if there is an error
      if (data.success == false) {
        setError(true);
        return;
      }
      navigate('/')
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 text-white p-3
         rounded-lg uppercase hover: opacity-95 disabled:opacity-75"
        >
          {loading ? "...loading" : "sign In"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-500 font-semibold">Sign Up</span>
        </Link>
      </div>
      <div className="text-red-500 font-semibold">{error && "something went wrong!"}</div>
    </div>
  );
}
