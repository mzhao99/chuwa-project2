import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth/authThunk";
import FilledBtn from "../../components/FilledBtn";
import InputField from "../../components/InputField";
import { CircularProgress } from "@mui/material";
import "../../styles/AuthForm.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { loading } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data)).unwrap();
      setIsSuccess(true); 
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      console.log(error)
      if (error === "Invalid Credentials") {
        setError("Invalid username or password");
      } else {
        navigate("/error");
      }
    }
  };

  if (isSuccess) {
    return <h3>Account logged in successfully! Redirecting...</h3>;
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <h1>Sign in to your account</h1>
      <div className="input-field">
        <label>Username</label>
        <InputField
          name="username"
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && (
          <p className="auth-error-message">{errors.username.message}</p>
        )}
      </div>
      <div className="input-field">
        <label>Password</label>
        <InputField
          name="password"
          isPassword
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="auth-error-message">{errors.password.message}</p>
        )}
      </div>
      {error && <p className="auth-error-message">{error}</p>}
      <div className="submit-btn">
        <FilledBtn
          text={loading ? <CircularProgress size={20} /> : "Sign In"}
          width="100%"
          type="submit"
          disabled={loading}
        />
      </div>
    </form>
  );
}
