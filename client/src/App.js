import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/Auth/LoginPage";
import RegistrationPage from "./pages/Auth/RegistrationPage";

const App = () => {
  return (
    <Router>
      {/* <Header /> */}
      {/* <ContentWrapper> */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/:token" element={<RegistrationPage />} />  

        <Route path="/" element={<ProtectedRoute />}>
          {/* <Route index element={<HomePage />} /> */}
        </Route>

          {/* <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} /> */}
        </Routes>
      {/* </ContentWrapper> */}
      {/* <Footer /> */}
    </Router>
  );
};

export default App;
