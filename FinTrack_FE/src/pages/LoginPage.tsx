import { useNavigate } from "react-router-dom";

function LoginPage(){
    const navigate = useNavigate();

    return (
        <div>
            <h1>로그인</h1>
            <div>
                <input placeholder="이메일" />
            </div>

            <div>
                <input type = "password" placeholder="비밀번호" />
            </div>

            <button onClick={() => navigate("/dashboard")}>로그인</button>

            <p>
                아직 회원이 아니신가요? {" "}
                <span style = {{color: "blue", cursor: "pointer"}}
                onClick={() => navigate("/signup")}
                >회원가입</span>
            </p>
        </div>
    )
}

export default LoginPage;