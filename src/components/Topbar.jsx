// import { AppBar, Toolbar, Typography, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// export default function Topbar() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <AppBar
//       position="fixed"
//       sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
//     >
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//         <Typography variant="h6">SupportFlow</Typography>

//         <Button color="inherit" onClick={handleLogout}>
//           Logout
//         </Button>
//       </Toolbar>
//     </AppBar>
//   );
// }
