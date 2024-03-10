import { Link } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
Link
const UserAuthForm = ({ type }) => {
  return (
    <AnimationWrapper keyVaIue={type}>
    <section className="h-cover flex items-center justify-center">
      <form className="w-[80%] max-w-[400px] ">
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
        <button className="btn-dark center mt-14" type="submit">
          {type.replace("-", " ")}
        </button>
        <div className="flex relative w-full items-center gap-2 my-10 opacity-10 text-black font-bold">
          <hr className="w-1/2 border-black" />
          <p>OR</p>
          <hr className="w-1/2 border-black" />
        </div>
        <button className="btn-dark center mt-14 flex items-center justify-center gap-4 w-[90%]">
          <img src={googleIcon} className="w-5 h-5" />
          continue with google
        </button>
        {type == "sign-in" ? (
          <p
            className="mt-6 text-dark-grey text-xl text-center"
          >Don't have a account?
            <Link to="/signup" className="text-black text-xl underline ml-1">Join us today</Link>
          </p>
        ) : (
            <p
            className="mt-6 text-dark-grey text-xl text-center"
          >Already have an account?
            <Link to="/signin" className="text-black text-xl underline ml-1">Sign in here.</Link>
          </p>
        )}
      </form>
    </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
