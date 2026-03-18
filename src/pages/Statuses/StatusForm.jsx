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
import { getStatusById, createStatus, updateStatus } from "../../api/statusApi";
import { useSnackbar } from "../../context/SnackbarContext";

const statusSchema = z.object({
  name: z.string().min(3, "Status name must be at least 3 characters"),
});

const StatusForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(statusSchema),
  });

  /* 🔹 Load Status when editing */
  useEffect(() => {
    if (id) fetchStatus();
  }, [id]);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await getStatusById(id);
      setValue("name", res.data.name);
    } catch {
      showSnackbar("Failed to load Status", "error");
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 Submit */
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (id) {
        await updateStatus(id, {
          id: Number(id),
          name: data.name,
        });
        showSnackbar("Status updated successfully", "success");
      } else {
        await createStatus(data);
        showSnackbar("Status created successfully", "success");
      }
      setTimeout(() => navigate("/statuses"), 800);
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} maxWidth={500} mx="auto">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          {id ? "Edit Status" : "Add Status"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Status Name"
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          {/* Buttons */}
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/statuses")}
              disabled={submitLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : id ? (
                "Update Status"
              ) : (
                "Create Status"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
export default StatusForm;
