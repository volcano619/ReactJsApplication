import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestView from './pages/TestView';
import Login from './pages/Login';
import HomePage from './pages/HomePage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<TestView></TestView>}></Route> */}
                <Route path="/" element={<Login></Login>}></Route>
                <Route path='/homepage' element={<HomePage></HomePage>} />
            </Routes>
        </BrowserRouter>
    );
}
