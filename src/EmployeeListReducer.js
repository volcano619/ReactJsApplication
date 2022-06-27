import { combineReducers } from "@reduxjs/toolkit";
import employeelistReducer from './EmployeeListSlice';

const rootReducer = combineReducers({
    employeelist: employeelistReducer
});

export default rootReducer;