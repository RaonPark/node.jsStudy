import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardMedia, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function Index() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();

    const handleChange = (event) => {
        if(event.currentTarget.id === "id") {
            setUserId(event.currentTarget.value);
        } else {
            setPassword(event.currentTarget.value);
        }
    }

    const handleClick = async (event) => {
        event.preventDefault();

        if(event.currentTarget.id === "login") {
            const url = "account/login.do";

            console.log(url);
            console.log(userId);
            console.log(password);

            axios.post(url, { userId: userId, password: password })
            .then(async (response) => {
                if(response.data.OK) {
                    console.log(response);
                    const verifyResponse = await axios.post("account/isVerified.do");
                    console.log(verifyResponse.data.isVerified);
                    if(!verifyResponse.data.isVerified.verified) {
                        console.log("to email");
                        history("/email");
                        return;
                    } else {
                        history("/home");
                        return;
                    }
                } else {
                    enqueueSnackbar("로그인 정보가 올바르지 않습니다.", { variant: "error" });
                    return;
                }
            });
        } else {
            history("/account");
        }
    }

    return (
        <Box sx={{ 
            flexGrow:1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center', 
            alignItems: 'center',
            height: '80vh',
            }}>
            <Card sx={{width: '50%'}}>
                <CardHeader title="SSUSTAGRAM" subheader="슈스타그램"/>
                <CardMedia component="img" image="" height="300" />
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField sx={{ m: 2, width: '50%' }} 
                            value={userId} onChange={handleChange} id="id" 
                            required placeholder="아이디" />
                        <TextField sx={{ m: 2, width: '50%' }} 
                            value={password} onChange={handleChange} id="password" 
                            type="password" required placeholder="비밀번호" />
                        <Box sx={{display: 'flex', flexDirection: 'row', width: '30%'}}>
                            <Button onClick={handleClick} variant="outlined" id="login" sx={{ width: '50%', m: 2 }}>로그인</Button>
                            <Button onClick={handleClick} variant="outlined" id="register" sx={{ width: '50%', m: 2 }}>회원가입</Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}