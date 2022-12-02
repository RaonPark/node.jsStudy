import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { ButtonGroup, CardActions, IconButton, Link } from '@mui/material';
import PanoramaWideAngleIcon from '@mui/icons-material/PanoramaWideAngle';
import PanoramaWideAngleSelectIcon from '@mui/icons-material/PanoramaWideAngleSelect';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import { ButtonBase, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import PrivateLogIcon from '../layout/privateLogIcon';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import SocketIO from 'socket.io-client';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
        width: '20ch',
        },
    },
}));

function Home() {
    const [posts, setPosts] = useState([]);
    const [showPosts, setShowPosts] = useState([]);
    const history = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [selectSearchRadio, setSelectSearchRadio] = useState("username");
    const [searchText, setSearchText] = useState("");
    const [toggle, setToggle] = useState(0);
    const [loggedUserId, setLoggedUserId] = useState("");
    const [countUnReadDM, setCountUnReadDM] = useState("");
  
    const handleProfileClick = (event) => {
      event.preventDefault();
      history("/profile");
    }
  
    const handleHomeClick = (event) => {
      event.preventDefault();
      history(0);
    }
  
    const handleNewClick = (event) => {
      event.preventDefault();
      history("/new");
    }
  
    const handleFollowClick = (event) => {
      event.preventDefault();
      history("/follow");
    }
  
    const handleDMClick = (event) => {
      event.preventDefault();
      const socket = SocketIO("http://localhost:8023");
      socket.auth = { loggedUserId };
      socket.connect();
      history("/msg");
    }
  
    const handleRadioChange = (event) => {
      event.preventDefault();
  
      setSelectSearchRadio(event.currentTarget.value);
    }
  
    const handleSearchChange = (event) => {
      event.preventDefault();
  
      setSearchText(event.target.value);
      if(event.target.value === "") {
          setToggle(false);
      }
    }

    const handleSearchClick = (event) => {
        event.preventDefault();

        setToggle(true);
    }

    useEffect(() => {
        const getPostsUrl = "post/getPosts.do";

        axios.post(getPostsUrl).then(response => {
            console.log(response.data.posts);
            const resPosts = response.data.posts;

            for(let post of resPosts) {
                post.createdAt = new Date(post.createdAt).toLocaleString();
                post.imageArray = post.image.trim().split(";");
                post.showImage = 0;
                post.article.split(/(#[^\s]+)/g).map((v) => {
                    if(v.match(/#[^\s]+/)) {
                        return v;
                    }
                    return v;
                });
                post.hashtags = post.article.split(/(#[^\s]+)/g).map((v) => {
                    if(v.match(/#[^\s]+/)) {
                        return v;
                    }
                    return "";
                });
                post.plainTexts = post.article.split(/(#[^\s]+)/g).map((v) => {
                    if(!v.match(/#[^\s]+/)) {
                        return v;
                    }
                    return "";
                });
            }

            setPosts(resPosts);
            setShowPosts(resPosts);
        });

        axios.post("account/getUserId.do").then(response => {
            setLoggedUserId(response.data.userId);
        });

        axios.post("directMessage/getUnreadMsg.do").then(response => {
            setCountUnReadDM(response.data.count);
        })
    }, []);

    const handleUserIdClick = (event) => {
        event.preventDefault();

        console.log(event.target.innerText);
        setShowPosts(posts.filter((post) => {
            return event.target.innerText === post.User.userId;
        }));
    }

    const handleHashtagClick = (event) => {
        event.preventDefault();

        setShowPosts(posts.filter(post => {
            for(const hashtag of post.hashtags) {

                if(hashtag === event.target.innerText)
                    return true;
            }
            return false;
        }));
    }

    const handleShowImageIndexClick = (event, postIndex, imageIndex) => {
        event.preventDefault();

        let changePosts = showPosts;
        
        changePosts[postIndex].showImage = imageIndex;

        setShowPosts([...changePosts]);
    }

    const handleEditClick = (event, post) => {
        event.preventDefault();

        history(`/edit`, {state: post});
    }

    return (
        <Box sx={{flexGrow:1}}>
            <AppBar position="relative" sx={{mb: 3}}>
                <Toolbar>
                    <ButtonBase onClick={handleHomeClick}>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        SSUSTAGRAM
                    </Typography>
                    </ButtonBase>
                    <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={handleSearchChange}
                        value={searchText}
                    />
                    </Search>
                    <RadioGroup row defaultValue="username" name="row-radio-buttons-group">
                        <FormControlLabel 
                            checked={selectSearchRadio === "username"}
                            onChange={handleRadioChange}
                            value="username"
                            label="이름 검색"
                            control={<Radio color="default" />} />
                        <FormControlLabel 
                            checked={selectSearchRadio === "text"}
                            onChange={handleRadioChange}
                            value="text"
                            label="텍스트 검색"
                            control={<Radio color="default"/>} />
                        <FormControlLabel 
                            checked={selectSearchRadio === "hashtag"}
                            onChange={handleRadioChange}
                            value="hashtag"
                            label="해시태그 검색"
                            control={<Radio color="default"/>} />
                    </RadioGroup>
                    <Button variant="contained" color="secondary" onClick={handleSearchClick}>검색</Button>
                    <Typography color="common.black" variant="overline" sx={{ml: 2}}>해시태그를 검색할 때 #을 빼고 검색해주세요!</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="new"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={handleNewClick}
                        sx={{mr : 2}}
                    >
                        <CreateTwoToneIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="profile"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={handleProfileClick}
                        sx={{mr : 2}}
                    >
                        <AccountCircleTwoToneIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        aria-label="follow"
                        color="inherit"
                        onClick={handleFollowClick}
                        sx={{mr : 2}}
                    >
                        <FavoriteTwoToneIcon />
                    </IconButton>
                    <IconButton 
                        size="large" 
                        aria-label="DM" 
                        color="inherit"
                        onClick={handleDMClick}
                        sx={{mr : 2}}
                    >
                        <Badge badgeContent={countUnReadDM} color="error">
                            <ChatTwoToneIcon />
                        </Badge>
                    </IconButton>
                    <PrivateLogIcon />
                    </Box>
                </Toolbar>
            </AppBar>
            <Grid container spacing={4}>
            {showPosts && showPosts
                .filter(post => {
                    if(toggle) {
                        if(selectSearchRadio === "username") {
                            return post.User.userId.toLowerCase().includes(searchText.toLowerCase());
                        } else if(selectSearchRadio === "text") {
                            return post.article.toLowerCase().includes(searchText.toLowerCase());
                        } else {
                            for(const hashtag of post.hashtags) {
                                if(hashtag.toLowerCase() === ("#"+searchText.toLowerCase()))
                                    return true;
                            }
                            return false;
                        }
                    } else 
                        return true;
                })
                .map((post, postIndex) => (
                <Grid item key={post.userId} xs={12} sm={6} md={4}>
                    <Card
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    >
                        <CardMedia component="img" height="280" image={post.imageArray[post.showImage]} />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Grid container spacing={0} rowSpacing={0}>
                                <Grid item xs={12}>
                                    <ButtonGroup size="small" aria-label="small button group">
                                        {post.imageArray.map((image, imageIndex) => {
                                            if(image) {
                                                return (
                                                    <IconButton key={imageIndex} onClick={(event) => handleShowImageIndexClick(event, postIndex, imageIndex)}>
                                                        {imageIndex === post.showImage ? <PanoramaWideAngleSelectIcon/> : <PanoramaWideAngleIcon /> }
                                                    </IconButton>
                                                );
                                            }
                                            return <span key={imageIndex}></span>;
                                        })}
                                    </ButtonGroup>
                                </Grid>
                                <Grid item xs={4}>
                                    <Link component="button" variant="body2" onClick={handleUserIdClick}>
                                        {post.User.userId}
                                    </Link>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography
                                    gutterBottom
                                    variant="body2"
                                    display="block"
                                    >
                                        {post.createdAt}
                                    </Typography>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={8}>
                                        <React.Fragment sx={{display:'flex', flexDirection: 'row'}}>
                                            {post.article.split(/(#[^\s]+)/g).map((text, index) => {
                                                if(text.match(/#[^\s]+/)) {
                                                    return (
                                                        <Link component="button" variant="body2" key={index} onClick={handleHashtagClick}>
                                                            {text}
                                                        </Link>
                                                    );
                                                } else {
                                                    return ( 
                                                        <Typography variant="body2" display="inline" key={index} gutterBottom>
                                                            {text}
                                                        </Typography>
                                                    );
                                                }
                                            })}
                                        </React.Fragment>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                        {
                            post.User.userId === loggedUserId ?
                            <CardActions>
                                <Button variant="contained" onClick={(event) => handleEditClick(event, post)}>편집</Button>
                            </CardActions>
                            :
                            <></>
                        }
                    </Card>
                </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Home;