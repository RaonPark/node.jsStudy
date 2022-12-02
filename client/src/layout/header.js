import React, {useEffect, useState} from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { ButtonBase, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import PrivateLogIcon from './privateLogIcon';

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

export default function Header() {
  const { enqueueSnackbar } = useSnackbar();
  const history = useNavigate();
  const [selectSearchRadio, setSelectSearchRadio] = useState("username");
  const [searchText, setSearchText] = useState("");

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
    history("/msg");
  }

  const handleRadioChange = (event) => {
    event.preventDefault();

    setSelectSearchRadio(event.currentTarget.value);
  }

  const handleSearchChange = (event) => {
    event.preventDefault();

    setSearchText(event.target.value);

    if(selectSearchRadio === "username") {
      
    }
  }

  return (
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
              <Badge badgeContent={17} color="error">
                  <FavoriteTwoToneIcon />
              </Badge>
          </IconButton>
          <IconButton 
            size="large" 
            aria-label="DM" 
            color="inherit"
            onClick={handleDMClick}
            sx={{mr : 2}}
          >
              <Badge badgeContent={4} color="error">
                  <ChatTwoToneIcon />
              </Badge>
          </IconButton>
          <PrivateLogIcon />
        </Box>
      </Toolbar>
    </AppBar>
  );
}