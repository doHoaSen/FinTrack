import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { withdrawApi } from "../features/auth/api";
import {
  Box,
  Card,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleWithdraw = async () => {
    if (!confirm("정말 탈퇴하시겠습니까?")) return;
    await withdrawApi();
    logout();
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        마이페이지
      </Typography>

      <Box sx={{ display: "flex", gap: 3 }}>
        {/* 좌측 메뉴 */}
        <Card sx={{ width: 240, height: "fit-content" }}>
          <List>
            <ListItemButton
              selected={isActive("/settings/categories")}
              onClick={() => navigate("/settings/categories")}
            >
              <ListItemText primary="카테고리 관리" />
            </ListItemButton>

            <Divider />

            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="로그아웃" />
            </ListItemButton>

            <ListItemButton onClick={handleWithdraw}>
              <ListItemText
                primary="회원 탈퇴"
                primaryTypographyProps={{ color: "error" }}
              />
            </ListItemButton>
          </List>
        </Card>

        {/* 우측 상세 */}
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default SettingsPage;
