import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  updateCategory,
  createCategory,
  getCategoryById,
} from "../../api/categoryApi";
import { useSnackbar } from "../../context/SnackbarContext";

const categorySchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters"),
});

const CategoryForm = () => {
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
    resolver: zodResolver(categorySchema),
  });

  /* 🔹 Load Category when editing */
  useEffect(() => {
    if (id) fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await getCategoryById(id);
      setValue("name", res.data.name);
    } catch {
      showSnackbar("Failed to load Category", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (id) {
        await updateCategory(id, {
          id: Number(id),
          name: data.name,
        });
        showSnackbar("Category updated successfully", "success");
      } else {
        await createCategory(data);
        showSnackbar("Category created successfully", "success");
      }
      setTimeout(() => navigate("/categories"), 800);
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
          {id ? "Edit Category" : "Add Category"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Category Name"
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

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
              "Update Category"
            ) : (
              "Create Category "
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
export default CategoryForm;
