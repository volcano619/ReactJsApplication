import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, AppBar, Toolbar, Tooltip, Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import "./App.css";

export default function CustomAppBar(props) {
    const pages = ['Add Employee'];
    const settings = ['Logout'];
    const navigate = useNavigate();
    const [IsHomePage, setIsHomePageStatus] = useState(props.isHomePage);
    const [profileUsername, setProfileUsername] = useState(props.profileUsername);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = (event) => {
        if(event.currentTarget.id === 'Logout'){
            navigate('../')
            setAnchorElUser(null);
        }
        else{
            setAnchorElUser(null);
        }
    };

    const menuOptionClicked = (event) => {
        if (event.currentTarget.id === 'Add Employee') {
            navigate('../addemployee')
        }
        else if (event.currentTarget.id === 'homepage'){
            navigate('../homepage', { state: { ProfileUserName: "Admin" } })
        }
    }

    const CheckHomePageAppBar = () => {
        console.log(IsHomePage)
        if (IsHomePage === 'true') {
            return (
                <AppBar className="App-HeaderBar">
                    <Toolbar className="App-toolbar-div" >
                        <Toolbar className="App-Toolbar" >
                            <Button id="homepage" onClick={menuOptionClicked} sx={{ bgcolor: 'black', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'black' } }} >Home</Button>
                            {pages.map((menuOption) => (
                                <Button id={menuOption} onClick={menuOptionClicked} sx={{ bgcolor: 'green', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'lightgreen' } }} >{menuOption}</Button>
                            ))}
                        </Toolbar>
                        <Box>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar sx={{ bgcolor: 'green' }} alt={profileUsername} src="/src/user.png" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} id={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
            );
        }
        else 
        {
            console.log("Hi")
            return (
                <AppBar className="App-HeaderBar">
                    <Toolbar>
                        <label sx={{ color: 'white' }} >Welcome to Employee Portal</label>
                    </Toolbar>
                </AppBar>
            );
        }
    };

    return (
        CheckHomePageAppBar()
    );
}