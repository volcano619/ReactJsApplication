import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Grid, TextField, Button, Paper } from "@mui/material";
import "./App.css";
import logo from "./logo.svg";
import CustomAppBar from "./CustomAppBar";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { sagaActions } from "./sagaActions";

export default function Login() {
    const { register, handleSubmit } = useForm();
    let navigate = useNavigate();
    let dispatch = useDispatch();

    //const isLoggedIn = Boolean(useSelector((state) => state.employeelist.userLoggedIn));
    const userRegisteredSuccessfully = Boolean(useSelector((state) => state.employeelist.isRegistrationSuccessful));
    const loginSchema = yup.object().shape({
        LoginUsername: yup.string().email().required(),
        LoginPassword: yup.string().min(8).required(),
    })

    const validateLogin = async (loginData) => {
        const isLoginDataValid = await loginSchema.isValid(loginData, { abortEarly: false });
        if (isLoginDataValid) {
            dispatch({ type: sagaActions.DO_LOGIN_SAGA, requestData: JSON.stringify(loginData) });
            navigate('homepage');
        }
        else {
            alert("Please Check your credentials");
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
