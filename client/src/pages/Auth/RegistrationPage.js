import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FilledBtn from "../../components/FilledBtn";
import InputField from "../../components/InputField";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/AuthForm.css";
import { useDispatch } from "react-redux";
import { signupUser } from "../../features/user/userSlice";
import { CircularProgress } from '@mui/material';

export default function RegistrationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [existingUserErr, setExistingUserErr] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const emailValidation = (email) => {
    if (!email){
      return "Email is required";
    } 
    const atSymbol = email.indexOf("@");
    const dotSymbol = email.lastIndexOf(".");
    const isValid =
      atSymbol > 0 && dotSymbol > atSymbol + 1 && dotSymbol < email.length - 1;
    return isValid ? true : "Please enter a valid email address";
  };

  const passwordValidation = (password) => {
    if (!password){
      return "Password is required";
    } 
    if (password.length < 8){
      return "Password must be at least 8 characters";
    } 
    if (!/[A-Z]/.test(password)){
      return "Password must contain at least one uppercase letter";
    } 
    if (!/[0-9]/.test(password)){
      return "Password must contain at least one digit";
    } 
    return true;
  };

  const usernameValidation = (username) => {
    if (!username){
      return "Username is required";
    } 
    return true;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: Call the signup function (example: dispatch signup)
      // await dispatch(signupUser(data));
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1000);
      }, 1000);
    } catch (error) {
      setLoading(false);
      // TODO: check error handling
      if (error?.response?.status === 400 && error?.response?.data?.message === 'Username already exists') {
        setExistingUserErr("Username already exists");
      } else if (error?.response?.status === 400 && error?.response?.data?.message === 'Email already exists') {
        setExistingUserErr("An account with this email already exists");
      } else {
        navigate('/error');
      }
    }
  };

  return success ? (
    <h3>Account registered successfully! Redirecting...</h3>
  ) : (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <h1>Register an account</h1>
      <div className="input-field">
        <label>Email</label>
        <InputField
          name="email"
          {...register("email", { validate: emailValidation })}
        />
        {errors.email && (
          <p className="auth-error-message">{errors.email.message}</p>
        )}
      </div>
      <div className="input-field">
        <label>Username</label>
        <InputField
          name="username"
          {...register("username", { validate: usernameValidation })}
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
          {...register("password", { validate: passwordValidation })}
        />
        {errors.password && (
          <p className="auth-error-message">{errors.password.message}</p>
        )}
      </div>
      {existingUserErr && <p className="auth-error-message">{existingUserErr}</p>}
      <div className="submit-btn">
        <FilledBtn
          text={loading ? <CircularProgress size={20} /> : "Create account"}
          width="100%"
          type="submit"
          disabled={loading}
        />
      </div>
    </form>
  );
}
