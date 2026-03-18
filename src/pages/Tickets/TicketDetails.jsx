import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { getTicketById } from "../../api/ticketApi";
import { getAttachmentsByTicketId } from "../../api/ticketAttachmentApi";
import { getFileUrl } from "../../utils/fileHelper";
import { useSnackbar } from "../../context/SnackbarContext";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [ticket, setTicket] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState("");

  // 🔹 Load Ticket + Attachments
  const loadData = async () => {
    try {
      setLoading(true);

      const ticketRes = await getTicketById(id);
      setTicket(ticketRes.data);

      const attachRes = await getAttachmentsByTicketId(id);
      setAttachments(attachRes.data || []);
    } catch (err) {
      showSnackbar("Failed to load ticket details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  // 🔹 Preview Handler
  const handlePreview = (filePath, contentType) => {
    const url = getFileUrl(filePath);
    setPreviewUrl(url);
    setPreviewType(contentType);
    setPreviewOpen(true);
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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Typography color="error" p={3}>
        Ticket not found
      </Typography>
    );
  }

  const statusName = ticket.status?.name || ticket.statusName;
  const priorityName = ticket.priority?.name || ticket.priorityName;
  const categoryName = ticket.category?.name || ticket.categoryName;
  const departmentName = ticket.department?.name || ticket.departmentName;

  return (
    <Box p={3}>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Box display="flex" alignItems="center">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back
          </Button>
          <Typography variant="h5" fontWeight={600} sx={{ ml: 2 }}>
            Ticket #{ticket.id}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate(`/tickets/edit/${ticket.id}`)}
        >
          Edit Ticket
        </Button>
      </Box>

      {/* Ticket Info */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          sx={{ mb: 2 }}
        >
          Ticket Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Title
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {ticket.title}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1">{ticket.description || "-"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <Chip
              label={statusName || "-"}
              size="small"
              color={getStatusColor(statusName)}
              sx={{ fontWeight: 500 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Priority
            </Typography>
            <Typography variant="body1">{priorityName || "-"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Category
            </Typography>
            <Typography variant="body1">{categoryName || "-"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Department
            </Typography>
            <Typography variant="body1">{departmentName || "-"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created By
            </Typography>
            <Typography variant="body1">
              {ticket.createdBy?.fullName || ticket.createdByName || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Assigned To
            </Typography>
            <Typography variant="body1">
              {ticket.assignedTo?.fullName || ticket.assignedToName || "-"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Attachments Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Attachments
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AttachFileIcon />}
            onClick={() => navigate(`/attachments?ticketId=${ticket.id}`)}
          >
            Upload
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {attachments.length === 0 ? (
          <Box py={4} textAlign="center">
            <AttachFileIcon sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
            <Typography color="text.secondary">No attachments yet</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {attachments.map((file) => (
              <Grid item xs={12} sm={6} md={4} key={file.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography fontWeight={600} noWrap sx={{ mb: 0.5 }}>
                    {file.fileName}
                  </Typography>
                  {file.fileSize && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mb: 1 }}
                    >
                      {(file.fileSize / 1024).toFixed(2)} KB
                    </Typography>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() =>
                      handlePreview(file.filePath, file.contentType)
                    }
                  >
                    Preview
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          File Preview
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {previewType?.includes("image") && (
            <img
              src={previewUrl}
              alt="preview"
              style={{ width: "100%", borderRadius: 8 }}
            />
          )}

          {previewType?.includes("pdf") && (
            <iframe
              src={previewUrl}
              title="PDF Preview"
              width="100%"
              height="600px"
            />
          )}

          {!previewType?.includes("image") && !previewType?.includes("pdf") && (
            <Button
              variant="contained"
              onClick={() => window.open(previewUrl, "_blank")}
            >
              Open File
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TicketDetails;
