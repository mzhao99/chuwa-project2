import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authThunk";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme, useMediaQuery } from "@mui/material";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // const { user, role } = useSelector((state) => state.user); // TODO: implement user slice
  // TODO: Replace these with actual user data
  const role = null; 
  const user = null; 

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = user
    ? {
        hr: [
          { label: "Home", path: "/dashboard" },
          { label: "Employee Profiles", path: "/employee-profiles" },
          { label: "Visa Status Management", path: "/visa-status" },
          { label: "Hiring Management", path: "/hiring" },
        ],
        employee: [
          { label: "Home", path: "/dashboard" },
          { label: "Personal Information", path: "/personal-info" },
          { label: "Visa Status Management", path: "/visa-status" },
        ],
      }
    : [{}];

  const renderMenu = () => (
    <Box sx={{ width: isMobile ? 250 : "auto" }} role="presentation">
      <List>
        {(menuItems[role] || menuItems).map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "#074e75" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {user ? (role === "hr" ? "HR Dashboard" : "Employee Dashboard") : "Welcome"}
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {renderMenu()}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            {(menuItems[role] || menuItems).map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{
                  textTransform: "capitalize",
                  fontSize: "16px",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;