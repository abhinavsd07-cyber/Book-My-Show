import { Button } from "@mui/material";

export default function Seat({ seat, selected, onClick }) {
  let className = "seat-regular";
  if (seat.type === "vip") className = "seat-vip";
  if (seat.booked) className = "seat-booked";
  if (selected) className = "seat-selected";

  return (
    <Button
      sx={{
        minWidth: 40,
        minHeight: 40,
        m: 0.5,
        backgroundColor: className.includes("seat-selected") ? "#1976d2" : undefined
      }}
      disabled={seat.booked}
      onClick={onClick}
    >
      {seat.id}
    </Button>
  );
}
