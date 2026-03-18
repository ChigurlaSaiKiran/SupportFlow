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
// import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { getFileUrl } from "../../utils/fileHelper";
import {
  getAllTicketAttachments,
  deleteTicketAttachment,
} from "../../api/ticketAttachmentApi";
import EmptyState from "../../components/EmptyState";
import { useSnackbar } from "../../context/SnackbarContext";

const TicketAttachmentList = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const res = await getAllTicketAttachments();
      setRows(res.data || []);
    } catch {
      showSnackbar("Failed to load attachments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, []);

  const filteredRows = rows.filter((a) =>
    a.fileName?.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTicketAttachment(deleteId);
      showSnackbar("Attachment deleted successfully", "success");
      fetchAttachments();
    } catch {
      showSnackbar("Delete failed", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const openFile = (url) => {
    if (!url) return;
    window.open(getFileUrl(url), "_blank");
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "ticketId", headerName: "Ticket ID", width: 120 },
    {
      field: "filePreview",
      headerName: "Preview",
      width: 120,
      renderCell: (params) => {
        const type = params.row.contentType || "";
        if (type?.includes("image")) {
          return (
            <img
              src={getFileUrl(params.row.filePath)}
              alt="preview"
              style={{
                width: 60,
                height: 40,
                objectFit: "cover",
                cursor: "pointer",
                borderRadius: 4,
              }}
              onClick={() =>
                window.open(getFileUrl(params.row.filePath), "_blank")
              }
            />
          );
        }
        return (
          <Button size="small" onClick={() => openFile(params.row.filePath)}>
            View File
          </Button>
        );
      },
    },
    {
      field: "fileName",
      headerName: "File Name",
      flex: 1,
    },
    {
      field: "contentType",
      headerName: "Type",
      width: 180,
    },
    {
      field: "uploadedDate",
      headerName: "Uploaded",
      width: 200,
      renderCell: (params) => {
        if (!params?.row?.uploadedDate) return "-";
        return new Date(params.row.uploadedDate).toLocaleString();
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          {/* <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/attachments/edit/${params.row.id}`)}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton> */}
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
          Ticket Attachment Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/attachments/add")}
        >
          Add Attachment
        </Button>
      </Box>

      <TextField
        placeholder="Search file name..."
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
        {filteredRows.length === 0 && !loading ? (
          <EmptyState
            icon={AttachFileIcon}
            message="No attachments found"
            actionLabel="Add Attachment"
            onAction={() => navigate("/attachments")}
          />
        ) : (
          <DataGrid
            rows={filteredRows}
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
          <Typography>
            Are you sure you want to delete this attachment?
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

export default TicketAttachmentList;
