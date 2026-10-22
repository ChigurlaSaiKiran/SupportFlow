import React from "react";
import { getRole } from "../../utils/auth";
import AdminDashboard from "./AdminDashboard";
import AgentDashboard from "./AgentDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const role = getRole();
  if (role === "Admin") return <AdminDashboard />;
  if (role === "Agent") return <AgentDashboard />;
  return <UserDashboard />;
};

export default Dashboard;
// import React, { useEffect, useState } from "react";
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   Skeleton,
//   Chip,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Button,
//   useTheme,
// } from "@mui/material";
// import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
// import PeopleIcon from "@mui/icons-material/People";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import AddIcon from "@mui/icons-material/Add";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import PersonIcon from "@mui/icons-material/Person";
// import { useNavigate } from "react-router-dom";
// import { getAllTickets } from "../../api/ticketApi";
// import { getAllusers } from "../../api/userApi";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
// } from "recharts";

// const COLORS = ["#0288d1", "#ed6c02", "#2e7d32", "#7b1fa2", "#c62828"];

// const StatCard = ({ title, value, icon: Icon, color, loading }) => {
//   const theme = useTheme();
//   return (
//     <Card
//       elevation={0}
//       sx={{
//         height: "100%",
//         borderRadius: 2,
//         border: "1px solid",
//         borderColor: "divider",
//         transition: "all 0.2s ease",
//         "&:hover": {
//           boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//           transform: "translateY(-2px)",
//         },
//       }}
//     >
//       <CardContent sx={{ p: 3 }}>
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="flex-start"
//         >
//           <Box>
//             {loading ? (
//               <Skeleton variant="text" width={120} height={24} />
//             ) : (
//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 fontWeight={500}
//                 gutterBottom
//               >
//                 {title}
//               </Typography>
//             )}
//             {loading ? (
//               <Skeleton variant="text" width={60} height={40} />
//             ) : (
//               <Typography variant="h4" fontWeight={700}>
//                 {value}
//               </Typography>
//             )}
//           </Box>
//           <Box
//             sx={{
//               p: 1.5,
//               borderRadius: 2,
//               backgroundColor: color || theme.palette.primary.main,
//               color: "white",
//             }}
//           >
//             {Icon && <Icon sx={{ fontSize: 28 }} />}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// const getGreeting = () => {
//   const hour = new Date().getHours();
//   if (hour < 12) return "Good morning";
//   if (hour < 17) return "Good afternoon";
//   return "Good evening";
// };

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();

//   const [stats, setStats] = useState({
//     totalTickets: 0,
//     openTickets: 0,
//     inProgressTickets: 0,
//     closedTickets: 0,
//     totalUsers: 0,
//   });
//   const [recentTickets, setRecentTickets] = useState([]);
//   const [myTickets, setMyTickets] = useState([]);
//   const [statusChartData, setStatusChartData] = useState([]);
//   const [priorityChartData, setPriorityChartData] = useState([]);
//   const [categoryChartData, setCategoryChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const user = (() => {
//     try {
//       return JSON.parse(localStorage.getItem("user") || "null");
//     } catch {
//       return null;
//     }
//   })();

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const [ticketsRes, usersRes] = await Promise.all([
//         getAllTickets(),
//         getAllusers(),
//       ]);

//       const tickets = ticketsRes?.data || [];
//       const users = usersRes?.data || [];

//       const open = tickets.filter(
//         (t) =>
//           t?.status?.name?.toLowerCase() === "open" ||
//           t?.status?.name?.toLowerCase() === "new"
//       ).length;
//       const inProgress = tickets.filter(
//         (t) =>
//           t?.status?.name?.toLowerCase() === "in progress" ||
//           t?.status?.name?.toLowerCase() === "inprogress" ||
//           t?.status?.name?.toLowerCase() === "pending"
//       ).length;
//       const closed = tickets.filter(
//         (t) => t?.status?.name?.toLowerCase() === "closed"
//       ).length;

//       setStats({
//         totalTickets: tickets.length,
//         openTickets: open,
//         inProgressTickets: inProgress,
//         closedTickets: closed,
//         totalUsers: users.length,
//       });

//       const sorted = [...tickets].sort((a, b) => (b.id || 0) - (a.id || 0));
//       setRecentTickets(sorted.slice(0, 5));

//       const currentUserId = user?.id;
//       const assigned = tickets.filter(
//         (t) => t?.assignedTo?.id === currentUserId
//       );
//       setMyTickets(assigned.slice(0, 5));

//       const statusMap = {};
//       tickets.forEach((t) => {
//         const name = t?.status?.name || "Unknown";
//         statusMap[name] = (statusMap[name] || 0) + 1;
//       });
//       setStatusChartData(
//         Object.entries(statusMap).map(([name, count]) => ({
//           name,
//           value: count,
//         }))
//       );

//       const priorityMap = {};
//       tickets.forEach((t) => {
//         const name = t?.priority?.name || "Unset";
//         priorityMap[name] = (priorityMap[name] || 0) + 1;
//       });
//       setPriorityChartData(
//         Object.entries(priorityMap).map(([name, count]) => ({ name, count }))
//       );

//       const categoryMap = {};
//       tickets.forEach((t) => {
//         const name = t?.category?.name || "Uncategorized";
//         categoryMap[name] = (categoryMap[name] || 0) + 1;
//       });
//       setCategoryChartData(
//         Object.entries(categoryMap).map(([name, count]) => ({ name, count }))
//       );
//     } catch (err) {
//       setError("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const getStatusColor = (statusName) => {
//     if (!statusName) return "default";
//     const s = String(statusName).toLowerCase();
//     if (s === "open" || s === "new") return "info";
//     if (s === "in progress" || s === "inprogress" || s === "pending")
//       return "warning";
//     if (s === "closed") return "success";
//     return "default";
//   };

//   const TicketTable = ({ tickets, emptyMessage }) => (
//     <>
//       {tickets.length === 0 ? (
//         <Box py={4} textAlign="center">
//           <ConfirmationNumberIcon
//             sx={{ fontSize: 40, color: "grey.400", mb: 1 }}
//           />
//           <Typography color="text.secondary" variant="body2">
//             {emptyMessage}
//           </Typography>
//         </Box>
//       ) : (
//         <TableContainer>
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "grey.50" }}>
//                 <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
//                 <TableCell align="right" sx={{ fontWeight: 600 }}>
//                   Action
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tickets.map((ticket) => (
//                 <TableRow
//                   key={ticket.id}
//                   hover
//                   sx={{
//                     cursor: "pointer",
//                     "&:hover": { backgroundColor: "action.hover" },
//                   }}
//                   onClick={() => navigate(`/tickets/details/${ticket.id}`)}
//                 >
//                   <TableCell>#{ticket.id}</TableCell>
//                   <TableCell>
//                     <Typography
//                       variant="body2"
//                       fontWeight={500}
//                       sx={{
//                         maxWidth: 180,
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {ticket.title || "-"}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={ticket?.status?.name || "-"}
//                       size="small"
//                       color={getStatusColor(ticket?.status?.name)}
//                       sx={{ fontWeight: 500 }}
//                     />
//                   </TableCell>
//                   <TableCell>{ticket?.priority?.name || "-"}</TableCell>
//                   <TableCell align="right">
//                     <IconButton
//                       size="small"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate(`/tickets/details/${ticket.id}`);
//                       }}
//                       title="View"
//                     >
//                       <VisibilityIcon fontSize="small" />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </>
//   );

//   return (
//     <Box>
//       {/* Header with greeting and actions */}
//       <Box
//         display="flex"
//         flexWrap="wrap"
//         justifyContent="space-between"
//         alignItems="center"
//         gap={2}
//         mb={4}
//       >
//         <Box>
//           <Typography variant="h4" fontWeight={700} gutterBottom>
//             {getGreeting()}, {user?.fullName || "User"}!
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             Here's an overview of your SupportFlow.
//           </Typography>
//         </Box>
//         <Box display="flex" gap={1}>
//           <Button
//             variant="outlined"
//             startIcon={<RefreshIcon />}
//             onClick={fetchDashboardData}
//             disabled={loading}
//           >
//             Refresh
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => navigate("/tickets/create")}
//           >
//             Create Ticket
//           </Button>
//         </Box>
//       </Box>

//       {error && (
//         <Typography color="error" sx={{ mb: 2 }}>
//           {error}
//         </Typography>
//       )}

//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <StatCard
//             title="Total Tickets"
//             value={stats.totalTickets}
//             icon={ConfirmationNumberIcon}
//             color={theme.palette.primary.main}
//             loading={loading}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <StatCard
//             title="Open"
//             value={stats.openTickets}
//             icon={HourglassEmptyIcon}
//             color="#0288d1"
//             loading={loading}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <StatCard
//             title="In Progress"
//             value={stats.inProgressTickets}
//             icon={TrendingUpIcon}
//             color="#ed6c02"
//             loading={loading}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <StatCard
//             title="Closed"
//             value={stats.closedTickets}
//             icon={CheckCircleIcon}
//             color="#2e7d32"
//             loading={loading}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <StatCard
//             title="Total Users"
//             value={stats.totalUsers}
//             icon={PeopleIcon}
//             color="#7b1fa2"
//             loading={loading}
//           />
//         </Grid>
//       </Grid>

//       {/* Charts Row */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} md={6}>
//           <Paper
//             elevation={0}
//             sx={{
//               p: 2,
//               borderRadius: 2,
//               border: "1px solid",
//               borderColor: "divider",
//               height: 320,
//             }}
//           >
//             <Typography variant="h6" fontWeight={600} gutterBottom>
//               Tickets by Status
//             </Typography>
//             {loading ? (
//               <Skeleton
//                 variant="rectangular"
//                 height={260}
//                 sx={{ borderRadius: 1 }}
//               />
//             ) : statusChartData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={260}>
//                 <PieChart>
//                   <Pie
//                     data={statusChartData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={100}
//                     paddingAngle={2}
//                     dataKey="value"
//                     label={({ name, value }) => `${name}: ${value}`}
//                   >
//                     {statusChartData.map((_, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             ) : (
//               <Box
//                 height={260}
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="center"
//               >
//                 <Typography color="text.secondary">No data yet</Typography>
//               </Box>
//             )}
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Paper
//             elevation={0}
//             sx={{
//               p: 2,
//               borderRadius: 2,
//               border: "1px solid",
//               borderColor: "divider",
//               height: 320,
//             }}
//           >
//             <Typography variant="h6" fontWeight={600} gutterBottom>
//               Tickets by Priority
//             </Typography>
//             {loading ? (
//               <Skeleton
//                 variant="rectangular"
//                 height={260}
//                 sx={{ borderRadius: 1 }}
//               />
//             ) : priorityChartData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={260}>
//                 <BarChart
//                   data={priorityChartData}
//                   margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
//                 >
//                   <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip />
//                   <Bar
//                     dataKey="count"
//                     fill={theme.palette.primary.main}
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <Box
//                 height={260}
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="center"
//               >
//                 <Typography color="text.secondary">No data yet</Typography>
//               </Box>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Tables Row */}
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Paper
//             elevation={0}
//             sx={{
//               borderRadius: 2,
//               border: "1px solid",
//               borderColor: "divider",
//               overflow: "hidden",
//             }}
//           >
//             <Box
//               sx={{
//                 px: 3,
//                 py: 2,
//                 borderBottom: "1px solid",
//                 borderColor: "divider",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Typography variant="h6" fontWeight={600}>
//                 Recent Tickets
//               </Typography>
//               <Typography
//                 variant="body2"
//                 color="primary"
//                 sx={{ cursor: "pointer" }}
//                 onClick={() => navigate("/tickets")}
//               >
//                 View all
//               </Typography>
//             </Box>
//             {loading ? (
//               <Box p={3}>
//                 <Skeleton
//                   variant="rectangular"
//                   height={180}
//                   sx={{ borderRadius: 1 }}
//                 />
//               </Box>
//             ) : (
//               <TicketTable
//                 tickets={recentTickets}
//                 emptyMessage="No tickets yet"
//               />
//             )}
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Paper
//             elevation={0}
//             sx={{
//               borderRadius: 2,
//               border: "1px solid",
//               borderColor: "divider",
//               overflow: "hidden",
//             }}
//           >
//             <Box
//               sx={{
//                 px: 3,
//                 py: 2,
//                 borderBottom: "1px solid",
//                 borderColor: "divider",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Box display="flex" alignItems="center" gap={1}>
//                 <PersonIcon color="primary" />
//                 <Typography variant="h6" fontWeight={600}>
//                   My Assigned Tickets
//                 </Typography>
//               </Box>
//               <Typography
//                 variant="body2"
//                 color="primary"
//                 sx={{ cursor: "pointer" }}
//                 onClick={() => navigate("/tickets")}
//               >
//                 View all
//               </Typography>
//             </Box>
//             {loading ? (
//               <Box p={3}>
//                 <Skeleton
//                   variant="rectangular"
//                   height={180}
//                   sx={{ borderRadius: 1 }}
//                 />
//               </Box>
//             ) : (
//               <TicketTable
//                 tickets={myTickets}
//                 emptyMessage="No tickets assigned to you"
//               />
//             )}
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Tickets by Category - Compact */}
//       {!loading && categoryChartData.length > 0 && (
//         <Paper
//           elevation={0}
//           sx={{
//             mt: 3,
//             p: 2,
//             borderRadius: 2,
//             border: "1px solid",
//             borderColor: "divider",
//           }}
//         >
//           <Typography variant="h6" fontWeight={600} gutterBottom>
//             Tickets by Category
//           </Typography>
//           <Box display="flex" flexWrap="wrap" gap={1}>
//             {categoryChartData.map((item, idx) => (
//               <Chip
//                 key={item.name}
//                 label={`${item.name}: ${item.count}`}
//                 size="medium"
//                 sx={{
//                   backgroundColor: COLORS[idx % COLORS.length],
//                   color: "white",
//                   fontWeight: 500,
//                 }}
//               />
//             ))}
//           </Box>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default Dashboard;
