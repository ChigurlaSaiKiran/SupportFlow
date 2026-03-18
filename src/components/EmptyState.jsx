import React from "react";
import { Box, Typography, Button } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

const EmptyState = ({
  icon: Icon = InboxIcon,
  message,
  subMessage,
  actionLabel,
  onAction,
}) => (
  <Box py={8} textAlign="center" px={2}>
    <Icon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
    <Typography variant="h6" color="text.secondary" gutterBottom>
      {message}
    </Typography>
    {subMessage && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {subMessage}
      </Typography>
    )}
    {actionLabel && onAction && (
      <Button variant="contained" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;
