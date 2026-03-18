import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Paper,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FlagIcon from "@mui/icons-material/Flag";
import { getAllStatuses, deleteStatus } from "../../api/statusApi";
import EmptyState from "../../components/EmptyState";
import { useSnackbar } from "../../context/SnackbarContext";

const StatusList = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const res = await getAllStatuses();
      setStatus(res.data || []);
    } catch {
      showSnackbar("Failed to load Statuses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const filteredStatuses = status.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteStatus(deleteId);
      showSnackbar("Status deleted successfully", "success");
      fetchStatuses();
    } catch {
      showSnackbar("Delete failed", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Status Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/statuses/edit/${params.row.id}`)}
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
          Status Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/statuses/add")}
        >
          Add Status
        </Button>
      </Box>

      <TextField
        placeholder="Search statuses..."
        size="small"
        sx={{ mb: 2, maxWidth: 320 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
        {filteredStatuses.length === 0 && !loading ? (
          <EmptyState
            icon={FlagIcon}
            message="No statuses found"
            actionLabel="Add Status"
            onAction={() => navigate("/statuses/add")}
          />
        ) : (
          <DataGrid
            rows={filteredStatuses}
            columns={columns}
            loading={loading}
            autoHeight
            pageSizeOptions={[5, 10, 20]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": { backgroundColor: "grey.50" },
              "& .MuiDataGrid-row:hover": { backgroundColor: "action.hover" },
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
          <Typography>Are you sure you want to delete this status?</Typography>
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

export default StatusList;
