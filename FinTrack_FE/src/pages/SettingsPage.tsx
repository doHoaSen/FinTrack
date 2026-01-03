import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { withdrawApi } from "../features/auth/api";

function SettingsPage() {
    const navigate = useNavigate();
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

    return (
        <div style={{ padding: 24 }}>
            <h2>설정</h2>

            <button onClick={handleLogout}>
                로그아웃
            </button>

            <button
                onClick={handleWithdraw}
                style={{ marginLeft: 12, color: "red" }}
            >
                회원탈퇴
            </button>
        </div>
    )
}

export default SettingsPage;