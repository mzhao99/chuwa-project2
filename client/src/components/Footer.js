import React from "react";
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="social-links">
        <YouTubeIcon className="icon" style={{ color: "white", fontSize: "25px" }} />
        <TwitterIcon className="icon" style={{ color: "white", fontSize: "25px" }} />
        <FacebookIcon className="icon" style={{ color: "white", fontSize: "25px" }} />
      </div>
      <div className="copyright">©2025 All Rights Reserved.</div>
      <div className="links">
        <a href="" className="link">Contact Us</a>
        <a href="" className="link">Privacy Policies</a>
        <a href="" className="link">Help</a>
      </div>
    </footer>
  );
};

export default Footer;
