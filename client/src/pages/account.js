import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Account() {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();

    const handleChange = (event) => {
        const targetId = event.currentTarget.id;
        const targetValue = event.currentTarget.value;

        if(targetId === "email") {
            setEmail(targetValue);
        } else if(targetId === "username") {
            setUsername(targetValue);
        } else if(targetId === "userId") {
            setUserId(targetValue);
        } else {
            setPassword(targetValue);
        }
    }

    const handleClick = async (event) => {
        event.preventDefault();

        console.log("here");

        const registerUrl = "account/register.do";
        const userInfo = {
            email: email,
            username: username,
            userId: userId,
            password: password,
        };

        try {
            let response = await axios.post("account/isDuplicates.do", { email, userId });
            if(!response.data.OK) {
                enqueueSnackbar("회원 정보가 중복됩니다.", { variant: "error" });
                return;
            }

            response = await axios.post(registerUrl, userInfo);
            console.log(response);

            if(response.data.OK) {
                enqueueSnackbar("회원가입 완료. 로그인 해주세요.", { variant: "success" });
                history("/");
                return;
            }

            enqueueSnackbar("에러가 발생했습니다. 관리자에게 문의해주세요.", { variant: "error" });
        } catch(err) {
            enqueueSnackbar("에러가 발생했습니다. 관리자에게 문의해주세요.", { variant: "error" });
        }
    }

    return (
        <Box sx={{flewGrow:1, display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "center"}}>
            <Typography variant="h3" component="div" gutterBottom>
                회원가입
            </Typography>
            <TextField sx={{ m: 2, width: '40%' }} 
                value={email} onChange={handleChange} id="email" 
                required placeholder="이메일 주소" />
            <TextField sx={{ m: 2, width: '40%' }} 
                value={username} onChange={handleChange} id="username" 
                required placeholder="성명" />
            <TextField sx={{ m: 2, width: '40%' }} 
                value={userId} onChange={handleChange} id="userId" 
                required placeholder="사용자 이름" />
            <TextField sx={{ m: 2, width: '40%' }} 
                value={password} onChange={handleChange} id="password" 
                type="password" required placeholder="비밀번호" />
            <Button onClick={handleClick} variant="outlined" id="register" sx={{ width: '10%', m: 2 }}>
                회원가입
            </Button>
        </Box>
    );
}