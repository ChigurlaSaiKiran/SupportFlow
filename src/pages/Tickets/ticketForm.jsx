import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "../../context/SnackbarContext";
import {
  createTicket,
  updateTicket,
  getTicketById,
  getPriorities,
  getStatuses,
  getCategories,
  getDepartments,
  getAllusers,
} from "../../api/ticketApi";

const TicketForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  //new 02/12
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    statusId: "1",
    priorityId: "",
    categoryId: "",
    departmentId: "",
    createdById: null, // object (display only)
    assignedToId: "",
  });

  const [Statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [createdBy, setCreatedBy] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  // ================= LOAD DROPDOWNS =================
  const loadDropdowns = async () => {
    try {
      const [sRes, pRes, cRes, dRes, uRes] = await Promise.all([
        getStatuses(),
        getPriorities(),
        getCategories(),
        getDepartments(),
        getAllusers(),
      ]);
      const users = uRes?.data || [];

      setStatuses(sRes.data || []);
      setPriorities(pRes.data || []);
      setCategories(cRes.data || []);
      setDepartments(dRes.data || []);
      setCreatedBy(users);
      setAssignedTo(users);
      // ✅ Read logged-in user from localStorage
      if (!isEditMode) {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        setFormData((prev) => ({
          ...prev,
          createdById: loggedInUser?.id ?? null,
        }));
      }
      // // Auto select first user for create mode
      // if (!isEditMode && users.length > 0) {
      //   setFormData((prev) => ({
      //     ...prev,
      //     createdById: users[0].id,
      //   }));
      // }
    } catch (err) {
      console.error("Dropdown Load Error", err);
    }
  };

  // ================= LOAD EDIT DATA =================
  const loadTicket = async () => {
    if (!isEditMode) return;

    try {
      setLoading(true);
      const res = await getTicketById(id);
      const ticket = res.data;
      // console.log(typeof ticket.priority.id);

      setFormData({
        title: ticket.title || "",
        description: ticket.description || "",

        statusId: ticket.status?.id ?? "",
        priorityId: ticket.priority?.id ?? "",
        categoryId: ticket.category?.id ?? "",
        departmentId: ticket.department?.id ?? "",
        // createdById: ticket.createdBy?.id ?? "",
        //assignedToId: ticket.assignedTo?.id ?? "",

        // 🔥 STORE FULL OBJECT (For Display)
        createdBy: ticket.createdBy || null,
        // 🔥 ONLY STORE ID (For Update)
        assignedToId: ticket.assignedTo?.id || "",
      });
    } catch (err) {
      console.error("Ticket Load Error", err);
    } finally {
      setLoading(false);
    }
  };
  // ================= LOAD ON PAGE LOAD =================
  useEffect(() => {
    loadDropdowns();
    loadTicket();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Id") ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditMode) {
        // ✅ UPDATE PAYLOAD (FULL)
        const payload = {
          id: Number(id),
          title: formData.title,
          description: formData.description,
          statusId: Number(formData.statusId),
          priorityId: Number(formData.priorityId),
          categoryId: Number(formData.categoryId),
          departmentId: Number(formData.departmentId),
          //createdById: Number(formData.createdById),
          assignedToId: Number(formData.assignedToId),
        };
        await updateTicket(id, payload);
        // await updateTicket(id, formData);
        showSnackbar("Ticket updated successfully", "success"); // ✅
      } else {
        // ✅ CREATE PAYLOAD (NO STATUS)
        const payload = {
          title: formData.title,
          description: formData.description,
          priorityId: Number(formData.priorityId),
          categoryId: Number(formData.categoryId),
          departmentId: Number(formData.departmentId),
          createdById: Number(formData.createdById),
          assignedToId: Number(formData.assignedToId),
        };
        await createTicket(payload);
        //await createTicket(formData);
        showSnackbar("Ticket created successfully", "success"); // ✅
      }
      navigate("/tickets");
    } catch (err) {
      showSnackbar("Something went wrong. Please try again.", "error"); // ✅
      console.error("Save Error", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 699,
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
          onClick={() => navigate("/tickets")}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" fontWeight={600}>
          {isEditMode ? "Edit Ticket" : "Create Ticket"}
        </Typography>
        <Box sx={{ width: 100 }} />
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Section 1: Ticket Details */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          sx={{ mt: 2, mb: 1 }}
        >
          Ticket Details
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
        />

        {/* Section 2: Classification */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          sx={{ mt: 3, mb: 1 }}
        >
          Classification
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Priority"
              name="priorityId"
              value={formData.priorityId}
              onChange={handleChange}
              margin="normal"
              required
            >
              {priorities.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              margin="normal"
              required
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Department"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              margin="normal"
              required
            >
              {departments.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {isEditMode && (
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                name="statusId"
                value={formData.statusId}
                onChange={handleChange}
                margin="normal"
                required
              >
                {Statuses.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
        </Grid>

        {/* Section 3: Assignment */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          sx={{ mt: 3, mb: 1 }}
        >
          Assignment
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              margin="dense"
              label="Created By"
              value={formData.createdBy?.fullName || ""}
              //  margin="normal"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              select
              fullWidth
              size="small"
              margin="normal"
              label="Assigned To"
              name="assignedToId"
              value={formData.assignedToId}
              onChange={handleChange}
            >
              {assignedTo.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.fullName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box display="flex" gap={2} sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/tickets")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEditMode ? (
              "Update Ticket"
            ) : (
              "Create Ticket"
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TicketForm;
