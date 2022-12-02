import { Box, TextField, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Email() {
    const [verifyCode, setVerifyCode] = useState("");
    const [minutes, setMinutes] = useState(3);
    const [seconds, setSeconds] = useState(0);
    const [isCodeSend, setIsCodeSend] = useState(false);
    const time = useRef(180);
    const timer = useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();

    const handleVerifyCodeChange = (event) => {
        setVerifyCode(event.target.value);
    }

    const onSubmitClick = (event) => {
        event.preventDefault();

        axios.post("account/verifyEmail.do", {code: verifyCode})
        .then(response => {
            if(response.data.OK) {
                enqueueSnackbar("이메일 인증 완료.", {variant: "success"});
                history("/home");
            } else {
                enqueueSnackbar("이메일 인증 실패. 다시 한 번 시도해주세요.", {variant: "error"});
            }
        });
    }

    const onGetCodeClick = (event) => {
        event.preventDefault();

        axios.post("account/getVerifyCode.do")
        .then(response => {
            if(response.data.OK) {
                enqueueSnackbar("이메일 인증 코드를 보냈습니다. 3분 내로 입력해주세요.", {variant: "success"});
                setIsCodeSend(true);
            }
        });
    }
    
    useEffect(() => {
        timer.current = setInterval(() => {
            setMinutes(parseInt(time.current / 60));
            setSeconds(time.current % 60);
            time.current -= 1;
        }, 1000);
        return () => clearInterval(timer.current);
    }, []);

    useEffect(() => {
        if(time.current <= 0) {
            enqueueSnackbar("이메일 인증 코드를 다시 받아주세요.", {variant: "info"});
            clearInterval(timer.current);
            setIsCodeSend(false);

            axios.post("account/deleteVerifyCode.do", {})
            .then(res => {
                console.log(res);
            });
        }
    }, [seconds, enqueueSnackbar]);

    return (
        <Box sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Typography variant="h3" component="div" sx={{m : 3}}>이메일 인증</Typography>
            <TextField required placeholder="이메일 인증 코드 입력" variant="filled" label="Verify Email Code" value={verifyCode} onChange={handleVerifyCodeChange} sx={{m : 3}}/>
            {isCodeSend ? <Typography variant="body2" component="div" sx={{m : 3}}>{`${minutes} : ${seconds}`}</Typography> : <div></div> }
            <Button variant="outlined" onClick={onGetCodeClick} sx={{m : 3}}>인증코드 받기</Button>
            <Button variant="outlined" onClick={onSubmitClick} sx={{m : 3}}>인증하기</Button>
        </Box>
    )
}

export default Email;