import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Grid, TextField, Button, Paper } from "@mui/material";
import "../App.css";
import logo from "../logo.svg";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { sagaActions } from "../sagafiles/sagaActions";
import YupPassword from 'yup-password'
import { useState } from "react";
import CustomAppBar from './CustomAppBar';
YupPassword(yup)

export default function Login() {
    const { register, handleSubmit } = useForm();
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const [usernameHelperText, setUsernameHelperText] = useState();
    const [passwordHelperText, setPasswordHelperText] = useState();
    const [usernameErrorStatus, setUsernameErrorStatus] = useState();
    const [passwordErrorStatus, setPasswordErrorStatus] = useState();

    //const isLoggedIn = Boolean(useSelector((state) => state.employeelist.userLoggedIn));
    const userRegisteredSuccessfully = Boolean(useSelector((state) => state.employeelist.isRegistrationSuccessful));
    const loginSchema = yup.object().shape({
        Username: yup.string().email().required(),
        Password: yup.string().password().required(),
    })

    const validateLogin = async (loginData) => {
        const validationOutput = await loginSchema.validate(loginData, { abortEarly: false }).catch((error) => {
            error.errors.map((errorMessage) => {
                if (errorMessage.toLowerCase().includes('password')) {
                    setPasswordHelperText('Please check your password');
                    setPasswordErrorStatus(true);
                }
                else if (errorMessage.toLowerCase().includes('username')) {
                    setUsernameHelperText('Please check your username');
                    setUsernameErrorStatus(true);
                }
            });
        });
        if (validationOutput !== undefined) {
            setPasswordHelperText('');
            setPasswordErrorStatus(false);
            setUsernameHelperText('');
            setUsernameErrorStatus(false);
            dispatch({ type: sagaActions.DO_LOGIN_SAGA, requestData: JSON.stringify({ LoginUsername: loginData.Username, LoginPassword: loginData.Password }) });
            navigate('homepage');
        }
    };

    const validateUserRegistration = async (registrationData) => {
        const isRegistrationDataValid = await loginSchema.isValid(registrationData, { abortEarly: false });
        if (isRegistrationDataValid) {
            dispatch({ type: sagaActions.DO_REGISTRATION_SAGA, requestData: JSON.stringify(registrationData) });
            if (userRegisteredSuccessfully) {
                alert('User has been succesfully registered');
            }
            else {
                alert("Registration Failed");
            }
        }

        else {
            alert("Registration Failed");
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
                                    {...register("Username")}
                                    label="Enter Username"
                                    size="small"
                                    required
                                    error={usernameErrorStatus}
                                    helperText={usernameHelperText}
                                />
                            </div>
                            <div style={{ marginTop: '20px' }} className="Passwordiv">
                                <TextField
                                    {...register("Password")}
                                    label="Enter Password"
                                    size="small"
                                    required
                                    type="password"
                                    error={passwordErrorStatus}
                                    helperText={passwordHelperText}
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
