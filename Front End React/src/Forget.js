import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const checkEmailInDatabase = async (email) => {
    try {
      const response = await axios.post('http://localhost:3005/api/login/check-email', { email });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    console.log('Forgot password button clicked');

    try {
      const emailExists = await checkEmailInDatabase(forgotPasswordEmail);
      if (emailExists) {
        setShowModal(true);
        setError('');
      } else {
        alert('Email not found in our database');
      }
    } catch (error) {
      setError('An error occurred while checking email');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h3>Forgot Password</h3>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          value={forgotPasswordEmail}
          onChange={(e) => setForgotPasswordEmail(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {showModal && <div className="modal">Modal Content</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Login;
