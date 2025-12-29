import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupApi } from "../features/auth/api";
import "../styles/login.css";
import "../styles/common.css";
import "../styles/theme.css";

function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 비밀번호 조건 체크
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  const lengthValid = password.length >= 6;
  const combinationValid = [hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length >= 2;

  const passwordValid = lengthValid && combinationValid;
  const passwordMatch = password.length > 0 && password === confirmPassword;

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("모든 값을 입력해주세요.");
      return;
    }

     if (!passwordValid) {
      setError("비밀번호 조건을 만족해주세요.");
      return;
    }

    if (!passwordMatch) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await signupApi({
        name,
        email,
        password,
        confirmPassword,
      });

      navigate("/login");
    } catch (e: any) {
      setError(
        e.response?.data?.message || "회원가입에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h2 className="login-title">회원가입</h2>
        <p className="login-subtitle">
          FinTrack와 함께 소비를 관리해보세요
        </p>

        <input
          className="input"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        {/* 비밀번호 조건 표시 */}
        <div className="password-rules">
          <div className={`rule ${lengthValid ? "success" : "error"}`}>
            • 6자 이상이어야 합니다.
          </div>
          <div
            className={`rule ${
              combinationValid ? "success" : "error"
            }`}
          >
            • 소문자 / 숫자 / 특수문자 중 2가지 이상의 조합이어야 합니다.
          </div>
        </div>

        <input
          className="input"
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {confirmPassword && (
          <div
            className={`rule ${
              passwordMatch ? "success" : "error"
            }`}
          >
            {passwordMatch ? "" : "비밀번호가 일치하지 않습니다."}
          </div>
        )}

        {error && <p className="login-error">{error}</p>}

        <button
          className="button-primary"
          style={{ width: "100%" }}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>

        <p
          className="login-footer"
          onClick={() => navigate("/login")}
        >
          이미 계정이 있으신가요? 로그인
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
