import { useLocation, useNavigate, Navigate } from "react-router-dom";
import FilledBtn from "../components/FilledBtn";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // const hasError = location.state?.hasError;
  // if (!hasError && location.pathname === "/error") {
  //   return <Navigate to="/" />;
  // }

  return (
    <div className="error-page">
      <ErrorOutlineIcon style={{ color: "#00b4d8", fontSize: "100px" }} />
      <h1>Oops, something went wrong!</h1>
      <p>{location.state?.errMsg || "An unknown error occurred."}</p>
      {/* <FilledBtn
        text="Go Home"
        width="300px"
        type="submit"
        onClick={() => {
          navigate("/");
        }}
      /> */}
    </div>
  );
}