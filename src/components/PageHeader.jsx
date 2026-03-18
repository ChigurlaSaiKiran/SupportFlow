import React from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PageHeader = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  onBack,
  showBack = false,
}) => (
  <Box
    display="flex"
    flexWrap="wrap"
    justifyContent="space-between"
    alignItems="center"
    gap={2}
    mb={3}
  >
    <Box>
      {showBack && onBack && (
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 0.5 }}>
          Back
        </Button>
      )}
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {actionLabel && onAction && (
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default PageHeader;
