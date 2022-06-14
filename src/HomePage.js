import React, { Component, useEffect } from "react";
import "./App.css";
import logo from "./logo.svg";
import { Grid, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ResponsiveAppBar from "./AppHeader";
import { useNavigate, useLocation } from "react-router-dom";
import ky from 'ky';
import axios from 'axios';

function HomePage() {
  const location = useLocation();
  const rows = [];
  function createData(id, firstName, lastName, company, email) {
    return { id, firstName, lastName, company, email };
  }

  function createRows(responseData) {
    for (const [i, employeeData] of responseData.entries()) {
      rows.push(createData(employeeData.employeeId, employeeData.firstName, employeeData.lastName, employeeData.currentProjectName, employeeData.emailAddress, employeeData.isActive))
    }
  }

  const getEmployeeData = async () => {
    const responseJson = await ky.get('https://localhost:7168/Employee/GetEmployeeList', {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
      }
    }).json();
  }

  useEffect(() => {
    getEmployeeData();
  });


  return (
    <div className="App">
      <header className="App-header">
        <ResponsiveAppBar profileUsernameText={location.state.ProfileUserName} />
        <img className="App-logo" alt="" src={logo} height="300px" width="300px" />
        <Grid paddingLeft="55px" container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

        </Grid>
      </header>
    </div >
  );
}

export default HomePage;
