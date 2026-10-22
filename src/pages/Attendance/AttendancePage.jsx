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
  CircularProgress,
  Divider,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  getAllAttendance,
  getMyAttendance,
  getTodayAttendance,
  doCheckIn,
  doCheckOut,
} from "../../api/attendanceApi";
import { useSnackbar } from "../../context/SnackbarContext";
import { getUser, getRole } from "../../utils/auth";

const getStatusColor = (s) => {
  if (s === "Present") return "success";
  if (s === "Late") return "warning";
  if (s === "Absent") return "error";
  if (s === "Leave") return "info";
  return "default";
};

const formatTime = (dt) => {
  if (!dt) return "-";
  return new Date(dt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (dt) => {
  if (!dt) return "-";
  return new Date(dt).toLocaleDateString();
};

export default function AttendancePage() {
  const { showSnackbar } = useSnackbar();
  const user = getUser();
  const role = getRole();

  const [today, setToday] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoad, setActionLoad] = useState(false);

  const loadToday = async () => {
    try {
      const res = await getTodayAttendance(user?.id);
      setToday(res.data);
    } catch {}
  };

  const loadRecords = async () => {
    try {
      setLoading(true);
      let res;
      if (role === "Admin") {
        res = await getAllAttendance();
      } else {
        res = await getMyAttendance(user?.id);
      }
      setRecords(res.data || []);
    } catch {
      showSnackbar("Failed to load attendance", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToday();
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoad(true);
      await doCheckIn();
      showSnackbar("Checked in successfully!", "success");
      loadToday();
      loadRecords();
    } catch (err) {
      showSnackbar(err.response?.data || "Already checked in today", "error");
    } finally {
      setActionLoad(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoad(true);
      await doCheckOut();
      showSnackbar("Checked out successfully!", "success");
      loadToday();
      loadRecords();
    } catch (err) {
      showSnackbar(err.response?.data || "Already checked out today", "error");
    } finally {
      setActionLoad(false);
    }
  };

  const canCheckIn = !today || !today.checkInTime;
  const canCheckOut = today?.checkInTime && !today?.checkOutTime;

  return (
    <Box>
      {/* Header */}
      <Typography variant="h5" fontWeight={700} mb={3}>
        {role === "Admin" ? "Attendance Report" : "My Attendance"}
      </Typography>

      {/* Today's Status Card — only for non-admin */}
      {role !== "Admin" && (
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
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AccessTimeIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Today — {new Date().toDateString()}
            </Typography>
          </Box>

          <Box display="flex" gap={4} mb={3} flexWrap="wrap">
            <Box>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Box mt={0.5}>
                {today ? (
                  <Chip
                    label={today.status}
                    color={getStatusColor(today.status)}
                    size="small"
                  />
                ) : (
                  <Chip label="Not Checked In" size="small" />
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Check In
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatTime(today?.checkInTime)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Check Out
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatTime(today?.checkOutTime)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total Hours
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {today?.totalHours
                  ? `${Number(today.totalHours).toFixed(1)} hrs`
                  : "-"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Check In / Out Buttons */}
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="success"
              startIcon={
                actionLoad ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <LoginIcon />
                )
              }
              onClick={handleCheckIn}
              disabled={!canCheckIn || actionLoad}
            >
              Check In
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={
                actionLoad ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <LogoutIcon />
                )
              }
              onClick={handleCheckOut}
              disabled={!canCheckOut || actionLoad}
            >
              Check Out
            </Button>
          </Box>

          {/* Helper text */}
          <Typography
            variant="caption"
            color="text.secondary"
            mt={1}
            display="block"
          >
            {canCheckIn
              ? "You have not checked in yet today."
              : canCheckOut
              ? "You are checked in. Don't forget to check out!"
              : "You have completed attendance for today."}
          </Typography>
        </Paper>
      )}

      {/* Attendance Records Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {role === "Admin"
              ? "All Attendance Records"
              : "My Attendance History"}
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                {role === "Admin" && (
                  <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                )}
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Check In</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Check Out</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No attendance records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((r) => (
                  <TableRow key={r.id} hover>
                    {role === "Admin" && (
                      <TableCell>{r.userFullName}</TableCell>
                    )}
                    <TableCell>{formatDate(r.date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={r.status}
                        size="small"
                        color={getStatusColor(r.status)}
                      />
                    </TableCell>
                    <TableCell>{formatTime(r.checkInTime)}</TableCell>
                    <TableCell>{formatTime(r.checkOutTime)}</TableCell>
                    <TableCell>
                      {r.totalHours
                        ? `${Number(r.totalHours).toFixed(1)} hrs`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
