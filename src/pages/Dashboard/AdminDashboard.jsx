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
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";
import { getAllTickets } from "../../api/ticketApi";
import { getAllUsers } from "../../api/userApi";
import { getAllAttendance } from "../../api/attendanceApi";
import { getAllLeaveRequests } from "../../api/leaveRequestApi";
import { getAllWorkLogs } from "../../api/workLogApi";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const COLORS = ["#0288d1", "#ed6c02", "#2e7d32", "#7b1fa2", "#c62828"];

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

const StatCard = ({ title, value, icon: Icon, color, loading }) => {
  const theme = useTheme();
  return (
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
              <Skeleton variant="text" width={120} height={24} />
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
              backgroundColor: color || theme.palette.primary.main,
              color: "white",
            }}
          >
            {Icon && <Icon sx={{ fontSize: 28 }} />}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const TicketTable = ({ tickets, emptyMessage }) => {
  const navigate = useNavigate();
  return tickets.length === 0 ? (
    <Box py={4} textAlign="center">
      <ConfirmationNumberIcon sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />
      <Typography color="text.secondary" variant="body2">
        {emptyMessage}
      </Typography>
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
          {tickets.map((t) => (
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
                    maxWidth: 160,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.title || "-"}
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
                {t?.assignedTo?.fullName || (
                  <Chip label="Unassigned" size="small" />
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
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
    users: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);
  const [priorityChartData, setPriorityChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [presentToday, setPresentToday] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [pendingWorkLogs, setPendingWorkLogs] = useState(0);
  const load = async () => {
    try {
      setLoading(true);
      const [tRes, uRes, aRes, lRes, wRes] = await Promise.all([
        getAllTickets(),
        getAllUsers(),
        getAllAttendance(),
        getAllLeaveRequests(),
        getAllWorkLogs(),
      ]);

      // Attendance — present today
      const todayStr = new Date().toDateString();
      const presentCount = (aRes?.data || []).filter(
        (a) => new Date(a.date).toDateString() === todayStr
      ).length;
      setPresentToday(presentCount);

      // Pending leaves
      const pendingL = (lRes?.data || []).filter(
        (l) => l.status === "Pending"
      ).length;
      setPendingLeaves(pendingL);

      // Pending work logs
      const pendingW = (wRes?.data || []).filter(
        (w) => w.approvalStatus === "Pending"
      ).length;
      setPendingWorkLogs(pendingW);
      const tickets = tRes?.data || [];
      const users = uRes?.data || [];

      const open = tickets.filter((t) =>
        ["open", "new"].includes(t?.status?.name?.toLowerCase())
      ).length;
      const inProgress = tickets.filter((t) =>
        ["in progress", "pending", "inprogress"].includes(
          t?.status?.name?.toLowerCase()
        )
      ).length;
      const closed = tickets.filter(
        (t) => t?.status?.name?.toLowerCase() === "closed"
      ).length;

      setStats({
        total: tickets.length,
        open,
        inProgress,
        closed,
        users: users.length,
      });
      setRecentTickets([...tickets].sort((a, b) => b.id - a.id).slice(0, 6));

      const sMap = {};
      tickets.forEach((t) => {
        const n = t?.status?.name || "Unknown";
        sMap[n] = (sMap[n] || 0) + 1;
      });
      setStatusChartData(
        Object.entries(sMap).map(([name, value]) => ({ name, value }))
      );

      const pMap = {};
      tickets.forEach((t) => {
        const n = t?.priority?.name || "Unset";
        pMap[n] = (pMap[n] || 0) + 1;
      });
      setPriorityChartData(
        Object.entries(pMap).map(([name, count]) => ({ name, count }))
      );

      const cMap = {};
      tickets.forEach((t) => {
        const n = t?.category?.name || "Uncategorized";
        cMap[n] = (cMap[n] || 0) + 1;
      });
      setCategoryData(
        Object.entries(cMap).map(([name, count]) => ({ name, count }))
      );
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
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
            <AdminPanelSettingsIcon color="primary" />
            <Chip
              label="Admin"
              color="primary"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {getGreeting()}, {user?.fullName || "Admin"}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Full system overview — all tickets, users, and performance metrics.
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
            New Ticket
          </Button>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: "Total Tickets",
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
          {
            title: "Total Users",
            value: stats.users,
            icon: PeopleIcon,
            color: "#7b1fa2",
          },
        ].map((s) => (
          <Grid item xs={12} sm={6} md={2.4} key={s.title}>
            <StatCard {...s} loading={loading} />
          </Grid>
        ))}

        {/* HR Stats Row */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {[
            {
              title: "Present Today",
              value: presentToday,
              icon: FingerprintIcon,
              color: "#2e7d32",
              path: "/attendance",
            },
            {
              title: "Pending Leave Requests",
              value: pendingLeaves,
              icon: EventNoteIcon,
              color: "#ed6c02",
              path: "/leaverequests",
            },
            {
              title: "Pending Work Logs",
              value: pendingWorkLogs,
              icon: AssignmentIcon,
              color: "#7b1fa2",
              path: "/worklogs",
            },
          ].map((s) => (
            <Grid item xs={12} sm={4} key={s.title}>
              <Card
                elevation={0}
                onClick={() => navigate(s.path)}
                sx={{
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      {loading ? (
                        <Skeleton variant="text" width={120} height={20} />
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          {s.title}
                        </Typography>
                      )}
                      {loading ? (
                        <Skeleton variant="text" width={60} height={36} />
                      ) : (
                        <Typography variant="h4" fontWeight={700}>
                          {s.value}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: s.color,
                        color: "white",
                      }}
                    >
                      <s.icon sx={{ fontSize: 24 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              height: 320,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Tickets by Status
            </Typography>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={260}
                sx={{ borderRadius: 1 }}
              />
            ) : statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusChartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box
                height={260}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography color="text.secondary">No data</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              height: 320,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Tickets by Priority
            </Typography>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={260}
                sx={{ borderRadius: 1 }}
              />
            ) : priorityChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={priorityChartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box
                height={260}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography color="text.secondary">No data</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Tickets Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          mb: 3,
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
          <Typography variant="h6" fontWeight={600}>
            Recent Tickets (All)
          </Typography>
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
            <Skeleton
              variant="rectangular"
              height={180}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        ) : (
          <TicketTable tickets={recentTickets} emptyMessage="No tickets yet" />
        )}
      </Paper>

      {/* Category chips */}
      {!loading && categoryData.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Tickets by Category
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {categoryData.map((item, i) => (
              <Chip
                key={item.name}
                label={`${item.name}: ${item.count}`}
                size="medium"
                sx={{
                  backgroundColor: COLORS[i % COLORS.length],
                  color: "white",
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AdminDashboard;
