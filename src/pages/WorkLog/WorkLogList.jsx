import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import {
  getMyWorkLogs,
  getAllWorkLogs,
  getPendingApprovals,
  deleteWorkLog,
  approveWorkLog,
} from "../../api/workLogApi";
import { useSnackbar } from "../../context/SnackbarContext";
import { getUser, getRole } from "../../utils/auth";

const getApprovalColor = (s) => {
  if (s === "Approved") return "success";
  if (s === "Rejected") return "error";
  return "warning";
};

const getTaskColor = (s) => (s === "Completed" ? "success" : "info");

export default function WorkLogList() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const user = getUser();
  const role = getRole();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [approveDialog, setApproveDialog] = useState(null);
  const [approvalForm, setApprovalForm] = useState({
    approvalStatus: "Approved",
    managerComment: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      let res;
      if (role === "Admin") {
        res = await getAllWorkLogs();
      } else {
        if (!user?.id) {
          showSnackbar("User not found. Please login again.", "error");
          return;
        }
        res = await getMyWorkLogs(user?.id);
      }
      setLogs(res?.data || []);
    } catch (err) {
      console.error("WorkLog load error:", err);
      showSnackbar("Failed to load work logs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteWorkLog(deleteId);
      showSnackbar("Deleted successfully", "success");
      setDeleteId(null);
      load();
    } catch {
      showSnackbar("Failed to delete", "error");
    }
  };

  const handleApprove = async () => {
    try {
      await approveWorkLog(approveDialog.id, {
        approvalStatus: approvalForm.approvalStatus,
        managerComment: approvalForm.managerComment,
      });
      showSnackbar(
        `Work log ${approvalForm.approvalStatus.toLowerCase()} successfully`,
        "success"
      );
      setApproveDialog(null);
      load();
    } catch {
      showSnackbar("Failed to update approval", "error");
    }
  };
  const pageTitle = () => {
    if (role === "Admin") return "All Work Logs";
    return "My Work Logs";
  };

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={700}>
          {pageTitle()}
        </Typography>
        {(role === "User" || role === "Agent") && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/worklogs/add")}
          >
            Submit Work Log
          </Button>
        )}
      </Box>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Task</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hours</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Task Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Approval</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Manager Note</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No work logs found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.userFullName}</TableCell>
                    <TableCell>
                      {new Date(log.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {log.taskDescription}
                      </Typography>
                    </TableCell>
                    <TableCell>{log.hoursSpent} hrs</TableCell>
                    <TableCell>
                      <Chip
                        label={log.taskStatus}
                        size="small"
                        color={getTaskColor(log.taskStatus)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.approvalStatus}
                        size="small"
                        color={getApprovalColor(log.approvalStatus)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {log.managerComment || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {(role === "User" || role === "Agent") &&
                        log.approvalStatus === "Pending" && (
                          <>
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/worklogs/edit/${log.id}`)
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteId(log.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirm Dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Work Log?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve / Reject Dialog */}
      <Dialog
        open={Boolean(approveDialog)}
        onClose={() => setApproveDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {approvalForm.approvalStatus === "Approved"
            ? "Approve Work Log"
            : "Reject Work Log"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Employee: {approveDialog?.userFullName}
            <br />
            Date:{" "}
            {approveDialog
              ? new Date(approveDialog.date).toLocaleDateString()
              : ""}
            <br />
            Task: {approveDialog?.taskDescription}
            <br />
            Hours: {approveDialog?.hoursSpent} hrs
          </Typography>
          <TextField
            select
            fullWidth
            label="Decision"
            value={approvalForm.approvalStatus}
            onChange={(e) =>
              setApprovalForm((p) => ({ ...p, approvalStatus: e.target.value }))
            }
            margin="normal"
          >
            <MenuItem value="Approved">Approve</MenuItem>
            <MenuItem value="Rejected">Reject</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Comment (optional)"
            value={approvalForm.managerComment}
            onChange={(e) =>
              setApprovalForm((p) => ({ ...p, managerComment: e.target.value }))
            }
            multiline
            rows={3}
            margin="normal"
            placeholder="Add a note for the employee..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            color={
              approvalForm.approvalStatus === "Approved" ? "success" : "error"
            }
            onClick={handleApprove}
          >
            {approvalForm.approvalStatus === "Approved" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
