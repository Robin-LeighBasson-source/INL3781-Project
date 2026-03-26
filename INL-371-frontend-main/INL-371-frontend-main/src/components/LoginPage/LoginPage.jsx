import { useState, useEffect } from 'react'
import LoginForm from './LoginForm'
import './LoginPage.css'

function LoginPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setIsLoaded(true))
  }, [])

  return (
    <div className={`login-page ${isLoaded ? 'login-page--loaded' : ''}`}>
      <div className="login-page__bg">
        <div className="login-page__blob login-page__blob--1" />
        <div className="login-page__blob login-page__blob--2" />
        <div className="login-page__blob login-page__blob--3" />
        <div className="login-page__grid" />
      </div>

      <main className="login-page__main">
        <header className="login-page__header">
          <div className="login-page__logo">
            <img
              src="/BC-logo.svg"
              alt="Belgium Campus ITversity"
              className="login-page__logo-img"
            />
          </div>
          <h1 className="login-page__title">
            Student Success &amp; Risk Predictor
          </h1>
          <p className="login-page__subtitle">
            Sign in to access your predictive insights
          </p>
        </header>

        <LoginForm />
      </main>

      <footer className="login-page__footer">
        <p>© {new Date().getFullYear()} Belgium Campus ITversity</p>
      </footer>
    </div>
  )
}

export default LoginPage
