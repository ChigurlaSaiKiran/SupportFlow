import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createPriority,
  getPriorityById,
  updatePriority,
} from "../../api/priorityApi";
import { useSnackbar } from "../../context/SnackbarContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const prioritySchema = z.object({
  name: z.string().min(3, "Priority name must be at least 3 characters"),
});

const PriorityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(prioritySchema),
  });

  /* 🔹 Load priority when editing */
  useEffect(() => {
    if (id) fetchPriority();
  }, [id]);

  const fetchPriority = async () => {
    try {
      setLoading(true);
      const res = await getPriorityById(id);
      setValue("name", res.data.name);
    } catch {
      showSnackbar("Failed to load priority", "error");
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 Submit */
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (id) {
        await updatePriority(id, {
          id: Number(id),
          name: data.name,
        });
        showSnackbar("Priority updated successfully", "success");
      } else {
        await createPriority(data);
        showSnackbar("Priority created successfully", "success");
      }
      setTimeout(() => navigate("/priorities"), 800);
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} maxWidth={500} mx="auto">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/priorities")}
            disabled={loading}
          >
            Back
          </Button>
        </Box>
        <Typography variant="h5" mb={2}>
          {id ? "Edit Priority" : "Add Priority"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Priority Name"
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <Box display="flex" gap={2} sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/priorities")}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ flex: 1 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : id ? (
                "Update Priority"
              ) : (
                "Create Priority"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default PriorityForm;
