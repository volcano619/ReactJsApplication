import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, AppBar, Toolbar, Tooltip, Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import "./App.css";

export default function CustomAppBar(props) {
    const pages = ['Add Employee'];
    const settings = ['Logout'];
    const navigate = useNavigate();
    const [isHomePage, setHomePageStatus] = useState(true)//props.isHomePage);
    const [profileUsername, setProfileUsername] = useState(props.profileUsername);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const menuOptionClicked = (event) => {
        if (event.currentTarget.id === 'Add Employee') 
        {
            navigate('../addemployee')
        }
    }

    const CheckHomePageAppBar = () => {
        if (isHomePage) {
            return (
                <AppBar sx={{ bgcolor: 'black', flex: 1 }}>
                    <Toolbar>
                        <Button sx={{ bgcolor: 'black', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'black' } }} >Home</Button>
                        {pages.map((menuOption) => (
                            <Button id={menuOption} onClick={menuOptionClicked} sx={{ bgcolor: 'green', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'lightgreen' } }} >{menuOption}</Button>
                        ))}
                        <Box sx={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
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
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
            );
        }
        else {
            return (
                <AppBar sx={{ bgcolor: 'black' }}>
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