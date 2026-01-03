import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { loginApi } from "../features/auth/api";
import "../styles/login.css";
import "../styles/common.css";
import "../styles/theme.css";

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await loginApi({ email, password });

      login(res.accessToken,
            {name: res.name,
              email: res.email
            });
      navigate("/dashboard");
    } catch (e: any) {
      setError(
        e.response?.data?.message || "로그인에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h2 className="login-title">FinTrack</h2>
        <p className="login-subtitle">
          내 소비를 한눈에 관리하세요
        </p>

        <input
          className="input"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="login-error">{error}</p>
        )}

        <button
          className="button-primary"
          style={{ width: "100%" }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <p
          className="login-footer"
          onClick={() => navigate("/signup")}
        >
          회원이 아니신가요? 회원가입
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
