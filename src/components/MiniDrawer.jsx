import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  CssBaseline,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CategoryIcon from "@mui/icons-material/Category";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { getMyStatus, updateMyStatus } from "../api/presenceApi";
import CircleIcon from "@mui/icons-material/Circle";
import {
  ListItemIcon as MuiListItemIcon,
  ListItemText as MuiListItemText,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";

const drawerWidth = 240;
const collapsedWidth = 70;

const STATUSES = [
  { label: "Available", color: "#44b700" },
  { label: "Busy", color: "#f44336" },
  { label: "Do Not Disturb", color: "#f44336" },
  { label: "Be Right Back", color: "#ff9800" },
  { label: "Appear Away", color: "#ff9800" },
  { label: "Offline", color: "#bdbdbd" },
];

// ✅ 10 seconds for testing — change to 5 * 60 * 1000 for production
const INACTIVITY_TIMEOUT = 10 * 1000;

export default function MiniDrawer() {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [availabilityStatus, setAvailabilityStatus] = useState(
    localStorage.getItem("availabilityStatus") || "Offline"
  );

  // ✅ useRef to track away state across re-renders
  const isAwayRef = useRef(false);

  // ✅ useEffect 1 — on login, auto set Available
  useEffect(() => {
    const setOnlineOnLogin = async () => {
      try {
        // Always set Available when app loads (user just logged in)
        await updateMyStatus("Available");
        setAvailabilityStatus("Available");
        localStorage.setItem("availabilityStatus", "Available");
      } catch {}
    };

    setOnlineOnLogin();
  }, []); // ← runs only once on mount

  // ✅ useEffect 2 — auto away on inactivity
  useEffect(() => {
    let inactivityTimer = null;

    const goAway = async () => {
      // Only go away if currently Available
      if (!isAwayRef.current && availabilityStatus === "Available") {
        isAwayRef.current = true;
        try {
          await updateMyStatus("Appear Away");
          setAvailabilityStatus("Appear Away");
          localStorage.setItem("availabilityStatus", "Appear Away");
        } catch {}
      }
    };

    const comeBack = async () => {
      // If we auto-set to away, restore to Available on activity
      if (isAwayRef.current) {
        isAwayRef.current = false;
        try {
          await updateMyStatus("Available");
          setAvailabilityStatus("Available");
          localStorage.setItem("availabilityStatus", "Available");
        } catch {}
      }
      // Reset inactivity timer on every activity
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(goAway, INACTIVITY_TIMEOUT);
    };

    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
    ];
    events.forEach((e) => window.addEventListener(e, comeBack));

    // Start timer immediately
    inactivityTimer = setTimeout(goAway, INACTIVITY_TIMEOUT);

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((e) => window.removeEventListener(e, comeBack));
    };
  }, [availabilityStatus]); // ← re-run when status changes

  const handleStatusChange = async (status) => {
    try {
      await updateMyStatus(status);
      setAvailabilityStatus(status);
      localStorage.setItem("availabilityStatus", status);
      handleMenuClose();
    } catch {}
  };

  const currentStatusColor =
    STATUSES.find((s) => s.label === availabilityStatus)?.color || "#bdbdbd";

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const toggleDrawer = () => setOpen(!open);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const logout = async () => {
    try {
      await updateMyStatus("Offline"); // ✅ set offline in DB before logout
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("availabilityStatus");
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { text: "Categories", path: "/categories", icon: <CategoryIcon /> },
    { text: "Departments", path: "/departments", icon: <ApartmentIcon /> },
    { text: "Priorities", path: "/priorities", icon: <PriorityHighIcon /> },
    { text: "Roles", path: "/roles", icon: <AdminPanelSettingsIcon /> },
    { text: "Status", path: "/statuses", icon: <HealthAndSafetyIcon /> },
    { text: "Tickets", path: "/tickets", icon: <ConfirmationNumberIcon /> },
    {
      text: "Ticket Attachments",
      path: "/attachments",
      icon: <AttachFileIcon />,
    },
    { text: "Users", path: "/users", icon: <PeopleIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* TOPBAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2 }}>
              SupportFlow
            </Typography>
          </Box>

          <Box>
            {/* ✅ Avatar with status dot */}
            <IconButton onClick={handleMenuOpen} color="inherit">
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <Avatar sx={{ bgcolor: "#1565c0", width: 38, height: 38 }}>
                  {getInitials(user?.fullName)}
                </Avatar>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: currentStatusColor,
                    border: "2px solid #0d47a1",
                  }}
                />
              </Box>
            </IconButton>

            <NotificationBell />

            {/* ✅ Dropdown menu with status options */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{ sx: { width: 250, p: 1, borderRadius: 2 } }}
            >
              {/* User info */}
              <Box sx={{ px: 2, py: 1 }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 40, height: 40 }}
                    >
                      {getInitials(user?.fullName)}
                    </Avatar>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: currentStatusColor,
                        border: "2px solid white",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" variant="body2">
                      {user?.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="primary"
                      display="block"
                    >
                      {user?.roleName}
                    </Typography>
                  </Box>
                </Box>

                {/* Current status badge */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mt={1.5}
                  sx={{
                    px: 1.5,
                    py: 0.8,
                    borderRadius: 5,
                    border: "1px solid",
                    borderColor: "divider",
                    width: "fit-content",
                  }}
                >
                  <CircleIcon
                    sx={{ fontSize: 12, color: currentStatusColor }}
                  />
                  <Typography variant="caption" fontWeight={500}>
                    {availabilityStatus}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{ borderTop: "1px solid", borderColor: "divider", my: 1 }}
              />

              {/* Status options */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ px: 2 }}
              >
                SET STATUS
              </Typography>
              {STATUSES.map((s) => (
                <MenuItem
                  key={s.label}
                  onClick={() => handleStatusChange(s.label)}
                  selected={s.label === availabilityStatus}
                  sx={{ borderRadius: 1, mx: 0.5 }}
                >
                  <MuiListItemIcon>
                    <CircleIcon sx={{ fontSize: 14, color: s.color }} />
                  </MuiListItemIcon>
                  <MuiListItemText primary={s.label} />
                </MenuItem>
              ))}

              <Box
                sx={{ borderTop: "1px solid", borderColor: "divider", my: 1 }}
              />

              <MenuItem
                onClick={() => {
                  navigate("/profile");
                  handleMenuClose();
                }}
                sx={{ borderRadius: 1, mx: 0.5 }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={logout}
                sx={{ borderRadius: 1, mx: 0.5, color: "error.main" }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            transition: "width 0.3s",
            overflowX: "hidden",
            boxSizing: "border-box",
            backgroundColor: "#f8f9fa",
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname.startsWith(item.path)}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "& .MuiListItemIcon-root": { color: "white" },
                  "&:hover": { backgroundColor: "primary.dark" },
                },
                "&:hover": { backgroundColor: "action.hover" },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
