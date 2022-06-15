import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid, TextField, Button, Paper, AppBar, Toolbar } from "@mui/material";
import "./App.css";

export default function TestView(props) {
    const pages = ['Add Employee'];
    const [isHomePage, setHomePageStatus] = useState(true)//props.isHomePage);

    const menuOptionClicked = (event) => {
        
    }

    const CheckHomePageAppBar = () => {
        if (isHomePage) {
            return (
                <AppBar sx={{ bgcolor: 'black' }}>
                    <Toolbar>
                        <Button sx={{ bgcolor: 'black', color: 'white', padding:'10px', marginLeft:'30px','&:hover': { bgcolor: 'black' } }} >Home</Button>
                        {pages.map((menuOption) => (
                            <Button id={menuOption} onClick={menuOptionClicked} sx={{ bgcolor: 'green', color: 'white', padding:'10px', marginLeft:'30px', '&:hover': { bgcolor: 'lightgreen' } }} >{menuOption}</Button>
                        ))}
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
