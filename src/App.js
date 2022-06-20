import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ky from 'ky';
import { Grid, TextField, Button, Paper } from "@mui/material";
import "./App.css";
import logo from "./logo.svg";
import CustomAppBar from "./CustomAppBar";

export default function App() {
    const { register, handleSubmit } = useForm();
    const [open, setOpen] = useState(false);
    let navigate = useNavigate();
    const validEmail = new RegExp(
        '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
    );
    const validPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');


    const validateLogin = async (loginData) => {
        if (loginData.LoginUsername == null || loginData.LoginPassword == null) {
            alert("Please enter your credentials");
        }
        else if (loginData.LoginUsername != null && !validEmail.test(loginData.LoginUsername)) {
            alert("Please check your username");
        }
        else if (loginData.LoginPassword != null && !validPassword.test(loginData.LoginPassword)) {
            alert("Please check your password");
        }
        else {
            const responseJson = await ky.post('https://localhost:7168/Employee/DoLogin', {
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                },
                json: {
                    "LoginUsername": loginData.LoginUsername,
                    "LoginPassword": loginData.LoginPassword,
                },
            }).json();

            if (responseJson) {
                sessionStorage.setItem("ProfileUserName", loginData.LoginUsername)
                navigate('homepage');
            }

            else {
                alert("Not able to login");
            }

            // setOpen(!responseJson);
            // return (
            //     <Dialog open={open} >
            //         <DialogContent>
            //             The credentials you have entered are incorrect
            //         </DialogContent>
            //     </Dialog>
            // );
        }
    };

    const validateUserRegistration = async (registrationData) => {
        if (registrationData.RegLoginUsername == null || registrationData.RegLoginPassword == null) {
            alert("Please enter your credentials");
        }
        else if (registrationData.RegLoginUsername != null && !validEmail.test(registrationData.RegLoginUsername)) {
            alert("Please check your username");
        }
        else if (registrationData.RegLoginPassword != null && !validPassword.test(registrationData.RegLoginPassword)) {
            alert("Please check your password");
        }
        else {
            const responseJson = await ky.post('https://localhost:7168/Employee/RegisterAdminUser', {
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                },
                json: {
                    "LoginUsername": registrationData.RegLoginUsername,
                    "LoginPassword": registrationData.RegLoginPassword,
                },
            }).json();

            if (responseJson) {
                alert("Registration Successful");
            }
            else {
                alert("Registration Failed");
            }

            // setOpen(!responseJson);
            // return (
            //     <Dialog open={open} >
            //         <DialogContent>
            //             The credentials you have entered are incorrect
            //         </DialogContent>
            //     </Dialog>
            // );
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <CustomAppBar isHomePage='false' ></CustomAppBar>
                <img className="App-logo" alt="" src={logo} height="300px" width="300px" />
                <Grid paddingLeft="55px" container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={5.5} direction="row" justifyContent="center" alignItems="center" className="Login">
                        <Paper elevation={3} className="Paper-styles">
                            <label className="App-font-bold">Login</label>
                            <div style={{ marginTop: '50px' }} className="Usernamediv">
                                <TextField
                                    {...register("LoginUsername")}
                                    label="Enter Username"
                                    size="small"
                                    required
                                />
                            </div>
                            <div style={{ marginTop: '20px' }} className="Passwordiv">
                                <TextField
                                    {...register("LoginPassword")}
                                    label="Enter Password"
                                    size="small"
                                    required
                                    type="password"
                                />
                            </div>
                            <div style={{ marginTop: '20px' }} className="Button">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit(validateLogin)}
                                >
                                    Log In
                                </Button>
                            </div>
                        </Paper>
                    </Grid>
                    <label padding="20px" className="App-font-small" item xs={0.5} height="5px" width="5px" >OR</label>
                    <Grid id="RegisterGrid" item xs={5.5} direction="row" justifyContent="center" alignItems="center">
                        <Paper elevation={3} className="Paper-styles">
                            <label className="App-font-bold">Sign Up</label>
                            <div style={{ marginTop: '50px' }} className="Usernamediv">
                                <TextField
                                    label="Enter Username"
                                    size="small"
                                    required
                                    {...register("RegLoginUsername")}
                                />
                            </div>
                            <div style={{ marginTop: '20px' }} className="Passwordiv">
                                <TextField
                                    label="Enter Password"
                                    size="small"
                                    required
                                    type="password"
                                    {...register("RegLoginPassword")}
                                />
                            </div>
                            <div style={{ marginTop: '20px' }} className="Button">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit(validateUserRegistration)}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </header>
        </div >
    );
}
