import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { useRef, useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { userContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(userContext);

  console.log(access_token);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        // console.log(data);
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    // console.log(authForm.current)
    let form = new FormData(formElement);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    const { fullname, password, email } = formData;

    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be atleast 3 letters long");
      }
    }
    if (!email.length) {
      return toast.error("Enter Email");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Email Invaild");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 Ito 20 characters long with a numeric, 1 lowercase and 1 uppercase"
      );
    }

    userAuthThroughServer(serverRoute, formData);
  };

  const handelGoogleAuth = (e) => {
    e.preventDefault();
    authWithGoogle()
      .then((user) => {

        console.log(user)
        
        let serverRoute = '/google-auth'
        let formData = {
          access_token: user.accessToken
        }
        userAuthThroughServer(serverRoute, formData)

      })
      .catch((err) => {
        toast.error("trouble login through google"); 
        return console.log(err);
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyVaIue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id="formElement" className="w-[80%] max-w-[400px] ">
          <h1 className="text-4xl font-gelasio capitalize text-center">
            {type == "sign-in" ? "Welcome Back" : "Join Us Now"}
          </h1>

          {type != "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}
          <InputBox
            name="email"
            type="email"
            placeholder="E-mail"
            icon="fi-rr-envelope"
          />
          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />
          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handelSubmit}
          >
            {type.replace("-", " ")}
          </button>
          <div className="flex relative w-full items-center gap-2 my-10 opacity-10 text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>OR</p>
            <hr className="w-1/2 border-black" />
          </div>
          <button
            onClick={handelGoogleAuth}
            className="btn-dark center mt-14 flex items-center justify-center gap-4 w-[90%]"
          >
            <img src={googleIcon} className="w-5 h-5" />
            continue with google
          </button>
          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have a account?
              <Link to="/signup" className="text-black text-xl underline ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already have an account?
              <Link to="/signin" className="text-black text-xl underline ml-1">
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
