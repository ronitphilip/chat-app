import React from 'react'
import '../App.css'
import logo from '../assets/logo.png'

const SplashScreen = () => {
    return (
      <>
          <div style={{minHeight:'100vh'}} className='gradient-bg d-flex flex-column justify-content-center align-items-center'>
            <img className="animated-logo" src={logo} alt="logo" />
            <h1 className='animated-text text-light'>Welcome to My Website</h1>
          </div>
      </>
    )
  }

export default SplashScreen