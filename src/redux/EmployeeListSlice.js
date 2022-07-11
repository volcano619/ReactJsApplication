import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
    valueBackup: [],
    userLoggedIn: false,
    isRegistrationSuccessful: false,
    profileUserName: 'Admin',
    status: 'idle',
};

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

        doLogout: (state) => {
            state.status = 'idle';
            state.value = [];
            state.valueBackup = [];
            state.profileUserName = "Admin";
            state.userLoggedIn = false;
            sessionStorage.clear();
        },

        doLoginThunk: (state, action) => {
            state.status = 'finished';
            state.value = [];
            state.valueBackup = [];
            if (action.payload.loginUsername !== null) {
                state.profileUserName = action.payload.loginUsername
                state.userLoggedIn = true;
                sessionStorage.setItem('ProfileUserName', state.profileUserName);
                sessionStorage.setItem('LoginStatus', state.userLoggedIn);
            }
        },

        doUserRegistrationThunk: (state, action) => {
            state.status = 'finished';
            state.value = [];
            state.valueBackup = [];
            if (action.payload) {
                state.isRegistrationSuccessful = true
            }
        },

        fetchEmployeesThunk: (state, action) => {
            state.value = action.payload;
            state.valueBackup = action.payload;
            state.status = 'finished';
        },

        addEmployeeThunk: (state, action) => {
            state.status = 'finished';
            if (action.payload !== null) {
                state.value.push(action.payload);
                state.valueBackup.push(action.payload);
            }
        },

        updateEmployeeThunk: (state, action) => {
            state.status = 'finished';
            const updatedEmployeeList = arrayUpdate(state.valueBackup, action.payload);
            if (updatedEmployeeList.length > 0) {
                state.value = updatedEmployeeList;
                state.valueBackup = updatedEmployeeList;
            }
            else {
                state.value = state.valueBackup;
            }
        },

        deleteEmployeeThunk: (state, action) => {
            state.status = 'finished';
            const updatedEmployeeList = arrayRemove(state.valueBackup, action.payload);
            if (updatedEmployeeList.length > 0) {
                state.value = updatedEmployeeList;
                state.valueBackup = updatedEmployeeList;
            }
            else {
                state.value = state.valueBackup;
            }
        },
    },
});

export const getEmployeeListData = (state) => state.employeelist.value;
export const getEmployeeSearchData = (state) => state.employeelist.searchedItem;
export const getUserProfileUsername = (state) => state.employeelist.profileUserName;
export const getUserLoggedInStatus = (state) => state.employeelist.userLoggedIn;
export const getUserRegistrationnStatus = (state) => state.employeelist.isRegistrationSuccessful;

export const { doLoginThunk, doUserRegistrationThunk, fetchEmployeesThunk, addEmployeeThunk, updateEmployeeThunk, deleteEmployeeThunk, doLogout } = EmployeeListSlice.actions;
export default EmployeeListSlice.reducer;