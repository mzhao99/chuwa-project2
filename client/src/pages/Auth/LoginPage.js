import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {Link, useNavigate} from 'react-router-dom';
import FilledBtn from "../../components/FilledBtn";
import InputField from "../../components/InputField";
import { CircularProgress } from "@mui/material";
import "../../styles/AuthForm.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const {register, handleSubmit, formState: { errors }} = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // add log in feature here
      console.log("Log in success: ", data);
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => navigate('/'), 1500);
      }, 1500);
    } catch (e) {
      setError("Invalid username or password");
      setLoading(false);
    } 
  };

  return success ? (
    <h3>Logged in successfully! Redirecting...</h3>
  ) : (
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
          type="password"
          {...register("password", {required: "Password is required"},)}
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
