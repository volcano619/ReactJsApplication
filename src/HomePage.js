import React, { useEffect, useState } from "react";
import "./App.css";
import { TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import CustomAppBar from "./CustomAppBar";
import { useNavigate, useLocation } from "react-router-dom";
import ky from 'ky';

export default function HomePage() {
  const location = useLocation();
  const [tempRows, setTempRows] = useState([]);
  const [rows, setTableRows] = useState([]);

  const getEmployeeData = async () => {
    const responseJson = await ky.get('https://localhost:7168/Employee/GetEmployeeList', {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
      }
    }).json();
    setTempRows(responseJson);
    setTableRows(responseJson);
  }

  const arraySearch = (array, keyword) => {
    const searchTerm = keyword.toLowerCase()
    return array.filter(value => {
      return value.firstName.toLowerCase().match(new RegExp(searchTerm, 'g')) ||
        value.lastName.toLowerCase().match(new RegExp(searchTerm, 'g'))
    })
  }

  const searchTextValueChanged = (event) => {
    const searchTextChangeValue = event.target.value
    if (searchTextChangeValue.length >= 2) {
      const searchItems = arraySearch(rows, searchTextChangeValue)
      setTableRows(searchItems);
    }
    else {
      setTableRows(tempRows);
    }
  }

  useEffect(() => {
    getEmployeeData();
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        {/* <ResponsiveAppBar profileUsernameText={location.state.ProfileUserName} /> */}
        <CustomAppBar isHomePage='true' profileUsername={location.state.ProfileUserName} ></CustomAppBar>
        <TextField onChange={searchTextValueChanged} id="outlined-size-small"
          size="small" label="Search field" type="search" />
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

