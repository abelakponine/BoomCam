import React from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import './styles/style.css';
import './styles/boomCam.css';
import CreateNewPostWidget from './components/CreateNewPostWidget';
import {hide_create_new_post} from "./js/functions.js";



function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<CreateNewPostWidget closeAction={hide_create_new_post}/>}/>
            </Routes>
        </Router>
    )
}

export default App;
