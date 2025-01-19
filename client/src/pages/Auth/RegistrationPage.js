import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FilledBtn from "../../components/FilledBtn";
import InputField from "../../components/InputField";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser, verifyLink } from "../../features/auth/authThunk";
import { CircularProgress } from "@mui/material";
import "../../styles/AuthForm.css";

export default function RegistrationPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth)
  const navigate = useNavigate();
  const { token } = useParams(); 

  const [existingUserErr, setExistingUserErr] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const emailValidation = (email) => {
    if (!email) {
      return "Email is required";
    }
    const atSymbol = email.indexOf("@");
    const dotSymbol = email.lastIndexOf(".");
    const isValid =
      atSymbol > 0 && dotSymbol > atSymbol + 1 && dotSymbol < email.length - 1;
    return isValid ? true : "Please enter a valid email address";
  };

  const passwordValidation = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one digit";
    }
    return true;
  };

  const usernameValidation = (username) => {
    if (!username) {
      return "Username is required";
    }
    return true;
  };

  const onSubmit = async (data) => {
    const formData = { ...data, token }; 
    try {
      const resultAction = await dispatch(registerUser(formData)).unwrap();
      if (resultAction) {
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (error) {
      if (error === "Username already exists") {
        setExistingUserErr("Username already exists");
      } else {
        navigate("/error");
      }
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(verifyLink(token)).unwrap()
        .catch(() => {
          navigate("/error", {
            state: { errMsg: "The registration link is either expired or invalid. Please contact hr." },
          });
        });
    }
  }, [dispatch, token, navigate]);


  if (useSelector(state => state.auth.user)) {
    return <h3>Account registered successfully! Redirecting...</h3>;
  }

  return (
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
      {existingUserErr && (
        <p className="auth-error-message">{existingUserErr}</p>
      )}
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
