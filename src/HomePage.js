import React, { useEffect, useState } from "react";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TextField, Button, Paper, TableBody, Table, TableHead, TableContainer, TableCell, TableRow, Tooltip, Menu, Avatar, MenuItem } from '@mui/material';
import { DeleteForever, Edit } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import * as yup from "yup";
import { fetchEmployeesThunk, addEmployeeThunk, updateEmployeeThunk, deleteEmployeeThunk, updateEmployeeSearch, doLogout } from "./EmployeeListSlice";


const drawerWidth = 480;


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


export default function HomePage() {

  const pages = ['Add Employee'];
  const settings = ['Logout'];
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Add Employee");
  const navigate = useNavigate();
  const [filteredEmployeeDetailId, setFilteredEmployeeDetailId] = useState();
  const dispatch = useDispatch();
  const rows = useSelector((state) => state.employeelist.value);
  const UserLoggedIn = useSelector((state) => state.employeelist.userLoggedIn);
  const ProfileUserName = useSelector((state) => state.employeelist.profileUserName);
  const { register, handleSubmit, setValue } = useForm();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const validEmployeeSchema = yup.object().shape({
    FirstName: yup.string().required(),
    LastName: yup.string().required(),
    CurrentProjectName: yup.string().required(),
    EmailAddress: yup.string().email().required(),
  })

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (event) => {
    if (event.currentTarget.id === 'Logout') {
      dispatch(doLogout());
      setAnchorElUser(null);
      if(!UserLoggedIn){
        navigate('../')
      }
    }
    else {
      setAnchorElUser(null);
    }
  };

  const menuOptionClicked = (event) => {
    if (event.currentTarget.id === 'Add Employee') {
      handleDrawerOpen();
    }
    else if (event.currentTarget.id === 'homepage') {
      handleDrawerClose();
      navigate('../homepage')
    }
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(fetchEmployeesThunk());
  },[]);

  const searchTextValueChanged = (event) => {
    dispatch(updateEmployeeSearch(event.target.value))
  }

  const editClickedEmployee = (event) => {
    setButtonText("Update Employee");
    const filteredEmployeeDetail = fetchClickedEmployeeDetail(event.currentTarget.id);
    setFilteredEmployeeDetailId(filteredEmployeeDetail[0].employeeId);
    setValue("FirstName", filteredEmployeeDetail[0].firstName);
    setValue("LastName", filteredEmployeeDetail[0].lastName);
    setValue("EmailAddress", filteredEmployeeDetail[0].emailAddress);
    setValue("CurrentProjectName", filteredEmployeeDetail[0].currentProjectName);
    handleDrawerOpen();
  }

  const deleteClickedEmployee = async (event) => {
    dispatch(deleteEmployeeThunk(event.currentTarget.id));
  }

  const validateandAddEmployeeDataOperation = async (addEmployeeRequestData) => {
    const isValidEmployee = await validEmployeeSchema.isValid(addEmployeeRequestData)
    if (isValidEmployee) {
      dispatch(addEmployeeThunk(addEmployeeRequestData));
      setButtonText("Add Employee");
      setValue("FirstName", "");
      setValue("LastName", "");
      setValue("EmailAddress", "");
      setValue("CurrentProjectName", "");
      handleDrawerClose();
    }
    else {
      alert("Please check the information entered")
    }
  }

  const validateandUpdateEmployeeDataOperation = async (updateEmployeeRequestData) => {
    const isValidEmployee = await validEmployeeSchema.isValid(updateEmployeeRequestData)
    if (isValidEmployee) {
      updateEmployeeRequestData.employeeId = filteredEmployeeDetailId;
      dispatch(updateEmployeeThunk(updateEmployeeRequestData));
      setButtonText("Add Employee");
      setValue("FirstName", "");
      setValue("LastName", "");
      setValue("EmailAddress", "");
      setValue("CurrentProjectName", "");
      handleDrawerClose();
     }
    else {
      alert("Please check the information entered")
    }
  }

  const cancelEmployeeCreation = (event) => {
    setButtonText("Add Employee");
    setValue("FirstName", "");
    setValue("LastName", "");
    setValue("EmailAddress", "");
    setValue("CurrentProjectName", "");
    handleDrawerClose();
  }

  const fetchClickedEmployeeDetail = (clickedEmployeeId) => {
    const filteredEmployeeDetail = rows.filter(
      (item) => item.employeeId === parseInt(clickedEmployeeId)
    );
    return filteredEmployeeDetail;
  }

  const addEditButtonClicked = (addEditEmployeedata) => {
    buttonText === "Add Employee" ? validateandAddEmployeeDataOperation(addEditEmployeedata) : validateandUpdateEmployeeDataOperation(addEditEmployeedata);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar className="App-toolbar-div" >
          <Toolbar className="App-Toolbar" >
            <Button id="homepage" onClick={menuOptionClicked} sx={{ bgcolor: 'black', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'black' } }} >Home</Button>
            {pages.map((menuOption) => (
              <Button id={menuOption} onClick={menuOptionClicked} sx={{ bgcolor: 'green', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'lightgreen' } }} >{menuOption}</Button>
            ))}
          </Toolbar>
          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: 'green' }} alt={ProfileUserName} src="/src/user.png" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} id={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <div sx={{ display: "flex", flexDirection: "column", alignItems: "center", }} >
          <Paper elevation={3} sx={{
            backgroundColor: 'white',
            marginTop: '20px',
            padding: '25px',
          }}>
            <div>
              <label style={{ fontSize: '30px' }} >{buttonText === 'Add Employee' ? 'New Employee' : 'Update Employee'}</label>
              <div style={{ marginTop: '20px' }} >
                <label>{buttonText === 'Add Employee' ? 'Please fill out the form below to create a new employee' : 'Please Update the relevant information to update the employee details'}</label>
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
                label={buttonText === "Add Employee" ? "Enter First Name" : ""}
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
                label={buttonText === "Add Employee" ? "Enter Last Name" : ""}
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
                label={buttonText === "Add Employee" ? "Enter Company Name" : ""}
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
                label={buttonText === "Add Employee" ? "Enter Email Address" : ""}
                size="small"
                required
              />
            </div>

            <div style={{ marginTop: '45px' }} >
              <Button id={buttonText} sx={{ bgcolor: 'green', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'lightgreen' } }} onClick={handleSubmit(addEditButtonClicked)} >{buttonText}</Button>
              <Button id="cancelOperation" sx={{ bgcolor: 'black', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'gray' } }} onClick={cancelEmployeeCreation}>Cancel</Button>
            </div>
          </Paper>
        </div>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <div>
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
                  <TableRow>
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
                        <Tooltip title="Edit employee">
                          <IconButton id={row.employeeId} onClick={editClickedEmployee} >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete employee">
                          <IconButton id={row.employeeId} onClick={deleteClickedEmployee}>
                            <DeleteForever />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div >
      </Main>
    </Box>
  );
}