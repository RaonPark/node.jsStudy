import IconButton from '@mui/material/IconButton';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

function PrivateLogIcon() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const history = useNavigate();

    const checkLoggedIn = async () => {
        const checkLoginUrl = "account/isLoggedIn.do";
        
        const response = await axios.post(checkLoginUrl);
        setIsLoggedIn(response.data.isLoggedIn);
    }

    const handleClick = async (event) => {
        event.preventDefault();

        if(isLoggedIn) {
            const logoutUrl = "account/logout.do";

            const response = await axios.get(logoutUrl);
            if(response.data.OK) {
                history("/");
            } else {
                enqueueSnackbar("에러가 발생했습니다. 관리자에게 문의해주세요.", { variant: "error" });
            }
        } else {
            history("/");
        }
    }

    useEffect(() => {
        checkLoggedIn();
    }, []);

    return (
        <IconButton 
            size="large"
            edge="end"
            aria-label="logInOut"
            aria-haspopup="true"
            color="inherit"
            onClick={handleClick}
        >
            {isLoggedIn ? <LogoutTwoToneIcon/> : <LoginTwoToneIcon/>}
        </IconButton>
    );
}

export default PrivateLogIcon;