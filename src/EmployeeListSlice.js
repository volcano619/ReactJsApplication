import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    value: [],
    valueBackup: [],
    userLoggedIn: false,
    isRegistrationSuccessful: false,
    profileUserName: 'Admin',
    status: 'idle',
};

export const doLoginThunk = createAsyncThunk(
    'employeelist/doLoginThunk',
    async (loginUserData) => {
        const res = await axios.post('https://localhost:7168/Employee/DoLogin', loginUserData).then(
            (result) => result.data
        )
        return res;
    })

export const doUserRegistrationThunk = createAsyncThunk(
    'employeelist/doUserRegistrationThunk',
    async (registrationUserData) => {
        const res = await axios.post('https://localhost:7168/Employee/RegisterAdminUser', registrationUserData).then(
            (result) => result.data
        )
        return res;
    })

export const fetchEmployeesThunk = createAsyncThunk(
    'employeelist/fetchEmployeesThunk',
    async () => {
        const res = await axios.get('https://localhost:7168/Employee/GetEmployeeList').then(
            (result) => result.data
        )
        return res;
    })

export const addEmployeeThunk = createAsyncThunk(
    'employeelist/addEmployeeThunk',
    async (addEmployeeRequestData) => {
        const res = await axios.post('https://localhost:7168/Employee/AddEmployee', addEmployeeRequestData).then(
            (result) => result.data
        )
        if (res !== null) {
            return res;
        }
    })

export const deleteEmployeeThunk = createAsyncThunk(
    'employeelist/deleteEmployeeThunk',
    async (employeeId) => {
        const res = await axios.delete('https://localhost:7168/Employee/DeleteEmployee?id=' + employeeId).then(
            (result) => result.data
        )
        return res;
    })

export const updateEmployeeThunk = createAsyncThunk(
    'employeelist/updateEmployeeThunk',
    async (updateEmployeeRequestData) => {
        const res = await axios.post('https://localhost:7168/Employee/UpdateEmployee', updateEmployeeRequestData).then(
            (result) => result.data
        )
        return res;
    })

export const arraySearch = (array, keyword) => {
    const searchTerm = keyword.toLowerCase()
    return array.filter(value => {
        return value.firstName.toLowerCase().match(new RegExp(searchTerm, 'g')) ||
            value.lastName.toLowerCase().match(new RegExp(searchTerm, 'g'))
    })
}

export const arrayUpdate = (arr, updatedItem) => {
    return arr.map(item => {
        if (item.employeeId === updatedItem.employeeId) {
            return { ...item, firstName: updatedItem.firstName, lastName: updatedItem.lastName, emailAddress: updatedItem.emailAddress, currentProjectName: updatedItem.currentProjectName };
        }
        return item;
    });
}

export const arrayRemove = (arr, value) => {
    return arr.filter(item => {
        return item.employeeId !== value;
    });
}

export const EmployeeListSlice = createSlice({
    name: "employeelist",
    initialState: initialState,

    reducers: {
        updateEmployeeSearch: (state, action) => {
            try {
                const searchTextChangeValue = action.payload;
                if (searchTextChangeValue.length > 2) {
                    const searchItems = arraySearch(state.valueBackup, searchTextChangeValue)
                    if (searchItems.length > 0) {
                        state.value = searchItems;
                    }
                }
                else if (searchTextChangeValue.length === 0) {
                    state.value = state.valueBackup;
                }
            }
            catch (e) {
                console.log(e);
            }
        },

        doLogout: (state) => {
            state.status = 'idle';
            state.value = [];
            state.valueBackup = [];
            state.profileUserName = "Admin";
            state.userLoggedIn = false;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(doLoginThunk.pending, (state, action) => {
                state.status = 'idle';
                state.value = [];
            })

            .addCase(doLoginThunk.fulfilled, (state, action) => {
                state.status = 'finished';
                state.value = [];
                state.valueBackup = [];
                if (action.payload.loginUsername !== null) {
                    state.profileUserName = action.payload.loginUsername
                    state.userLoggedIn = true;
                }
            })

            .addCase(doUserRegistrationThunk.pending, (state, action) => {
                state.status = 'idle';
                state.value = [];
            })

            .addCase(doUserRegistrationThunk.fulfilled, (state, action) => {
                state.status = 'finished';
                state.value = [];
                state.valueBackup = [];
                if (action.payload) {
                    state.isRegistrationSuccessful = true
                }
            })

            .addCase(fetchEmployeesThunk.pending, (state, action) => {
                state.status = 'idle';
                state.value = [];
            })
            .addCase(fetchEmployeesThunk.fulfilled, (state, action) => {
                state.value = action.payload;
                state.valueBackup = action.payload;
                state.status = 'finished';
            })
            .addCase(addEmployeeThunk.pending, (state, action) => {
                state.status = 'idle';
            })

            .addCase(addEmployeeThunk.fulfilled, (state, action) => {
                state.status = 'finished';
                if (action.payload !== null) {
                    state.value.push(action.payload);
                    state.valueBackup.push(action.payload);
                }
            })

            .addCase(updateEmployeeThunk.pending, (state, action) => {
                state.status = 'idle';
            })

            .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
                state.status = 'finished';
                const updatedEmployeeList = arrayUpdate(state.valueBackup, action.payload);
                if (updatedEmployeeList.length > 0) {
                    state.value = updatedEmployeeList;
                    state.valueBackup = updatedEmployeeList;
                }
                else {
                    state.value = state.valueBackup;
                }
            })

            .addCase(deleteEmployeeThunk.pending, (state, action) => {
                state.status = 'idle';
            })

            .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
                state.status = 'finished';
                const updatedEmployeeList = arrayRemove(state.valueBackup, action.payload);
                if (updatedEmployeeList.length > 0) {
                    state.value = updatedEmployeeList;
                    state.valueBackup = updatedEmployeeList;
                }
                else {
                    state.value = state.valueBackup;
                }
            })
    },
});

export const getEmployeeListData = (state) => state.employeelist.value;
export const getEmployeeSearchData = (state) => state.employeelist.searchedItem;
export const getUserProfileUsername = (state) => state.employeelist.profileUserName;
export const getUserLoggedInStatus = (state) => state.employeelist.userLoggedIn;
export const getUserRegistrationnStatus = (state) => state.employeelist.isRegistrationSuccessful;

export const { updateEmployeeSearch, doLogout } = EmployeeListSlice.actions;
export default EmployeeListSlice.reducer;