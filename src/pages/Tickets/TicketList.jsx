import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import InboxIcon from "@mui/icons-material/Inbox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllTickets, deleteTicket } from "../../api/ticketApi";
import { useSnackbar } from "../../context/SnackbarContext";

const TicketList = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await getAllTickets();
      const data = res.data.map((t) => ({ ...t, id: t.id }));
      setTickets(data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        showSnackbar("Failed to load tickets", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      loadTickets();
    }
  }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTicket(deleteId);
      showSnackbar("Ticket deleted successfully", "success");
      loadTickets();
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const getStatusColor = (statusName) => {
    if (!statusName) return "default";
    const s = String(statusName).toLowerCase();
    if (s === "open" || s === "new") return "info";
    if (s === "in progress" || s === "inprogress" || s === "pending")
      return "warning";
    if (s === "closed") return "success";
    return "default";
  };

  const filteredTickets = tickets.filter((t) =>
    t.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", minWidth: 250, flex: 1 },
    { field: "description", headerName: "Description", minWidth: 200, flex: 1 },
    {
      field: "priorityName",
      headerName: "Priority",
      flex: 1,
      valueGetter: (_, row) => row?.priority?.name || "-",
    },
    {
      field: "categoryName",
      headerName: "Category",
      flex: 1,
      valueGetter: (_, row) => row?.category?.name || "-",
    },
    {
      field: "departmentName",
      headerName: "Department",
      flex: 1,
      valueGetter: (_, row) => row?.department?.name || "-",
    },
    {
      field: "StatusName",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.row?.status?.name || "-"}
          size="small"
          color={getStatusColor(params.row?.status?.name)}
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: "CreatedBy",
      headerName: "Created By",
      flex: 1,
      valueGetter: (_, row) => row?.createdBy?.fullName ?? "-",
    },
    {
      field: "AssignedTo",
      headerName: "Assigned To",
      flex: 1,
      valueGetter: (_, row) => row?.assignedTo?.fullName || "-",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/tickets/details/${params.row.id}`);
            }}
            title="View"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/tickets/edit/${params.row.id}`);
            }}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(params.row.id);
            }}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={700}>
          Ticket Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/tickets/create")}
        >
          Create Ticket
        </Button>
      </Box>

      <TextField
        placeholder="Search tickets..."
        size="small"
        sx={{ mb: 2, maxWidth: 320 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        {filteredTickets.length === 0 && !loading ? (
          <Box py={8} textAlign="center">
            <InboxIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tickets found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {searchText
                ? "Try a different search"
                : "Create your first ticket to get started"}
            </Typography>
            {!searchText && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/tickets/create")}
              >
                Create Ticket
              </Button>
            )}
          </Box>
        ) : (
          <DataGrid
            rows={filteredTickets}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            autoHeight
            onRowClick={(params) =>
              navigate(`/tickets/details/${params.row.id}`)
            }
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "grey.50",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "action.hover",
              },
            }}
          />
        )}
      </Paper>

      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this ticket? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketList;
