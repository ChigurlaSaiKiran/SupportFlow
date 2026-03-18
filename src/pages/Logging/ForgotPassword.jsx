import { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/api";
import { useSnackbar } from "../../context/SnackbarContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/forgot-password", { email });
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      if (err.response?.status === 404) {
        showSnackbar("Email not found", "error");
      } else {
        showSnackbar("Something went wrong", "error");
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
        background: "linear-gradient(to right, #1976d2, #00bcd4)",
      }}
    >
      <Paper elevation={6} sx={{ padding: 4, width: 380 }}>
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Enter your registered email to reset your password.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              "Continue"
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
