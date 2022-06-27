import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestView from './TestView';
import Login from './Login';
import HomePage from "./HomePage";
import AddEditEmployee from './AddEditEmployee';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<TestView></TestView>}></Route> */}
                <Route path="/" element={<Login></Login>}></Route>
                <Route path='/homepage' element={<HomePage></HomePage>} />
                <Route path='/addemployee' element={<AddEditEmployee></AddEditEmployee>} ></Route>
            </Routes>
        </BrowserRouter>
    );
}
