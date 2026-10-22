import { useState } from "react";
import {
  Box, Paper, Typography, TextField,
  Button, MenuItem, CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createLeaveRequest } from "../../api/leaveRequestApi";
import { useSnackbar } from "../../context/SnackbarContext";
import SaveIcon     from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const LEAVE_TYPES = ["Casual", "Sick", "Earned"];

export default function LeaveRequestForm() {
  const navigate         = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [form, setForm]     = useState({
    fromDate  : "",
    toDate    : "",
    leaveType : "Casual",
    reason    : "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fromDate || !form.toDate) {
      showSnackbar("Please select from and to dates", "error");
      return;
    }
    if (new Date(form.fromDate) > new Date(form.toDate)) {
      showSnackbar("From date cannot be after to date", "error");
      return;
    }
    if (!form.reason.trim()) {
      showSnackbar("Please provide a reason", "error");
      return;
    }

    try {
      setLoading(true);
      await createLeaveRequest(form);
      showSnackbar("Leave request submitted!", "success");
      navigate("/leaverequests");
    } catch (err) {
      showSnackbar(
        err.response?.data || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate total days
  const totalDays = form.fromDate && form.toDate
    ? Math.max(0,
        Math.floor(
          (new Date(form.toDate) - new Date(form.fromDate))
          / (1000 * 60 * 60 * 24)
        ) + 1
      )
    : 0;

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/leaverequests")}
          variant="outlined"
          size="small"
        >
          Back
        </Button>
        <Typography variant="h5" fontWeight={700}>
          Apply for Leave
        </Typography>
      </Box>

      <Paper elevation={0} sx={{
        p: 4, maxWidth: 600, borderRadius: 2,
        border: "1px solid", borderColor: "divider"
      }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            select
            label="Leave Type"
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            required
          >
            {LEAVE_TYPES.map(t => (
              <MenuItem key={t} value={t}>{t} Leave</MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="From Date"
            name="fromDate"
            type="date"
            value={form.fromDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="To Date"
            name="toDate"
            type="date"
            value={form.toDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />

          {/* Total days preview */}
          {totalDays > 0 && (
            <Box sx={{
              mt: 1, p: 1.5, borderRadius: 1,
              backgroundColor: "primary.main",
              color: "white", textAlign: "center"
            }}>
              <Typography variant="body2" fontWeight={600}>
                Total Days: {totalDays} day{totalDays > 1 ? "s" : ""}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Reason"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Please provide reason for leave..."
            required
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3, py: 1.2 }}
            disabled={loading}
            startIcon={<SaveIcon />}
          >
            {loading
              ? <CircularProgress size={24} color="inherit" />
              : "Submit Leave Request"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}