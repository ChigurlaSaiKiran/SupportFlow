import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createRole, updateRole, getRoleById } from "../../api/roleApi";
import { useSnackbar } from "../../context/SnackbarContext";

const RoleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSnackbar } = useSnackbar();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isEdit) fetchRole();
  }, [id]);

  const fetchRole = async () => {
    try {
      setLoading(true);
      const role = await getRoleById(id);
      setValue("name", role.name);
    } catch {
      showSnackbar("Failed to load role", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isEdit) {
        await updateRole(id, { id: Number(id), name: data.name });
        showSnackbar("Role updated successfully", "success");
      } else {
        await createRole(data);
        showSnackbar("Role created successfully", "success");
      }
      setTimeout(() => navigate("/roles"), 800);
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 500,
        margin: "auto",
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/roles")}
          disabled={loading}
        >
          Back
        </Button>
        <Typography variant="h5" fontWeight={600}>
          {isEdit ? "Edit Role" : "Add Role"}
        </Typography>
        <Box sx={{ width: 80 }} />
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Role Name"
          fullWidth
          margin="normal"
          {...register("name", {
            required: "Role name is required",
            minLength: {
              value: 2,
              message: "Minimum 2 characters",
            },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <Box display="flex" gap={2} sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/roles")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEdit ? (
              "Update Role"
            ) : (
              "Create Role"
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default RoleForm;
