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
  LinearProgress,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useNavigate } from "react-router-dom";
import { getAllTickets } from "../../api/ticketApi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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

const getPriorityColor = (p) => {
  if (!p) return "#9e9e9e";
  const v = p.toLowerCase();
  if (v === "high" || v === "critical") return "#c62828";
  if (v === "medium") return "#ed6c02";
  return "#2e7d32";
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
            <Skeleton variant="text" width={110} height={24} />
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

const AgentDashboard = () => {
  const navigate = useNavigate();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const [myAssigned, setMyAssigned] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });
  const [statusChart, setStatusChart] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getAllTickets();
      const all = res?.data || [];
      const myId = user?.id;
      const assigned = all.filter((t) => t?.assignedTo?.id === myId);

      const open = assigned.filter((t) =>
        ["open", "new"].includes(t?.status?.name?.toLowerCase())
      ).length;
      const inProgress = assigned.filter((t) =>
        ["in progress", "pending"].includes(t?.status?.name?.toLowerCase())
      ).length;
      const closed = assigned.filter(
        (t) => t?.status?.name?.toLowerCase() === "closed"
      ).length;

      setStats({ total: assigned.length, open, inProgress, closed });
      setMyAssigned([...assigned].sort((a, b) => b.id - a.id));

      const sMap = {};
      assigned.forEach((t) => {
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

  useEffect(() => {
    load();
  }, []);

  const resolutionRate =
    stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0;

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
            <SupportAgentIcon color="primary" />
            <Chip
              label="Agent"
              color="info"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {getGreeting()}, {user?.fullName || "Agent"}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here are your assigned tickets and performance overview.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={load}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: "My Total Tickets",
            value: stats.total,
            icon: AssignmentIndIcon,
            color: "#1565c0",
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
            title: "Resolved",
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

      {/* Resolution Rate + Chart + High Priority */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
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
              Resolution Rate
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : (
              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2" color="text.secondary">
                    Tickets Closed
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color="success.main"
                  >
                    {resolutionRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={resolutionRate}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#2e7d32",
                      borderRadius: 5,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  mt={1}
                  display="block"
                >
                  {stats.closed} of {stats.total} tickets resolved
                </Typography>
                <Box mt={3}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Pending by Priority
                  </Typography>
                  {["High", "Medium", "Low"].map((p) => {
                    const cnt = myAssigned.filter(
                      (t) =>
                        t?.priority?.name === p &&
                        t?.status?.name?.toLowerCase() !== "closed"
                    ).length;
                    return cnt > 0 ? (
                      <Box
                        key={p}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={0.5}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: getPriorityColor(p),
                            }}
                          />
                          <Typography variant="body2">{p}</Typography>
                        </Box>
                        <Chip
                          label={cnt}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            backgroundColor: getPriorityColor(p),
                            color: "white",
                          }}
                        />
                      </Box>
                    ) : null;
                  })}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
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
                    outerRadius={90}
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
                  sx={{ fontSize: 40, color: "grey.300", mb: 1 }}
                />
                <Typography color="text.secondary" variant="body2">
                  No tickets assigned yet
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              height: 300,
              overflow: "auto",
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              🔴 High Priority
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={240} />
            ) : (
              (() => {
                const high = myAssigned.filter(
                  (t) =>
                    ["high", "critical"].includes(
                      t?.priority?.name?.toLowerCase()
                    ) && t?.status?.name?.toLowerCase() !== "closed"
                );
                return high.length === 0 ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height={200}
                  >
                    <CheckCircleIcon
                      sx={{ fontSize: 36, color: "#2e7d32", mb: 1 }}
                    />
                    <Typography color="text.secondary" variant="body2">
                      No high priority pending!
                    </Typography>
                  </Box>
                ) : (
                  high.map((t) => (
                    <Box
                      key={t.id}
                      onClick={() => navigate(`/tickets/details/${t.id}`)}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 1,
                        border: "1px solid #ffcdd2",
                        backgroundColor: "#fff8f8",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#ffebee" },
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        #{t.id} — {t.title}
                      </Typography>
                      <Chip
                        label={t?.status?.name}
                        size="small"
                        color={getStatusColor(t?.status?.name)}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  ))
                );
              })()
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* My Assigned Tickets Table */}
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
            <AssignmentIndIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              My Assigned Tickets
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
        ) : myAssigned.length === 0 ? (
          <Box py={5} textAlign="center">
            <AssignmentIndIcon
              sx={{ fontSize: 48, color: "grey.300", mb: 1 }}
            />
            <Typography color="text.secondary">
              No tickets assigned to you yet
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
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myAssigned.map((t) => (
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
                          maxWidth: 180,
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
                    <TableCell>
                      <Chip
                        label={t?.priority?.name || "-"}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(t?.priority?.name),
                          color: "white",
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>{t?.category?.name || "-"}</TableCell>
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

export default AgentDashboard;
