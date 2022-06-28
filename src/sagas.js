import { call, put, takeEvery } from '@redux-saga/core/effects';
import Axios from 'axios';
import { addEmployeeThunk, deleteEmployeeThunk, doLoginThunk, doLogout, doUserRegistrationThunk, fetchEmployeesThunk, updateEmployeeSearch, updateEmployeeThunk } from './EmployeeListSlice';
import { sagaActions } from './sagaActions';

let callAPI = async ({ url, method, data }) => {
    return await Axios({
        url,
        method,
        data,
        headers: { "Content-Type": "application/json" }
    })
}

export function* fetchEmployeesSaga() {
    try {
        let result = yield call(() =>
            callAPI({
                url: 'https://localhost:7168/Employee/GetEmployeeList',
            })
        )
        yield put(fetchEmployeesThunk(result.data))
    } catch (e) {
        yield put({ type: 'API_CALL_FAILED' })
    }
}

export function* addEmployeeSaga(addEmployeeRequestData) {
    try {
        let result = yield call(() =>
            callAPI({
                url: 'https://localhost:7168/Employee/AddEmployee', method: 'POST', data: addEmployeeRequestData.requestData
            })
        )
        yield put(addEmployeeThunk(result.data))
    } catch (e) {
        yield put({ type: 'API_CALL_FAILED' })
    }
}

export function* updateEmployeeSaga(updateEmployeeRequestData) {
    try {
        let result = yield call(() =>
            callAPI({
                url: 'https://localhost:7168/Employee/UpdateEmployee', method: 'POST', data: updateEmployeeRequestData.requestData
            })
        )
        yield put(updateEmployeeThunk(result.data))
    } catch (e) {
        yield put({ type: 'API_CALL_FAILED' })
    }
}

export function* deleteEmployeeSaga(employeeDeleteRequest) {
    try {
        let result = yield call(() =>
            callAPI({
                url: 'https://localhost:7168/Employee/DeleteEmployee?id=' + employeeDeleteRequest.requestData, method: 'DELETE',
            })
        )
        yield put(deleteEmployeeThunk(result.data))
    } catch (e) {
        yield put({ type: 'API_CALL_FAILED' })
    }
}

export function* doLoginSaga(loginUserData) {
    try {
        let result = yield call(() =>
            callAPI({
                url: 'https://localhost:7168/Employee/DoLogin', method: 'POST', data: loginUserData.requestData,
            })
        )
        yield put(doLoginThunk(result.data))
    } catch (e) {
        yield put({ type: 'API_CALL_FAILED' })
    }
}

export function* doUserRegistrationSaga(registrationUserData) {
    try {
        let result = yield call(() =>
            callAPI({
                url: 'https://localhost:7168/Employee/DoLogin', method: 'POST', data: registrationUserData.requestData,
            })
        )
        yield put(doUserRegistrationThunk(result.data))
    } catch (e) {
        yield put({ type: 'API_CALL_FAILED' })
    }
}

export function* employeeSearchSaga(employeeSearchRequest) {
    yield put(updateEmployeeSearch(employeeSearchRequest.requestData));
}

export function* doLogoutSaga() {
    yield put(doLogout());
}

export default function* rootSaga() {

    yield takeEvery(sagaActions.FETCH_EMPLOYEE_SAGA, fetchEmployeesSaga)
    yield takeEvery(sagaActions.ADD_EMPLOYEE_SAGA, addEmployeeSaga)
    yield takeEvery(sagaActions.UPDATE_EMPLOYEE_SAGA, updateEmployeeSaga)
    yield takeEvery(sagaActions.DELETE_EMPLOYEE_SAGA, deleteEmployeeSaga)
    yield takeEvery(sagaActions.DO_LOGIN_SAGA, doLoginSaga)
    yield takeEvery(sagaActions.DO_LOGOUT_SAGA, doLogoutSaga)
    yield takeEvery(sagaActions.DO_REGISTRATION_SAGA, doUserRegistrationSaga)
    yield takeEvery(sagaActions.SEARCH_EMPLOYEE_SAGA, employeeSearchSaga)
}