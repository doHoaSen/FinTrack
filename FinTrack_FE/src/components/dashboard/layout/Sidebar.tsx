import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { logoutApi } from "../../../features/auth/api";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

export const SIDEBAR_WIDTH = 220;

const NAV_ITEMS = [
  { label: "대시보드", icon: <DashboardIcon fontSize="small" />, path: "/dashboard" },
  { label: "지출 내역", icon: <ReceiptLongIcon fontSize="small" />, path: "/expenses" },
  { label: "예산 관리", icon: <AccountBalanceWalletIcon fontSize="small" />, path: "/budget" },
  { label: "소비 분석", icon: <BarChartIcon fontSize="small" />, path: "/analytics" },
];

type Props = {
  open: boolean;
};

function Sidebar({ open }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logoutApi();
    logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: open ? SIDEBAR_WIDTH : 0,
        minWidth: open ? SIDEBAR_WIDTH : 0,
        overflow: "hidden",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: open ? "1px solid" : "none",
        borderColor: "divider",
        bgcolor: "background.paper",
        position: "sticky",
        top: 0,
        transition: "width 0.25s ease, min-width 0.25s ease",
        flexShrink: 0,
      }}
    >
      {/* 내비게이션 — 너비가 충분할 때만 표시 */}
      <Box sx={{ width: SIDEBAR_WIDTH, display: "flex", flexDirection: "column", flex: 1 }}>
        <Divider />

        <List sx={{ px: 1.5, pt: 1.5, flex: 1 }}>
          {NAV_ITEMS.map(({ label, icon, path }) => {
            const active = location.pathname === path;
            return (
              <ListItemButton
                key={path}
                onClick={() => navigate(path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: active ? "rgba(25, 118, 210, 0.08)" : "transparent",
                  color: active ? "primary.main" : "text.secondary",
                  "& .MuiListItemIcon-root": {
                    color: active ? "primary.main" : "text.secondary",
                  },
                  "&:hover": {
                    bgcolor: active ? "rgba(25, 118, 210, 0.12)" : "action.hover",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                <ListItemText
                  primary={label}
                  slotProps={{
                    primary: { fontSize: 14, fontWeight: active ? 600 : 400 },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Divider />
        <List sx={{ px: 1.5, py: 1 }}>
          <ListItemButton
            onClick={() => navigate("/settings/categories")}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor: location.pathname.startsWith("/settings") ? "rgba(25, 118, 210, 0.08)" : "transparent",
              color: location.pathname.startsWith("/settings") ? "primary.main" : "text.secondary",
              "& .MuiListItemIcon-root": {
                color: location.pathname.startsWith("/settings") ? "primary.main" : "text.secondary",
              },
              "&:hover": {
                bgcolor: location.pathname.startsWith("/settings") ? "rgba(25, 118, 210, 0.12)" : "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="설정"
              slotProps={{ primary: { fontSize: 14, fontWeight: location.pathname.startsWith("/settings") ? 600 : 400 } }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 2, color: "text.secondary" }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="로그아웃" slotProps={{ primary: { fontSize: 14 } }} />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
}

export default Sidebar;
