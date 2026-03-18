import React, { useState } from "react";
import { IconButton, Badge, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const notifications = [
    "New Order Received",
    "Product Stock Low",
    "New User Registered",
  ];

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {notifications.map((note, index) => (
          <MenuItem key={index}>{note}</MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationBell;
