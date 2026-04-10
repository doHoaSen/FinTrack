import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProtectedLayout from "./routes/ProtectedLayout";
import ExpensesPage from "./pages/ExpensesPage";
import CategoryManagePage from "./components/category/CategoryManagePage";

function ComingSoonPage({ title }: { title: string }) {
  return (
    <Box sx={{ p: 4, color: "text.secondary" }}>
      <Typography variant="h6" fontWeight={600} mb={1}>{title}</Typography>
      <Typography variant="body2">준비 중인 페이지입니다.</Typography>
    </Box>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      {/* 인증 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 보호 영역 */}
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />}>
          <Route path="categories" element={<CategoryManagePage />} />
        </Route>
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/budget" element={<ComingSoonPage title="예산 관리" />} />
        <Route path="/analytics" element={<ComingSoonPage title="소비 분석" />} />
      </Route>
    </Routes>
  );
}

export default App;
