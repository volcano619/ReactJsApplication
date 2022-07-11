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
import { TextField, Button, Paper, Tooltip, Menu, Avatar, MenuItem, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import * as yup from "yup";
import { sagaActions } from "../sagafiles/sagaActions";

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
  const ProfileUserName = sessionStorage.getItem('ProfileUserName');
  const { register, handleSubmit, setValue } = useForm();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [firstNameHelperText, setfirstNameHelperText] = useState();
  const [firstNameErrorStatus, setfirstNameErrorStatus] = useState();
  const [lastNameHelperText, setlastNameHelperText] = useState();
  const [lastNameErrorStatus, setlastNameErrorStatus] = useState();
  const [companyNameHelperText, setcompanyNameHelperText] = useState();
  const [companyNameErrorStatus, setcompanyNameErrorStatus] = useState();
  const [emailAddressHelperText, setemailAddressHelperText] = useState();
  const [emailAddressErrorStatus, setemailAddressErrorStatus] = useState();
  const [selectionModel, setSelectionModel] = React.useState([]);
  // const [firstNameLabelText, setfirstNameLabelText] = useState();
  // const [lastNameLabelText, setlastNameLabelText] = useState();
  // const [companyNameLabelText, setcompanyNameLabelText] = useState();
  // const [emailAddressLabelText, setemailAddressLabelText] = useState();

  const handleDialogClickOpen = (employeeId) => {
    setSelectionModel(employeeId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const editClickedEmployee = (employeeId) => {
    setButtonText("Update Employee");
    setSelectionModel(employeeId);
    const filteredEmployeeDetail = fetchClickedEmployeeDetail(employeeId);
    setFilteredEmployeeDetailId(filteredEmployeeDetail[0].employeeId);
    setValue("FirstName", filteredEmployeeDetail[0].firstName);
    setValue("LastName", filteredEmployeeDetail[0].lastName);
    setValue("EmailAddress", filteredEmployeeDetail[0].emailAddress);
    setValue("CompanyName", filteredEmployeeDetail[0].currentProjectName);
    handleDrawerOpen();
  }

  const deleteClickedEmployee = async (employeeId) => {
    dispatch({ type: sagaActions.DELETE_EMPLOYEE_SAGA, requestData: employeeId });
    handleDialogClose();
  }

  const renderDetailsButton = (params) => {
    return (
      <strong>
        <div>
          <Tooltip title="Edit employee">
            <IconButton onClick={() => { editClickedEmployee(params.row.employeeId); }} >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete employee">
            <IconButton onClick={() => { handleDialogClickOpen(params.row.employeeId); }}>
              <DeleteForeverIcon />
            </IconButton>
          </Tooltip>
          <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Employee"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Do you like to delete this employee?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { handleDialogClose(); setSelectionModel([]); }}>No</Button>
              <Button onClick={() => { deleteClickedEmployee(params.row.employeeId); setSelectionModel([]); }} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </strong>
    )
  }

  const columns = [
    { field: 'employeeId', headerName: 'Employee ID', width: 150 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
    },
    {
      field: 'currentProjectName',
      headerName: 'Company Name',
      width: 150,
    },
    {
      field: 'emailAddress',
      headerName: 'Email Address',
      width: 250,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 150,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: renderDetailsButton,
      cellClassName: 'actions',
    },
  ];

  const validEmployeeSchema = yup.object().shape({
    FirstName: yup.string().required(),
    LastName: yup.string().required(),
    CompanyName: yup.string().required(),
    EmailAddress: yup.string().email().required(),
  })

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (event) => {
    if (event.currentTarget.id === 'Logout') {
      dispatch({ type: sagaActions.DO_LOGOUT_SAGA });
      setAnchorElUser(null);
      if (!UserLoggedIn) {
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
    dispatch({ type: sagaActions.FETCH_EMPLOYEE_SAGA })
  }, []);

  const validateandAddEmployeeDataOperation = async (addEmployeeRequestData) => {
    console.log(addEmployeeRequestData);
    const validationOutput = await validEmployeeSchema.validate(addEmployeeRequestData, { abortEarly: false }).catch((error) => {
      // eslint-disable-next-line array-callback-return
      error.errors.map((errorMessage) => {
        if (errorMessage.toLowerCase().includes('firstname')) {
          setfirstNameHelperText('Please check the first name');
          setfirstNameErrorStatus(true);
        }
        else if (errorMessage.toLowerCase().includes('lastname')) {
          setlastNameHelperText('Please check the last name');
          setlastNameErrorStatus(true);
        }
        else if (errorMessage.toLowerCase().includes('companyname')) {
          setcompanyNameHelperText('Please check the company name');
          setcompanyNameErrorStatus(true);
        }
        else if (errorMessage.toLowerCase().includes('emailaddress')) {
          setemailAddressHelperText('Please check the email address');
          setemailAddressErrorStatus(true);
        }
      });
    });
    if (validationOutput !== undefined) {
      setfirstNameHelperText('');
      setfirstNameErrorStatus(false);
      setlastNameHelperText('');
      setlastNameErrorStatus(false);
      setcompanyNameHelperText('');
      setcompanyNameErrorStatus(false);
      setemailAddressHelperText('');
      setemailAddressErrorStatus(false);
      dispatch({ type: sagaActions.ADD_EMPLOYEE_SAGA, requestData: JSON.stringify({ FirstName: addEmployeeRequestData.FirstName, LastName: addEmployeeRequestData.LastName, EmailAddress: addEmployeeRequestData.EmailAddress, CurrentProjectName: addEmployeeRequestData.CompanyName }) });
      setButtonText("Add Employee");
      setValue("FirstName", "");
      setValue("LastName", "");
      setValue("EmailAddress", "");
      setValue("CompanyName", "");
      handleDrawerClose();
    }
  }

  const validateandUpdateEmployeeDataOperation = async (updateEmployeeRequestData) => {
    const validationOutput = await validEmployeeSchema.validate(updateEmployeeRequestData).catch((error) => {
      if (error.errors[0].toLowerCase().includes('firstname')) {
        setfirstNameHelperText('Please check the first name');
        setfirstNameErrorStatus(true);
      }
      else if (error.errors[0].toLowerCase().includes('lastname')) {
        setlastNameHelperText('Please check the last name');
        setlastNameErrorStatus(true);
      }
      else if (error.errors[0].toLowerCase().includes('companyname')) {
        setcompanyNameHelperText('Please check the company name');
        setcompanyNameErrorStatus(true);
      }
      else if (error.errors[0].toLowerCase().includes('emailaddress')) {
        setemailAddressHelperText('Please check the email address');
        setemailAddressErrorStatus(true);
      }
    });
    if (validationOutput !== undefined) {
      setfirstNameHelperText('');
      setfirstNameErrorStatus(false);
      setlastNameHelperText('');
      setlastNameErrorStatus(false);
      setcompanyNameHelperText('');
      setcompanyNameErrorStatus(false);
      setemailAddressHelperText('');
      setemailAddressErrorStatus(false);
      updateEmployeeRequestData.employeeId = filteredEmployeeDetailId;
      dispatch({ type: sagaActions.UPDATE_EMPLOYEE_SAGA, requestData: JSON.stringify({ EmployeeId: updateEmployeeRequestData.employeeId, FirstName: updateEmployeeRequestData.FirstName, LastName: updateEmployeeRequestData.LastName, EmailAddress: updateEmployeeRequestData.EmailAddress, CurrentProjectName: updateEmployeeRequestData.CompanyName }) });
      setButtonText("Add Employee");
      setValue("FirstName", "");
      setValue("LastName", "");
      setValue("EmailAddress", "");
      setValue("CompanyName", "");
      setSelectionModel([]);
      handleDrawerClose();
    }
  }

  const cancelEmployeeCreation = (event) => {
    setfirstNameHelperText('');
    setfirstNameErrorStatus(false);
    setlastNameHelperText('');
    setlastNameErrorStatus(false);
    setcompanyNameHelperText('');
    setcompanyNameErrorStatus(false);
    setemailAddressHelperText('');
    setemailAddressErrorStatus(false);
    setButtonText("Add Employee");
    setValue("FirstName", "");
    setValue("LastName", "");
    setValue("EmailAddress", "");
    setValue("CompanyName", "");
    setSelectionModel([]);
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
          <Paper elevation={1} sx={{
            backgroundColor: 'white',
            marginTop: '10px',
            padding: '25px',
          }}>
            <div>
              <label style={{ fontSize: '30px' }} >{buttonText === 'Add Employee' ? 'New Employee' : 'Update Employee'}</label>
              <div style={{ marginTop: '10px' }} >
                <label>{buttonText === 'Add Employee' ? 'Please fill out the form below to create a new employee' : 'Please Update the relevant information to update the employee details'}</label>
              </div>
            </div>
          </Paper>
          <Grid sx={{
            backgroundColor: 'white',
            marginTop: '10px',
            padding: '25px',
          }}>
            <div style={{ marginTop: '10px' }} >
              <label>First Name</label>
            </div>
            <div style={{ marginTop: '10px' }} className="Usernamediv">
              <TextField
                {...register("FirstName")}
                label={buttonText === "Add Employee" ? "Enter First Name" : ""}
                size="small"
                required
                helperText={firstNameHelperText}
                error={firstNameErrorStatus}
              />
            </div>
            <div style={{ marginTop: '25px' }} >
              <label>Last Name</label>
            </div>
            <div style={{ marginTop: '10px' }} className="Usernamediv">
              <TextField
                {...register("LastName")}
                label={buttonText === "Add Employee" ? "Enter Last Name" : ""}
                size="small"
                required
                helperText={lastNameHelperText}
                error={lastNameErrorStatus}
              />
            </div>
            <div style={{ marginTop: '25px' }} >
              <label>Company</label>
            </div>
            <div style={{ marginTop: '10px' }} className="Usernamediv">
              <TextField
                {...register("CompanyName")}
                label={buttonText === "Add Employee" ? "Enter Company Name" : ""}
                size="small"
                required
                helperText={companyNameHelperText}
                error={companyNameErrorStatus}
              />
            </div>
            <div style={{ marginTop: '25px' }} >
              <label>Email Address</label>
            </div>
            <div style={{ marginTop: '10px' }} className="Usernamediv">
              <TextField
                {...register("EmailAddress")}
                label={buttonText === "Add Employee" ? "Enter Email Address" : ""}
                size="small"
                required
                helperText={emailAddressHelperText}
                error={emailAddressErrorStatus}
              />
            </div>

            <div style={{ marginTop: '40px' }} >
              <Button id={buttonText} sx={{ bgcolor: 'green', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'lightgreen' } }} onClick={handleSubmit(addEditButtonClicked)} >{buttonText}</Button>
              <Button id="cancelOperation" sx={{ bgcolor: 'black', color: 'white', padding: '10px', marginLeft: '30px', '&:hover': { bgcolor: 'gray' } }} onClick={cancelEmployeeCreation}>Cancel</Button>
            </div>
          </Grid>
        </div>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <div sx={{ display: "flex", flexDirection: "column", alignItems: "center", }} >
          <Box sx={{ height: 400, width: '75%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              getRowId={(row) => row.employeeId}
              rowsPerPageOptions={[5]}
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              selectionModel={selectionModel}
            />
          </Box>
        </div >
      </Main>
    </Box>
  );
}