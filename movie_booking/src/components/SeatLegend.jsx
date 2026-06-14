import { Box, Typography } from "@mui/material";

export default function SeatLegend() {
  return (
    <Box sx={{ display: "flex", mt: 3, gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box sx={{ width: 20, height: 20, backgroundColor: "#4caf50" }} />
        <Typography>Regular</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box sx={{ width: 20, height: 20, backgroundColor: "#ff9800" }} />
        <Typography>VIP</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box sx={{ width: 20, height: 20, backgroundColor: "grey" }} />
        <Typography>Booked</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box sx={{ width: 20, height: 20, backgroundColor: "#1976d2" }} />
        <Typography>Selected</Typography>
      </Box>
    </Box>
  );
}
