import React, {useEffect, useState, useCallback} from 'react';
import {useSnackbar} from 'notistack';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Divider, List, ListItem, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

function Profile() {
    const { enqueueSnackbar } = useSnackbar();
    const [userId, setUserId] = useState('');
    const nowDate = new Date(Date.now()).toLocaleString();
    const [followers, setFollowers] = useState([]);
    const [followees, setFollowees] = useState([]);

    const getProfile = useCallback(() => {

        axios.get("profile/getProfile.do")
        .then(response => {
            console.log(response);

            if(response.data.OK) {
                setUserId(response.data.User.userId);
                setFollowers(response.data.User.Follower);
                setFollowees(response.data.User.Followee);
            } else {
                enqueueSnackbar("에러가 발생했습니다. 관리자에게 문의해주세요.", {variant: "error"});
            }
        });
        
    }, [enqueueSnackbar]);

    useEffect(() => {
        getProfile();
    }, [getProfile]);

    return (
        <Box sx={{flexGrow:1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant="p" component="div" sx={{m: 2}}>
                {`로그인한 아이디: ${userId}`}
            </Typography>
            <Typography variant="p" component="div" sx={{m: 2}}>
                {`현재 시간: ${nowDate}`}
            </Typography>
            <Paper sx={{
                maxHeight: '30%',
                width: '30%', 
                overflow: 'auto', 
                m: 2}}>
                <Box sx={{display:"flex", flexDirection:"row", flexGrow: 1}}>
                    <Typography variant="h6" component="span" sx={{flexGrow: 1}}>
                        {`팔로우 ${followers.length}명`}
                    </Typography>
                </Box>
                <Divider />
                <List>
                    {followers && followers.map(function(follower, index) {
                        return (
                            <div key={index}>
                                <ListItem alignItems="flex-start" key={index}>
                                    <ListItemText
                                        primary={follower.userId}
                                        secondary={
                                            <React.Fragment>
                                                <Typography component="span" variant="body2">
                                                    {follower.username}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </div>
                        );
                    })}
                </List>
            </Paper>
            <Paper sx={{
                maxHeight: 300, 
                width: '30%', 
                overflow: 'auto', 
                m: 2}}>
                <Box sx={{display:"flex", flexDirection:"row", flexGrow: 1}}>
                    <Typography variant="h6" component="span" sx={{flexGrow: 1}}>
                        {`팔로워 ${followees.length}명`}
                    </Typography>
                </Box>
                <Divider />
                <List>
                    {followees && followees.map(function(followee, index) {
                        return (
                            <div key={index}>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary={followee.userId}
                                        secondary={
                                            <React.Fragment>
                                                <Typography component="span" variant="body2">
                                                    {followee.username}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </div>
                        );
                    })}
                </List>
            </Paper>
        </Box>
    );
}

export default Profile;