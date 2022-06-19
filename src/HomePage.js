import React, { useEffect, useState } from "react";
import "./App.css";
import { TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";
import { DeleteForever, Edit } from '@mui/icons-material';
import CustomAppBar from "./CustomAppBar";
import { useNavigate, useLocation } from "react-router-dom";
import ky from 'ky';

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
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

  useEffect(() => {
    getEmployeeData();
  }, []);

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

  const editClickedEmployee = (event) => {
    const filteredEmployeeDetail = fetchClickedEmployeeDetail(event.currentTarget.id)
    navigate('../addemployee', { state: { editEmployeeData: filteredEmployeeDetail } })
  }

  const deleteClickedEmployee = async (event) => {
    const responseJson = await ky.delete('https://localhost:7168/Employee/DeleteEmployee?id=' + event.currentTarget.id, {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
      }
    }).json();
    if (responseJson) {
      getEmployeeData();
    }
    else {
      alert("Something Went wrong, please try again")
    }
  }

  const fetchClickedEmployeeDetail = (clickedEmployeeId) => {
    const filteredEmployeeDetail = rows.filter(
      (item) => item.employeeId === parseInt(clickedEmployeeId)
    );
    return filteredEmployeeDetail;
  }

  return (
    <div>
      <header className="App-header">
        <CustomAppBar isHomePage='true' profileUsername={location.state.ProfileUserName ? location.state.ProfileUserName : "Admin"} ></CustomAppBar>
        <TextField sx={{ alignSelf: "end", margin: "10px" }} onChange={searchTextValueChanged}
          size="small" label="Search field" type="search" />
        <TableContainer component={Paper}>
          <Table aria-label="simple table" >
            <TableHead>
              <TableRow>
                <TableCell align="right" >First Name</TableCell>
                <TableCell align="right">Last Name</TableCell>
                <TableCell align="right">Company</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right" >Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow >
                  <TableCell align="right" component="th" scope="row">
                    {row.firstName}
                  </TableCell>
                  <TableCell align="right" >
                    {row.lastName}
                  </TableCell>
                  <TableCell align="right">{row.currentProjectName}</TableCell>
                  <TableCell align="right">{row.emailAddress}</TableCell>
                  <TableCell align="right">
                    <div>
                      <IconButton id={row.employeeId} onClick={editClickedEmployee} >
                        <Edit />
                      </IconButton>
                      <IconButton id={row.employeeId} onClick={deleteClickedEmployee}>
                        <DeleteForever />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </header>
    </div >
  );
}

