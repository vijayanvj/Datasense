// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserForm from './UserForm';
import TableData from './TableData';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {!isLoggedIn && <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />}
        {isLoggedIn && <Route path="/userform" element={<UserForm />} />}
       <Route path="/table-data/:userId" element={<TableData />} />
      </Routes>
    </Router>
  );
};

export default App;
