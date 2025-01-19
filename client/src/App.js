import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/Auth/LoginPage";
import RegistrationPage from "./pages/Auth/RegistrationPage";
import ErrorPage from "./pages/ErrorPage";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import "./App.css";

const AppContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "#f9fafb",
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  marginTop: "0 auto",
  flexGrow: 1,
  padding: theme.spacing(2), // 16px
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const App = () => {
  return (
    <AppContainer>
      <Router>
        <Header />
        <ContentWrapper>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register/:token" element={<RegistrationPage />} />

            <Route path="/" element={<ProtectedRoute />}>
              {/* <Route index element={<HomePage />} /> */}
            </Route>

            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </ContentWrapper>
        <Footer />
      </Router>
    </AppContainer>
  );
};

export default App;
