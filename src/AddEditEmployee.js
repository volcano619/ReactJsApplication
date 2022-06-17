import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TextField, Button, Paper } from "@mui/material";
import "./App.css";
import ky from 'ky';

export default function AddEditEmployee() {
    const { register, handleSubmit } = useForm();
    const [updateFirstNameText, setUpdatedFirstName] = useState();
    const [updateLastNameText, setUpdatedLastName] = useState();
    const [updateCompanyNameText, setUpdatedCompanyName] = useState();
    const [updateEmailAddressText, setUpdatedEmailAddress] = useState();

    const updateFirstNameValue = e => setUpdatedFirstName(e.target.value)
    const updateLastNameValue = e => setUpdatedLastName(e.target.value)
    const updateCompanyNameValue = e => setUpdatedCompanyName(e.target.value)
    const updateEmailAddressValue = e => setUpdatedEmailAddress(e.target.value)

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state != null) {
            setUpdatedFirstName(location.state.editEmployeeData[0].firstName);
            setUpdatedLastName(location.state.editEmployeeData[0].lastName);
            setUpdatedEmailAddress(location.state.editEmployeeData[0].emailAddress);
            setUpdatedCompanyName(location.state.editEmployeeData[0].currentProjectName);
        }
    },location.state);

    const validEmail = new RegExp(
        '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
    );

    const validateandAddEmployeeDataOperation = async (addEmployeeRequestData) => {
        if (addEmployeeRequestData.FirstName == null || addEmployeeRequestData.LastName == null || addEmployeeRequestData.CurrentProjectName == null || addEmployeeRequestData.EmailAddress == null || !validEmail.test(addEmployeeRequestData.EmailAddress)) {
            alert("Please check the information entered");
        }
        else {
            const responseJson = await ky.post('https://localhost:7168/Employee/AddEmployee', {
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                },
                json:
                {
                    FirstName: addEmployeeRequestData.FirstName,
                    LastName: addEmployeeRequestData.LastName,
                    CurrentProjectName: addEmployeeRequestData.CurrentProjectName,
                    EmailAddress: addEmployeeRequestData.EmailAddress
                },
            }).json();

            if (responseJson) {
                navigate('../homepage', { state: { ProfileUserName: "Testing" } })
            }
            else {
                alert("Something Went Wrong, please try again")
            }
        }
    }

    const validateandUpdateEmployeeDataOperation = async (event) => {
        if (updateFirstNameText == null || updateLastNameText == null || updateCompanyNameText == null || updateEmailAddressText == null || !validEmail.test(updateEmailAddressText)) {
            alert("Please check the information entered");
        }
        else {
            const responseJson = await ky.post('https://localhost:7168/Employee/UpdateEmployee', {
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                },
                json:
                {
                    EmployeeId: location.state.editEmployeeData[0].employeeId,
                    FirstName: updateFirstNameText,
                    LastName: updateLastNameText,
                    CurrentProjectName: updateCompanyNameText,
                    EmailAddress: updateEmailAddressText
                },
            }).json();

            if (responseJson) {
                navigate('../homepage', { state: { ProfileUserName: "Testing" } })
            }
            else {
                alert("Something Went Wrong, please try again")
            }
        }
    }

    const cancelEmployeeCreation = (event) => {
        navigate('../homepage', { state: { ProfileUserName: "Testing" } });
    }

    const checkAddEditCondition = () => {
        if (location.state == null) {
            return (
                <div className="App" >
                    <Paper elevation={3} sx={{
                        backgroundColor: 'white',
                        marginTop: '20px',
                        padding: '25px',
                    }}>
                        <div>
                            <label style={{ fontSize: '30px' }} >New Employee</label>
                            <div style={{ marginTop: '20px' }} >
                                <label>Please fill out the form below to create a new employee</label>
                            </div>
                        </div>
                    </Paper>
                    <Paper elevation={3} sx={{
                        backgroundColor: 'white',
                        marginTop: '20px',
                        padding: '25px',
                    }}>
                        <div style={{ marginTop: '25px' }} >
                            <label>First Name</label>
                        </div>
                        <div style={{ marginTop: '10px' }} className="Usernamediv">
                            <TextField
                                {...register("FirstName")}
                                label="Enter First Name"
                                size="small"
                                required
                            />
                        </div>
                        <div style={{ marginTop: '50px' }} >
                            <label>Last Name</label>
                        </div>
                        <div style={{ marginTop: '10px' }} className="Usernamediv">
                            <TextField
                                {...register("LastName")}
                                label="Enter Last Name"
                                size="small"
                                required
                            />
                        </div>
                        <div style={{ marginTop: '50px' }} >
                            <label>Company</label>
                        </div>
                        <div style={{ marginTop: '10px' }} className="Usernamediv">
                            <TextField
                                {...register("CurrentProjectName")}
                                label="Enter Company Name"
                                size="small"
                                required
                            />
                        </div>
                        <div style={{ marginTop: '50px' }} >
                            <label>Email Address</label>
                        </div>
                        <div style={{ marginTop: '10px' }} className="Usernamediv">
                            <TextField
                                {...register("EmailAddress")}
                                label="Enter Email Address"
                                size="small"
                                required
                            />
                        </div>

                        <div style={{ marginTop: '45px' }} >
                            <Button id="addEmployee" sx={{ bgcolor: 'green', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'lightgreen' } }} onClick={handleSubmit(validateandAddEmployeeDataOperation)}  >Add Employee</Button>
                            <Button id="cancelOperation" sx={{ bgcolor: 'black', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'gray' } }} onClick={cancelEmployeeCreation} >Cancel</Button>
                        </div>
                    </Paper>
                </div>
            )
        }
        else {
            return (
                <div className="App" >
                    <Paper elevation={3} sx={{
                        backgroundColor: 'white',
                        marginTop: '20px',
                        padding: '25px',
                    }}>
                        <div>
                            <label style={{ fontSize: '30px' }} >New Employee</label>
                            <div style={{ marginTop: '20px' }} >
                                <label>Please fill out the form below to create a new employee</label>
                            </div>
                        </div>
                    </Paper>
                    <Paper elevation={3} sx={{
                        backgroundColor: 'white',
                        marginTop: '20px',
                        padding: '25px',
                    }}>
                        <div style={{ marginTop: '25px' }} >
                            <label>First Name</label>
                        </div>
                        <div style={{ marginTop: '10px' }} className="Usernamediv">
                            <TextField
                                size="small"
                                value={updateFirstNameText}
                                onChange={updateFirstNameValue}
                                required
                            />
                        </div>
                        <div style={{ marginTop: '50px' }} >
                            <label>Last Name</label>
                        </div>
                        <div style={{ marginTop: '10px' }} className="Usernamediv">
                            <TextField
                                size="small"
                                value={updateLastNameText}
                                onChange={updateLastNameValue}
                                required
                            />
                        </div>
                        <div style={{ marginTop: '50px' }} >
                            <label>Company</label>
                        </div>
                        <div style={{ marginTop: '10px' }} className="Usernamediv">
                            <TextField
                                {...register("CurrentProjectName")}
                                size="small"
                                value={updateCompanyNameText}
                                onChange={updateCompanyNameValue}
                                required
                            />
                        </div>
                        <div style={{ marginTop: '50px' }} >
                            <label>Email Address</label>
                        </div>
                        <div style={{ marginTop: '10px' }} className="Usernamediv">
                            <TextField
                                {...register("EmailAddress")}
                                size="small"
                                value={updateEmailAddressText}
                                onChange={updateEmailAddressValue}
                                required
                            />
                        </div>

                        <div style={{ marginTop: '45px' }} >
                            <Button id="updateEmployee" sx={{ bgcolor: 'green', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'lightgreen' } }} onClick={validateandUpdateEmployeeDataOperation}  >Update Employee</Button>
                            <Button id="cancelOperation" sx={{ bgcolor: 'black', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'gray' } }} onClick={cancelEmployeeCreation} >Cancel</Button>
                        </div>
                    </Paper>
                </div>
            )
        }
    }

    return (
        checkAddEditCondition()
    );
}

