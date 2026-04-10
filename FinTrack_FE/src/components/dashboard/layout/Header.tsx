import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { Box, IconButton, Avatar, Tooltip, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

type Props = {
  onToggleSidebar: () => void;
};

function Header({ onToggleSidebar }: Props) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <Box
      sx={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        position: "sticky",
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* 좌측: 햄버거 + 로고 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton size="small" onClick={onToggleSidebar} aria-label="메뉴 열기/닫기">
          <MenuIcon fontSize="small" />
        </IconButton>

        <Box
          sx={{ display: "flex", alignItems: "baseline", gap: 0.75, cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: "primary.main", letterSpacing: -0.5, lineHeight: 1 }}
          >
            FinTrack
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.disabled", letterSpacing: 1.2, fontSize: 9, fontWeight: 600 }}
          >
            WEALTH CURATOR
          </Typography>
        </Box>
      </Box>

      {/* 우측: 알림 + 프로필 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Tooltip title="알림">
          <IconButton size="small">
            <NotificationsNoneIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={user?.name ?? "프로필"}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: 13,
              fontWeight: 600,
              bgcolor: "primary.main",
              cursor: "pointer",
            }}
            onClick={() => navigate("/settings")}
          >
            {initials}
          </Avatar>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default Header;
