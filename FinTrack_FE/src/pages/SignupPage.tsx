import { useNavigate } from "react-router-dom";

function SignupPage(){
    const navigate = useNavigate();

    return(
        <div style = {{padding: 24}}>
            <h1>회원가입</h1>

            <div>
                <input placeholder="이메일" />
            </div>

            <div>
                <input type="password" placeholder="비밀번호" />
            </div>

            <button onClick = {() => navigate("/login")}>회원가입</button>

            <p style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/login")}>로그인으로 돌아가기</p>
        </div>
    )
}
export default SignupPage;