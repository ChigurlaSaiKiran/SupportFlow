import { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../../api/api";
import { useSnackbar } from "../../context/SnackbarContext";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const emailFromState = location.state?.email || "";
  const [email] = useState(emailFromState);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/reset-password", { email, newPassword });
      showSnackbar("Password reset successfully", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      showSnackbar("Something went wrong", "error");
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
        background: "linear-gradient(to right, #1976d2, #00bcd4)",
      }}
    >
      <Paper elevation={6} sx={{ padding: 4, width: 380 }}>
        <Typography variant="h5" gutterBottom>
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={email}
            InputProps={{ readOnly: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Link to="/login">Back to Login</Link>
        </Box>
      </Paper>
    </Box>
  );
}
