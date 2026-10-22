import React, { useRef, useState, useEffect } from "react";
import {
  TextField,
  Button,
  Avatar,
  Paper,
  Typography,
  Box,
  InputAdornment,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import BadgeIcon from "@mui/icons-material/Badge";
import { useNavigate } from "react-router-dom";
//import { updateUser } from "../../api/userApi";
import { updateUser } from "../../src/api/userApi";
import { useSnackbar } from "../context/SnackbarContext";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { getMyStatus, updateMyStatus } from "../api/presenceApi";
const STATUSES = [
  { label: "Available", color: "#44b700" },
  { label: "Busy", color: "#f44336" },
  { label: "Do Not Disturb", color: "#f44336" },
  { label: "Be Right Back", color: "#ff9800" },
  { label: "Appear Away", color: "#ff9800" },
  { label: "Offline", color: "#bdbdbd" },
];

const getRoleLabel = (roleId) => {
  const roles = { 1: "Admin", 2: "Manager", 3: "User" };
  return roles[roleId] || "User";
};

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { showSnackbar } = useSnackbar();
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    // phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState("Offline");
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(stored);
      setFormData({
        fullName: stored.fullName || "",
        email: stored.email || "",
        // phone: stored.phone || "",
      });
    } catch {
      showSnackbar("Failed to load profile", "error");
    }
    // ✅ Fetch current status from backend
    getMyStatus()
      .then((res) => setAvailabilityStatus(res.data.availabilityStatus))
      .catch(() => {});
  }, []);

  const handleStatusChange = async (status) => {
    setStatusAnchor(null);
    try {
      setStatusLoading(true);
      await updateMyStatus(status);
      setAvailabilityStatus(status);
      showSnackbar(`Status set to ${status}`, "success");
    } catch {
      showSnackbar("Failed to update status", "error");
    } finally {
      setStatusLoading(false);
    }
  };

  const currentStatus =
    STATUSES.find((s) => s.label === availabilityStatus) || STATUSES[5];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showSnackbar("Image must be less than 2MB", "error");
        return;
      }
      setImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      showSnackbar("User ID not found", "error");
      return;
    }
    try {
      setLoading(true);
      await updateUser(user.id, {
        fullName: formData.fullName,
        email: formData.email,
        // phone: formData.phone,
      });
      localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
      setUser((prev) => (prev ? { ...prev, ...formData } : null));
      showSnackbar("Profile updated successfully", "success");
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to update profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 640, margin: "0 auto", pb: 4 }}>
      {/* Header with Back */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="h5" fontWeight={700}>
          My Profile
        </Typography>
      </Box>

      {/* Cover + Avatar Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          mb: 2,
        }}
      >
        {/* Cover */}
        <Box
          sx={{
            height: 120,
            background:
              "linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #00bcd4 100%)",
          }}
        />
        <Box sx={{ px: 3, pb: 3, mt: -6 }}>
          {/* Avatar */}
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <Avatar
              src={image}
              sx={{
                width: 100,
                height: 100,
                border: "4px solid",
                borderColor: "background.paper",
                bgcolor: "primary.main",
                fontSize: 40,
                boxShadow: 2,
              }}
            >
              {formData.fullName?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
                width: 36,
                height: 36,
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <CameraAltIcon fontSize="small" />
            </IconButton>
          </Box>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleImageUpload}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" fontWeight={700}>
              {formData.fullName || "User"}
            </Typography>
            <Chip
              icon={<BadgeIcon />}
              label={getRoleLabel(user.roleId)}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
            {/* ✅ ADD STATUS SELECTOR RIGHT HERE */}
            {/* ✅ Teams-style status selector */}
            <Box display="flex" alignItems="center" gap={1} mt={2}>
              <Box
                onClick={(e) => setStatusAnchor(e.currentTarget)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  bgcolor: "grey.50",
                  "&:hover": { bgcolor: "action.hover" },
                  width: "fit-content",
                  minWidth: 180,
                }}
              >
                {statusLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <CircleIcon
                    sx={{ fontSize: 16, color: currentStatus.color }}
                  />
                )}
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {availabilityStatus}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Click to change status
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Personal Information Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Personal Information
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box component="form" onSubmit={handleUpdate}>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          {/* <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          /> */}

          <Box display="flex" gap={2} sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Profile"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Account Info Card (read-only) */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Account
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body2" color="text.secondary">
            User ID: {user.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: {getRoleLabel(user.roleId)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
