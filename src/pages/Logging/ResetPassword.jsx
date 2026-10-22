import { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockResetIcon from "@mui/icons-material/LockReset";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import API from "../../api/api";
import { useSnackbar } from "../../context/SnackbarContext";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check email present
    if (!email) {
      showSnackbar(
        "Email is missing. Please go back to Forgot Password.",
        "error"
      );
      return;
    }

    // ✅ Check passwords match
    if (newPassword !== confirmPassword) {
      showSnackbar("Passwords do not match", "error");
      return;
    }

    // ✅ Min length
    if (newPassword.length < 6) {
      showSnackbar("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/reset-password", { email, newPassword });
      showSnackbar(
        "Password reset successfully! Redirecting to login...",
        "success"
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.response?.status === 404) {
        showSnackbar("Email not found. Please check your email.", "error");
      } else {
        showSnackbar("Something went wrong. Try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #00bcd4 100%)",
      }}
    >
      <Paper elevation={8} sx={{ padding: 4, width: 400, borderRadius: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "white",
              mb: 1,
            }}
          >
            <ConfirmationNumberIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            SupportFlow
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Reset your password
          </Typography>
        </Box>

        {/* Warning if no email */}
        {!email && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              borderRadius: 1,
              backgroundColor: "#fff3e0",
              border: "1px solid #ff9800",
            }}
          >
            <Typography variant="body2" color="warning.dark">
              ⚠️ Email not found. Please go back to{" "}
              <Link to="/forgot-password">Forgot Password</Link> first.
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email (read only) */}
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ readOnly: !!emailFromState }}
            helperText={!emailFromState ? "Enter your registered email" : ""}
          />

          {/* New Password */}
          <TextField
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirm Password */}
          <TextField
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={confirmPassword !== "" && newPassword !== confirmPassword}
            helperText={
              confirmPassword !== "" && newPassword !== confirmPassword
                ? "Passwords do not match"
                : ""
            }
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2, py: 1.2 }}
            disabled={loading}
            startIcon={<LockResetIcon />}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link to="/login">Back to Login</Link>
        </Box>
      </Paper>
    </Box>
  );
}
                                             