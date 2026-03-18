import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import {
  getDepartmentById,
  createDepartment,
  updateDepartment,
} from "../../api/departmentApi";
import { useSnackbar } from "../../context/SnackbarContext";

const DepartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [department, setDepartment] = useState({ name: "" });

  useEffect(() => {
    if (id) fetchDepartment();
  }, [id]);

  const fetchDepartment = async () => {
    try {
      const data = await getDepartmentById(id);
      setDepartment({ name: data.name });
    } catch {
      showSnackbar("Failed to load department", "error");
    }
  };

  const handleChange = (e) => {
    setDepartment({ ...department, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateDepartment(id, { id: Number(id), name: department.name });
        showSnackbar("Department updated successfully", "success");
      } else {
        await createDepartment(department);
        showSnackbar("Department created successfully", "success");
      }
      navigate("/departments");
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Operation failed", "error");
    }
  };

  return (
    <Box p={4} maxWidth={500} mx="auto">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          {id ? "Edit Department" : "Add Department"}
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextField
            label="Name"
            name="name"
            value={department.name}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            {id ? "Update" : "Save"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default DepartmentForm;
