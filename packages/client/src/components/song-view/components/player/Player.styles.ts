import { styled } from "@mui/material";

export const AmpLabel = styled("div")(({ small }: { small?: boolean }) => ({
  color: "#242424",
  fontWeight: 600,
  justifySelf: "center",
  fontSize: small ? 11 : 14,
  display: "flex",
  alignItems: "center",
}));

export const AmpDisplay = styled("div")(({ $on }: { $on: boolean }) => ({
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  borderRadius: 6,
  border: "2px solid #141414",
  textShadow: "0 2px 3px #00000066",
  color: $on ? "#FFFFFFDD" : "#FFFFFF22",
  backgroundColor: "#242424",
  boxShadow: $on ? "#6b6d57 0px 0px 30px inset" : "unset",
}));
