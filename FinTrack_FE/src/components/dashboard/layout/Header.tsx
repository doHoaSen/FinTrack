import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

function Header() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 100,
      }}
    >
      <h2
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        FinTrack
      </h2>

      <div style={{ display: "flex", gap: 12 }}>
        <span>{user?.name}</span>

        <button onClick={() => navigate("/settings")}>
          마이페이지
        </button>

        <button onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </header>
  );
}

export default Header;
