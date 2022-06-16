import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Grid, TextField, Button, Paper } from "@mui/material";
import "./App.css";
import ky from 'ky';

export default function NewEmployee() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const validEmail = new RegExp(
        '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
    );

    const validateDataOperation = async (addEmployeeRequestData) => {
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

    const cancelEmployeeCreation = (event) => {
        navigate('../homepage', { state: { ProfileUserName: "Testing" } });
    }

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
                        id="outlined-size-small"
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
                        id="outlined-size-small"
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
                        id="outlined-size-small"
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
                        id="outlined-size-small"
                        size="small"
                        required
                    />
                </div>

                <div style={{ marginTop: '45px' }} >
                    <Button id="addEmployee" sx={{ bgcolor: 'green', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'lightgreen' } }} onClick={handleSubmit(validateDataOperation)}  >Add Employee</Button>
                    <Button id="cancelOperation" sx={{ bgcolor: 'black', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'gray' } }} onClick={cancelEmployeeCreation} >Cancel</Button>
                </div>
            </Paper>
        </div>
    );
}

