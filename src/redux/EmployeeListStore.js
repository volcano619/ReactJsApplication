// store.js
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core';
import employeelistReducer from '../redux/EmployeeListSlice';
import saga from '../sagafiles/sagas';

let sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware]

export const store = configureStore({
  reducer: {
    employeelist: employeelistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
})

export default sagaMiddleware;
sagaMiddleware.run(saga)