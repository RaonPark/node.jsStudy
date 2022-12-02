import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { Button, Divider, List, ListItem, IconButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useSnackbar } from 'notistack';

function Follow() {
    const [userList, setUserList] = useState([]);
    const [followerIDs, setFollowerIDs] = useState([]);
    const history = useNavigate();
    const [toggle, setToggle] = useState(0);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        axios.post("follow/getUserList.do")
        .then(response => {
            console.log(response.data.followerIds);
            setFollowerIDs(response.data.followerIds);
            setUserList(response.data.users);
        });
    }, [toggle]);

    const handleHomeClick = (event) => {
        event.preventDefault();

        history("/home");
    }

    const handleFollowClick = async (event, id) => {
        event.preventDefault();

        let flag = false;

        for(const user of followerIDs) {
            if(user === id) {
                flag = true;
            }
        }

        console.log(flag);

        if(flag) {
            const response = await axios.post("follow/unfollow.do", {id});
            if(response.data.OK) {
                enqueueSnackbar("언팔로우 되었습니다.", {variant: "success"});
                setToggle(value => value + 1);
            }
        } else {
            console.log("here");
            axios.post("follow/follow.do", {id}).then(response => {
                console.log(response.data);
                enqueueSnackbar("팔로우 되었습니다.", {variant: "success"});
                setToggle(value => value + 1);
            });
        }
    }

    return (
        <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <List sx={{width: '100%', maxWidth: '400px', bgcolor: 'background.paper'}}>
                {userList.map(user => {
                    return (
                        <React.Fragment>
                            <ListItem sx={{alignItems: 'flex-start', justifyContent: 'center'}}
                                secondaryAction={
                                    <Button variant="secondary" onClick={(event) => handleFollowClick(event, user.id)}>
                                        {(!followerIDs || followerIDs.length === 0) ? "팔로우" : followerIDs.includes(user.id) ? "언팔로우" : "팔로우"}
                                    </Button>
                                } >
                                <ListItemText primary={user.userId} 
                                    secondary={
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {user.username}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    )
                })}
            </List>
            <Button variant="contained" onClick={handleHomeClick} sx={{m: 2, maxWidth: '400px'}}>홈으로</Button>
        </Box>
    );
}

export default Follow;