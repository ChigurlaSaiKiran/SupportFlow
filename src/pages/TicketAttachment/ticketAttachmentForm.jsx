import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  MenuItem,
  TextField,
  CircularProgress,
  LinearProgress,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { uploadTicketAttachment } from "../../api/ticketAttachmentApi";
import { getAllTickets } from "../../api/ticketApi";
import { useSnackbar } from "../../context/SnackbarContext";

// ✅ File type icon helper
const getFileIcon = (file) => {
  if (!file) return <InsertDriveFileIcon />;
  if (file.type.includes("image")) return <ImageIcon sx={{ color: "#1565c0" }} />;
  if (file.type.includes("pdf")) return <PictureAsPdfIcon sx={{ color: "#d32f2f" }} />;
  return <InsertDriveFileIcon sx={{ color: "#616161" }} />;
};

// ✅ File size formatter
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const TicketAttachmentForm = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [tickets, setTickets] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ Load tickets for dropdown
  useEffect(() => {
    getAllTickets()
      .then((res) => setTickets(res.data || []))
      .catch(() => showSnackbar("Failed to load tickets", "error"));
  }, []);

  // ✅ Generate image preview
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    if (file.type.includes("image")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    // ✅ Max 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      showSnackbar("File size must be less than 10MB", "error");
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange(dropped);
  };

  const handleSubmit = async () => {
    if (!ticketId) { showSnackbar("Please select a ticket", "error"); return; }
    if (!file) { showSnackbar("Please select a file", "error"); return; }

    try {
      setLoading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("ticketId", ticketId);
      formData.append("file", file);

      // ✅ Simulate progress (real progress needs axios onUploadProgress)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) { clearInterval(interval); return prev; }
          return prev + 10;
        });
      }, 150);

      await uploadTicketAttachment(formData);

      clearInterval(interval);
      setUploadProgress(100);

      showSnackbar("File uploaded successfully!", "success");
      setTimeout(() => navigate("/attachments"), 800);
    } catch {
      showSnackbar("Upload failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} maxWidth={700} mx="auto">
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/attachments")}
          sx={{ textTransform: "none" }}
        >
          Back
        </Button>
        <Typography variant="h5" fontWeight={700}>
          Upload Ticket Attachment
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
      >
        {/* Ticket Selector */}
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          Select Ticket *
        </Typography>
        <TextField
          select
          fullWidth
          size="small"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          placeholder="Select a ticket"
          sx={{ mb: 3 }}
          disabled={loading}
        >
          <MenuItem value="" disabled>
            Select a ticket
          </MenuItem>
          {tickets.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              #{t.id} — {t.title}
            </MenuItem>
          ))}
        </TextField>

        {/* Drag & Drop Upload Area */}
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          Upload File *
        </Typography>
        <Box
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !loading && document.getElementById("file-input").click()}
          sx={{
            border: "2px dashed",
            borderColor: dragOver ? "primary.main" : file ? "success.main" : "grey.300",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: dragOver ? "primary.50" : file ? "success.50" : "grey.50",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: loading ? "grey.300" : "primary.main",
              backgroundColor: loading ? "grey.50" : "primary.50",
            },
          }}
        >
          <input
            id="file-input"
            type="file"
            hidden
            onChange={(e) => handleFileChange(e.target.files[0])}
            accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.csv"
          />

          {!file ? (
            <>
              <UploadFileIcon sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
              <Typography variant="body1" fontWeight={500} color="text.secondary">
                Drag & drop a file here or click to browse
              </Typography>
              <Typography variant="caption" color="text.disabled" mt={0.5} display="block">
                Supported: Images, PDF, Word, Excel, TXT — Max 10MB
              </Typography>
            </>
          ) : (
            <>
              {/* Image Preview */}
              {preview ? (
                <Box mb={1}>
                  <img
                    src={preview}
                    alt="preview"
                    style={{
                      maxHeight: 160,
                      maxWidth: "100%",
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ) : (
                <Box mb={1}>{getFileIcon(file)}</Box>
              )}

              {/* File info chip */}
              <Chip
                icon={getFileIcon(file)}
                label={`${file.name} (${formatFileSize(file.size)})`}
                onDelete={() => !loading && setFile(null)}
                deleteIcon={<CloseIcon />}
                color="success"
                variant="outlined"
                sx={{ maxWidth: "100%" }}
              />
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Click to change file
              </Typography>
            </>
          )}
        </Box>

        {/* Upload Progress */}
        {loading && (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" color="text.secondary">
                Uploading...
              </Typography>
              <Typography variant="caption" color="primary">
                {uploadProgress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        )}

        {/* Actions */}
        <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => navigate("/attachments")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !file || !ticketId}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <UploadFileIcon />}
          >
            {loading ? "Uploading..." : "Upload File"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TicketAttachmentForm;