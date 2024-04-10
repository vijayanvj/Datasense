import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    const firstCharRegex = /^[^\s].*$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else if (!firstCharRegex.test(email)) {
      setEmailError('Email cannot start with a space');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,16}$/;

    if (!formData.password) {
      setPasswordError('Please enter the password');
    } else if (formData.password.length < 4 || formData.password.length > 16) {
      setPasswordError('Password should be between 4 and 16 characters');
    } else if (!passwordRegex.test(formData.password)) {
      setPasswordError('Invalid password format');
    } else {
      setPasswordError('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'email') {
      validateEmail(value);
    } else if (name === 'password') {
      validatePassword();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3005/api/login/newlogin', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Login successful');
      onLoginSuccess(); 
      navigate('/userform');
      console.log(response.data);
    } catch (error) {
      setLoginError('Invalid email or password');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center mb-4">Login</h3>
              {loginError && <div className="alert alert-danger">{loginError}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={() => validateEmail(formData.email)} />
                  {emailError && <div className="text-danger">{emailError}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleInputChange} onBlur={validatePassword}/>
                  {passwordError && <div className="text-danger">{passwordError}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
