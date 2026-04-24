import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { withdrawApi, logoutApi } from "../features/auth/api";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logoutApi();
    logout();
    navigate("/login");
  };

  const handleWithdraw = async () => {
    if (!confirm("정말 탈퇴하시겠습니까?")) return;
    await withdrawApi();
    await logoutApi();
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box sx={{ display: "flex", minHeight: "100%", p: 3, gap: 3 }}>
      {/* 슬림 사이드 네비 */}
      <Box sx={{ width: 160, flexShrink: 0 }}>
        <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ px: 1.5, mb: 0.5, display: "block" }}>
          설정
        </Typography>
        <List dense disablePadding>
          <ListItemButton
            selected={isActive("/settings/categories")}
            onClick={() => navigate("/settings/categories")}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemText
              primary="카테고리 관리"
              primaryTypographyProps={{ fontSize: 14, fontWeight: isActive("/settings/categories") ? 700 : 400 }}
            />
          </ListItemButton>
        </List>

        <Divider sx={{ my: 2 }} />

        <List dense disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemText primary="로그아웃" primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
          <ListItemButton onClick={handleWithdraw} sx={{ borderRadius: 2 }}>
            <ListItemText
              primary="회원 탈퇴"
              primaryTypographyProps={{ fontSize: 14, color: "error.main" }}
            />
          </ListItemButton>
        </List>
      </Box>

      {/* 콘텐츠 영역 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default SettingsPage;
