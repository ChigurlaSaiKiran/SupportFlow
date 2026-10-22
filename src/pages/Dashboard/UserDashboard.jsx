import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Skeleton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { getAllTickets } from "../../api/ticketApi";
import { getTodayAttendance } from "../../api/attendanceApi";
import { getMyLeaveRequests } from "../../api/leaveRequestApi";
import { getMyWorkLogs } from "../../api/workLogApi";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { doCheckIn, doCheckOut } from "../../api/attendanceApi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0288d1", "#ed6c02", "#2e7d32", "#7b1fa2"];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const getStatusColor = (s) => {
  if (!s) return "default";
  const v = s.toLowerCase();
  if (v === "open" || v === "new") return "info";
  if (v === "in progress" || v === "pending") return "warning";
  if (v === "closed") return "success";
  return "default";
};

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
      transition: "all 0.2s ease",
      "&:hover": {
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transform: "translateY(-2px)",
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          {loading ? (
            <Skeleton variant="text" width={100} height={24} />
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={500}
              gutterBottom
            >
              {title}
            </Typography>
          )}
          {loading ? (
            <Skeleton variant="text" width={60} height={40} />
          ) : (
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: color,
            color: "white",
          }}
        >
          {Icon && <Icon sx={{ fontSize: 28 }} />}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const [myTickets, setMyTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });
  const [statusChart, setStatusChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(null);
  const [attendLoad, setAttendLoad] = useState(false);
  const [leaveCount, setLeaveCount] = useState(0);
  const [workLogCount, setWorkLogCount] = useState(0);
  const loadAttendance = async () => {
    try {
      const res = await getTodayAttendance(user?.id);
      setToday(res.data);
    } catch {}
  };

  const loadExtra = async () => {
    try {
      const [leaveRes, wlRes] = await Promise.all([
        getMyLeaveRequests(user?.id),
        getMyWorkLogs(user?.id),
      ]);
      const pendingLeaves = (leaveRes?.data || []).filter(
        (l) => l.status === "Pending"
      ).length;
      const pendingWL = (wlRes?.data || []).filter(
        (w) => w.approvalStatus === "Pending"
      ).length;
      setLeaveCount(pendingLeaves);
      setWorkLogCount(pendingWL);
    } catch {}
  };

  const load = async () => {
    try {
      setLoading(true);
      loadAttendance();
      loadExtra();
      const res = await getAllTickets();
      const all = res?.data || [];
      const mine = all.filter((t) => t?.createdBy?.id === user?.id);

      const open = mine.filter((t) =>
        ["open", "new"].includes(t?.status?.name?.toLowerCase())
      ).length;
      const inProgress = mine.filter((t) =>
        ["in progress", "pending"].includes(t?.status?.name?.toLowerCase())
      ).length;
      const closed = mine.filter(
        (t) => t?.status?.name?.toLowerCase() === "closed"
      ).length;

      setStats({ total: mine.length, open, inProgress, closed });
      setMyTickets([...mine].sort((a, b) => b.id - a.id));

      const sMap = {};
      mine.forEach((t) => {
        const n = t?.status?.name || "Unknown";
        sMap[n] = (sMap[n] || 0) + 1;
      });
      setStatusChart(
        Object.entries(sMap).map(([name, value]) => ({ name, value }))
      );
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setAttendLoad(true);
      await doCheckIn();
      const res = await getTodayAttendance(user?.id);
      setToday(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAttendLoad(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setAttendLoad(true);
      await doCheckOut();
      const res = await getTodayAttendance(user?.id);
      setToday(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAttendLoad(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={4}
      >
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <PersonIcon color="primary" />
            <Chip
              label="User"
              color="secondary"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {getGreeting()}, {user?.fullName || "User"}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your submitted support tickets below.
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={load}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/tickets/create")}
          >
            Raise Ticket
          </Button>
        </Box>
      </Box>

      {/* Attendance Card */}
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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <FingerprintIcon color="primary" />
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Today's Attendance
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date().toDateString()}
              </Typography>
            </Box>
            {today ? (
              <Chip
                label={today.status}
                size="small"
                color={
                  today.status === "Present"
                    ? "success"
                    : today.status === "Late"
                    ? "warning"
                    : "default"
                }
              />
            ) : (
              <Chip label="Not Checked In" size="small" />
            )}
          </Box>
          <Box display="flex" gap={3} alignItems="center">
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Check In
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {today?.checkInTime
                  ? new Date(today.checkInTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Check Out
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {today?.checkOutTime
                  ? new Date(today.checkOutTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Hours
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {today?.totalHours
                  ? `${Number(today.totalHours).toFixed(1)}h`
                  : "-"}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<LoginIcon />}
                onClick={handleCheckIn}
                disabled={!!today?.checkInTime || attendLoad}
              >
                Check In
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={handleCheckOut}
                disabled={
                  !today?.checkInTime || !!today?.checkOutTime || attendLoad
                }
              >
                Check Out
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: "My Total Tickets",
            value: stats.total,
            icon: ConfirmationNumberIcon,
            color: theme.palette.primary.main,
          },
          {
            title: "Open",
            value: stats.open,
            icon: HourglassEmptyIcon,
            color: "#0288d1",
          },
          {
            title: "In Progress",
            value: stats.inProgress,
            icon: TrendingUpIcon,
            color: "#ed6c02",
          },
          {
            title: "Closed",
            value: stats.closed,
            icon: CheckCircleIcon,
            color: "#2e7d32",
          },
        ].map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.title}>
            <StatCard {...s} loading={loading} />
          </Grid>
        ))}
      </Grid>
      {/* Pending Items Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Box
            onClick={() => navigate("/worklogs")}
            sx={{
              p: 2,
              borderRadius: 2,
              cursor: "pointer",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 2,
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <AssignmentIcon color="warning" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Pending Work Logs
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {workLogCount}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            onClick={() => navigate("/leaverequests")}
            sx={{
              p: 2,
              borderRadius: 2,
              cursor: "pointer",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 2,
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <EventNoteIcon color="info" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Pending Leave Requests
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {leaveCount}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Chart + Quick Help */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              height: 300,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              My Tickets by Status
            </Typography>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={240}
                sx={{ borderRadius: 1 }}
              />
            ) : statusChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusChart}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusChart.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box
                height={240}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <ConfirmationNumberIcon
                  sx={{ fontSize: 48, color: "grey.300", mb: 1 }}
                />
                <Typography color="text.secondary" mb={2}>
                  No tickets yet
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/tickets/create")}
                >
                  Raise Your First Ticket
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              height: 300,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Help
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Need assistance? Raise a support ticket and our team will get back
              to you.
            </Typography>
            {[
              {
                label: "🎫 Raise a new support ticket",
                path: "/tickets/create",
              },
              { label: "📋 View all my tickets", path: "/tickets" },
              { label: "📝 Submit work log", path: "/worklogs/add" },
              { label: "🗓️ Apply for leave", path: "/leaverequests/add" },
              { label: "📎 View my attachments", path: "/attachments" },
            ].map((item) => (
              <Box
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* My Tickets Table */}
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <ConfirmationNumberIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              My Tickets
            </Typography>
            <Chip label={stats.total} size="small" color="primary" />
          </Box>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/tickets")}
          >
            View all →
          </Typography>
        </Box>
        {loading ? (
          <Box p={3}>
            <Skeleton variant="rectangular" height={200} />
          </Box>
        ) : myTickets.length === 0 ? (
          <Box py={6} textAlign="center">
            <ConfirmationNumberIcon
              sx={{ fontSize: 56, color: "grey.300", mb: 1 }}
            />
            <Typography color="text.secondary" variant="body1" mb={2}>
              You haven't raised any tickets yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/tickets/create")}
            >
              Raise Your First Ticket
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myTickets.map((t) => (
                  <TableRow
                    key={t.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/tickets/details/${t.id}`)}
                  >
                    <TableCell>#{t.id}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t?.status?.name || "-"}
                        size="small"
                        color={getStatusColor(t?.status?.name)}
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>{t?.priority?.name || "-"}</TableCell>
                    <TableCell>
                      {t?.assignedTo?.fullName ? (
                        <Chip
                          label={t.assignedTo.fullName}
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip label="Pending" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tickets/details/${t.id}`);
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default UserDashboard;
