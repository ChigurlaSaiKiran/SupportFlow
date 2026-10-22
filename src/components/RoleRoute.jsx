import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getRole } from "../utils/auth";
import { Box, Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const RoleRoute = ({ allowed = [], children }) => {
  const role = getRole();
  if (!role) return <Navigate to="/login" />;
  if (!allowed.includes(role)) return <AccessDenied />;
  return children;
};

const AccessDenied = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection="column" alignItems="center"
      justifyContent="center" minHeight="70vh" gap={2}>
      <Box sx={{ p: 3, borderRadius: "50%", backgroundColor: "#fce4ec", display: "inline-flex" }}>
        <LockIcon sx={{ fontSize: 56, color: "#c62828" }} />
      </Box>
      <Typography variant="h5" fontWeight={700}>Access Denied</Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center">
        You don't have permission to view this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default RoleRoute;