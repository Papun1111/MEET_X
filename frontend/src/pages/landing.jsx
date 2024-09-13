import React from "react";
import "../App.css";
import {Link, useNavigate} from 'react-router-dom';
import "./landing.css"
export default function LandingPage() {
  const router=useNavigate();
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>Gusion Dagger Calls</h2>
        </div>
        <div className="navlist">
          <p onClick={()=>{
           router("/asdad");
          }}>Join as Guest</p>
          <p onClick={()=>{
            router("/auth");
          }}>Register</p>
          <p onClick={()=>{
            router("/home");
          }}>Home</p>
          <div role="button">
            <p onClick={()=>{
              router("/auth");
            }}>Log In</p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "#DA70D6" }}>Welcome</span> to Gusion Dagger
            Calls
          </h1>
          <p>Cover a distance by Gusion dagger calls</p>
          <div role="button">
            <Link to={"/auth"}>Get Started</Link>
          </div>
        </div>

        <div className="imgDisp">
          <img src="/videocall.png" alt="" />
        </div>
      </div>
    </div>
  );
}
