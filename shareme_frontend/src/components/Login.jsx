import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    if (response.credential) {
      const decoded = jwtDecode(response.credential);
      console.log(decoded); // You can see the structure of the decoded data

      localStorage.setItem("user", JSON.stringify(decoded));
      const { name, sub: googleId, picture: imageUrl } = decoded;
      const doc = {
        _id: googleId,
        _type: "user",
        userName: name,
        image: imageUrl,
      };
      console.log(doc);
      console.log(client.config());
      client
        .createIfNotExists(doc)
        .then(() => navigate("/", { replace: true }))
        .catch((error) =>
          console.error("Error creating document in Sanity:", error)
        );
    } else {
      // Handle error or unsuccessful login
    }
  };

  return (
    <GoogleOAuthProvider
      clientId={`73926476617-t0hbv6d1l0i5rrh134hlhmeje49gjd3l.apps.googleusercontent.com`}
    >
      <div className="flex justify-start items-center flex-col h-screen">
        <div className=" relative w-full h-full">
          <video
            src={shareVideo}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className="w-full h-full object-cover"
          />

          <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
            <div className="p-5">
              <img src={logo} alt="logo" width="130px" />
            </div>

            <div className="shadow-2xl">
              <GoogleLogin
                clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                render={(renderProps) => (
                  <button
                    type="button"
                    className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FcGoogle className="mr-4" /> Sign in with google
                  </button>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy="single_host_origin"
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
