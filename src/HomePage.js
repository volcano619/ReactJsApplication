import React, { Component, useEffect, useState } from "react";
import "./App.css";
import logo from "./logo.svg";
import { Grid, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { useNavigate, useLocation } from "react-router-dom";
import ky from 'ky';

export default function HomePage() {
  const location = useLocation();
  const tempRows = [];
  const [rows, setTableRows] = useState([]);
  function createData(id, firstName, lastName, currentProjectName, emailAddress) {
    return { id, firstName, lastName, currentProjectName, emailAddress };
  }

  function createRows(responseData) {
    for (const [i, employeeData] of responseData.entries()) {
      tempRows.push(createData(responseData[i].employeeId, responseData[i].firstName, responseData[i].lastName, responseData[i].currentProjectName, responseData[i].emailAddress))
    }
    setTableRows(tempRows);
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
    setTableRows(responseJson);
  }

  useEffect(() => {
    alert("Hellow World")
    getEmployeeData();
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <ResponsiveAppBar profileUsernameText={location.state.ProfileUserName} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" >
            <TableHead >
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right" >First Name</TableCell>
                <TableCell align="right">Last Name</TableCell>
                <TableCell align="right">Company</TableCell>
                <TableCell align="right">Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow >
                  <TableCell align="right" component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="right" >
                    {row.firstName}
                  </TableCell>
                  <TableCell align="right" >
                    {row.lastName}
                  </TableCell>
                  <TableCell align="right">{row.currentProjectName}</TableCell>
                  <TableCell align="right">{row.emailAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </header>
    </div >
  );
}

