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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { useNavigate } from "react-router-dom";
import {
  getAllLeaveRequests,
  getMyLeaveRequests,
  approveLeaveRequest,
  deleteLeaveRequest,
} from "../../api/leaveRequestApi";
import { useSnackbar } from "../../context/SnackbarContext";
import { getUser, getRole } from "../../utils/auth";

const getStatusColor = (s) => {
  if (s === "Approved") return "success";
  if (s === "Rejected") return "error";
  return "warning";
};

const formatDate = (dt) => (dt ? new Date(dt).toLocaleDateString() : "-");

export default function LeaveRequestList() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const user = getUser();
  const role = getRole();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [approveDialog, setApproveDialog] = useState(null);
  const [approvalForm, setApprovalForm] = useState({
    status: "Approved",
    managerComment: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      let res;
      if (role === "Admin") {
        res = await getAllLeaveRequests();
      } else {
        if (!user?.id) return;
        res = await getMyLeaveRequests(user?.id);
      }
      setRequests(res?.data || []);
    } catch {
      showSnackbar("Failed to load leave requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    try {
      await deleteLeaveRequest(deleteId);
      showSnackbar("Leave request deleted", "success");
      setDeleteId(null);
      load();
    } catch (err) {
      showSnackbar(err.response?.data || "Failed to delete", "error");
    }
  };

  const handleApprove = async () => {
    try {
      await approveLeaveRequest(approveDialog.id, approvalForm);
      showSnackbar(
        `Leave request ${approvalForm.status.toLowerCase()}`,
        "success"
      );
      setApproveDialog(null);
      load();
    } catch {
      showSnackbar("Failed to update", "error");
    }
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
        <Box display="flex" alignItems="center" gap={1}>
          <EventNoteIcon color="primary" />
          <Typography variant="h5" fontWeight={700}>
            {role === "Admin" ? "All Leave Requests" : "My Leave Requests"}
          </Typography>
        </Box>
        {(role === "User" || role === "Agent") && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/leaverequests/add")}
          >
            Apply Leave
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
                {role === "Admin" && (
                  <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                )}
                <TableCell sx={{ fontWeight: 600 }}>Leave Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>From</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>To</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Days</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Manager Note</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No leave requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((r) => (
                  <TableRow key={r.id} hover>
                    {role === "Admin" && (
                      <TableCell>{r.userFullName}</TableCell>
                    )}
                    <TableCell>
                      <Chip
                        label={r.leaveType}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{formatDate(r.fromDate)}</TableCell>
                    <TableCell>{formatDate(r.toDate)}</TableCell>
                    <TableCell>
                      {r.totalDays} day{r.totalDays > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 150,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.reason}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={r.status}
                        size="small"
                        color={getStatusColor(r.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {r.managerComment || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {/* Admin approve/reject */}
                      {role === "Admin" && r.status === "Pending" && (
                        <>
                          <IconButton
                            size="small"
                            color="success"
                            title="Approve"
                            onClick={() => {
                              setApproveDialog(r);
                              setApprovalForm({
                                status: "Approved",
                                managerComment: "",
                              });
                            }}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            title="Reject"
                            onClick={() => {
                              setApproveDialog(r);
                              setApprovalForm({
                                status: "Rejected",
                                managerComment: "",
                              });
                            }}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                      {/* User delete pending */}
                      {(role === "User" || role === "Agent") &&
                        r.status === "Pending" && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteId(r.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Cancel Leave Request?</DialogTitle>
        <DialogContent>
          <Typography>This will delete your pending leave request.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>No</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Yes, Cancel It
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve/Reject Dialog */}
      <Dialog
        open={Boolean(approveDialog)}
        onClose={() => setApproveDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {approvalForm.status === "Approved"
            ? "Approve Leave Request"
            : "Reject Leave Request"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Employee : {approveDialog?.userFullName}
            <br />
            Type : {approveDialog?.leaveType} Leave
            <br />
            From : {formatDate(approveDialog?.fromDate)}
            <br />
            To : {formatDate(approveDialog?.toDate)}
            <br />
            Days : {approveDialog?.totalDays}
            <br />
            Reason : {approveDialog?.reason}
          </Typography>
          <TextField
            select
            fullWidth
            label="Decision"
            value={approvalForm.status}
            onChange={(e) =>
              setApprovalForm((p) => ({ ...p, status: e.target.value }))
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
            color={approvalForm.status === "Approved" ? "success" : "error"}
            onClick={handleApprove}
          >
            {approvalForm.status === "Approved" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
