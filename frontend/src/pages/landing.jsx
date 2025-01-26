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
          <h2>Blue Link Saga</h2>
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
            <span style={{ color: "#DA70D6" }}>Welcome</span> to Blue Link Saga
          </h1>
          <p>Cover a distance by Blue Link Saga</p>
          <div role="button">
            <Link style={{textDecoration:"none"}} to={"/auth"}>Get Started</Link>
          </div>
        </div>

        <div className="imgDisp">
          <img src="/videocall.png" alt="" />
        </div>
      </div>
    </div>
  );
}
