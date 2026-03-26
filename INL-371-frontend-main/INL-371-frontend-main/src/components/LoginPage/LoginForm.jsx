import { useState } from 'react'
import './LoginForm.css'

function LoginForm() {
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isFocused, setIsFocused] = useState({ email: false, password: false })


/* --- REGISTER HANDLER --- */
const handleRegister = async () => {
    // Basic check to make sure the user didn't leave fields empty
    if (!email || !password) {
      alert("Please fill in both email and password to register.");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      if (response.ok) {
        alert("🎉 Registration Successful! You can now Sign In.");
      } else {
        const errText = await response.text();
        alert("Registration Failed: " + errText);
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Cannot reach server to register. Check your backend terminal!");
    }
  };

/* --- LOGIN HANDLER --- */
const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // This sends the email and password to your Node.js server
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }), // Sending role too!
      });

      const data = await response.json();

      if (response.ok) {
        // If the backend says YES
        alert(`Login Successful! Welcome back, ${role}.`);
        
        // Store the 'Token' so the browser remembers you are logged in
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', role);

        // Redirect to the dashboard (Update this path to your actual dashboard route)
        window.location.href = role === 'student' ? '/student-dashboard' : '/lecturer-dashboard';
      } else {
        // If the backend says NO (wrong password, user not found, etc.)
        alert(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      alert('Cannot reach the server. Make sure your Backend terminal says "MongoDB Connected"!');
    }
  };

  return (
    <div className="login-form__wrapper">
      <div className="login-form__role-toggle">
        <button
          type="button"
          className={`login-form__role-btn ${role === 'student' ? 'login-form__role-btn--active' : ''}`}
          onClick={() => setRole('student')}
        >
          Student
        </button>
        <button
          type="button"
          className={`login-form__role-btn ${role === 'lecturer' ? 'login-form__role-btn--active' : ''}`}
          onClick={() => setRole('lecturer')}
        >
          Lecturer
        </button>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form__field">
          <label htmlFor="email" className="login-form__label">
            {role === 'student' ? 'Student Email' : 'Lecturer Email'}
          </label>
          <div
            className={`login-form__input-wrap ${
              isFocused.email ? 'login-form__input-wrap--focused' : ''
            }`}
          >
            <input
              id="email"
              type="email"
              className="login-form__input"
              placeholder="name@belgiumcampus.ac.za"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused((f) => ({ ...f, email: true }))}
              onBlur={() => setIsFocused((f) => ({ ...f, email: false }))}
              autoComplete="email"
            />
            <span className="login-form__input-glow" />
          </div>
        </div>

        <div className="login-form__field">
          <label htmlFor="password" className="login-form__label">
            Password
          </label>
          <div
            className={`login-form__input-wrap ${
              isFocused.password ? 'login-form__input-wrap--focused' : ''
            }`}
          >
            <input
              id="password"
              type="password"
              className="login-form__input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsFocused((f) => ({ ...f, password: true }))}
              onBlur={() => setIsFocused((f) => ({ ...f, password: false }))}
              autoComplete="current-password"
            />
            <span className="login-form__input-glow" />
          </div>
          <a href="#" className="login-form__forgot">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="login-form__submit">
          <span className="login-form__submit-text">Sign In</span>
          <span className="login-form__submit-icon" />
        </button>

        {/* Register Button */}
        <button 
          type="button" 
          className="login-form__register-btn" 
          onClick={handleRegister}
        >
          <span className="login-form__submit-text">Create New Account</span>
        </button>

      </form>
    </div>
  )
  
}



export default LoginForm
