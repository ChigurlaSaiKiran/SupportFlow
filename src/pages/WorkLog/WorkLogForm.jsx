import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  createWorkLog,
  updateWorkLog,
  getWorkLogById,
} from "../../api/workLogApi";
import { useSnackbar } from "../../context/SnackbarContext";
import { getUser } from "../../utils/auth";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TASK_STATUSES = ["InProgress", "Completed"];

export default function WorkLogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const user = getUser();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    taskDescription: "",
    hoursSpent: "",
    taskStatus: "InProgress",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getWorkLogById(id).then((res) => {
        const w = res.data;
        setForm({
          date: w.date?.split("T")[0] || "",
          taskDescription: w.taskDescription,
          hoursSpent: w.hoursSpent,
          taskStatus: w.taskStatus,
        });
      });
    }
  }, [id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.taskDescription.trim()) {
      showSnackbar("Task description is required", "error");
      return;
    }
    if (!form.hoursSpent || form.hoursSpent <= 0) {
      showSnackbar("Hours spent must be greater than 0", "error");
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateWorkLog(id, form);
        showSnackbar("Work log updated!", "success");
      } else {
        await createWorkLog(form);
        showSnackbar("Work log submitted!", "success");
      }
      navigate("/worklogs");
    } catch {
      showSnackbar("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/worklogs")}
          variant="outlined"
          size="small"
        >
          Back
        </Button>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? "Edit Work Log" : "Submit Work Log"}
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 600,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Task Description"
            name="taskDescription"
            value={form.taskDescription}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="What did you work on today?"
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Hours Spent"
            name="hoursSpent"
            type="number"
            value={form.hoursSpent}
            onChange={handleChange}
            inputProps={{ min: 0.5, max: 24, step: 0.5 }}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            select
            label="Task Status"
            name="taskStatus"
            value={form.taskStatus}
            onChange={handleChange}
          >
            {TASK_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3, py: 1.2 }}
            disabled={loading}
            startIcon={<SaveIcon />}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEdit ? (
              "Update Work Log"
            ) : (
              "Submit Work Log"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
