import Box from '@mui/material/Box';
import { useEffect, useRef, useState } from 'react';
import SocketIO from 'socket.io-client';
import axios from 'axios';
import { Button, Grid, Paper, TextField, Typography, Divider } from '@mui/material';

const ScrollToBottom = () => {
    const ref = useRef();
    useEffect(() => ref.current.scrollIntoView());
    return (
        <Box ref={ref} />
    );
}

function Msg() {
    const [follower, setFollower] = useState([]);
    const [msg, setMsg] = useState("");
    const [opponentId, setOpponentId] = useState("");
    const [loggedUserId, setLoggedUserId] = useState("");
    const [message, setMessage] = useState([]);
    const socket = SocketIO("http://localhost:8023/dm", {
        path: '/socket.io',
        transports: ['websocket'],
    });

    useEffect(() => {
        axios.post("follow/getFollower.do").then(response => {
            console.log(response);
            setFollower(response.data.follower);
        });
        axios.post("account/getUser.do").then(response => {
            setLoggedUserId(response.data.user.id);
            socket.emit('test', {id: response.data.user.id});
        });
    }, []);

    const handleFollowerClick = async (event, user) => {
        event.preventDefault();

        axios.post(`directMessage/room/${loggedUserId}`, {id: user.id, msg: msg})
        .then(response => {
            setMessage(response.data.msg);
            setOpponentId(user.id);
        });
    }

    const onMsgChange = (event) => {
        event.preventDefault();

        setMsg(event.target.value);
    }

    const handleSendClick = (event) => {
        event.preventDefault();

        axios.post(`directMessage/room/${loggedUserId}/dm`, {id: opponentId, msg: msg})
        .then(response => {
            if(response.data.OK)
                setMessage(old => [...old, response.data.msg]);
            setMsg("");
        });
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container component="main" sx={{height: '100vh'}}>
                <Grid item xs={false} sm={4} md={3} component={Paper} sx={{background: '#FFAFAF'}}>
                    {follower && follower.map(user => {
                        return (
                            <Box sx={{flexGrow: 1}}>
                                <Button sx={{
                                    height: '100px',
                                    width: '100%',
                                }}
                                onClick={(event) => handleFollowerClick(event, user)}
                                >
                                    {user.userId}
                                </Button>
                                <Divider />
                            </Box>
                        );
                    })}
                </Grid>
                <Grid item xs={12} sm={8} md={9} component={Paper} elevation={6} sqaure 
                sx={{
                    background: '#FBFFE2',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '70%',
                    alignItems: 'center',
                }}>
                    <Box sx={{
                        minHeight: '70%',
                        flexGrow: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '50%',
                        overflow: 'auto',
                    }}>
                        {message && message.map(msg => {
                            if(msg.from === loggedUserId) {
                                console.log("true? ", msg.from === loggedUserId)
                                return ( 
                                    <Typography sx={{ml: 'auto', background: "#FFEBCC", mb: 1}}>
                                        {msg.message}
                                    </Typography>
                                );
                            } else {
                                return ( 
                                    <Typography sx={{mr: 'auto', background: "#FF9999", mb: 1}}>
                                        {msg.message}
                                    </Typography>
                                );
                            }
                        })}
                        <ScrollToBottom />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexGrow: 1,
                    }}>
                        <TextField sx={{
                            width: '75%',
                            ml: 2,
                        }} 
                        value={msg}
                        onChange={onMsgChange}
                        size="large"/>
                        <Button variant="outlined" color="secondary" sx={{
                            width: '10%',
                            height: '70px',
                            ml: 2,
                        }}
                        onClick={handleSendClick}>
                            보내기
                        </Button>
                    </Box>
                </Grid>
                
            </Grid>
        </Box>
    );
}

export default Msg;