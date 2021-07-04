import "./LoginPage.css";
import { useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { charityLogin } from "./Authentication.js";
import Loading from "./Loading.js";
const LoginPage = () => {
  const email = useRef(null);
  const password = useRef(null);
  const [LoginStatus, setLoginStatus] = useState({
    status: false,
    loading: false,
    msg: "",
  });
  return (
    <>
      {LoginStatus.status ? (
        <RedirectPage LoginStatus={LoginStatus} />
      ) : (
        <div className="Loginmaindiv">
          <div className="Loginheader">
            L<span className="evenletter">o</span>g
            <span className="evenletter">i</span>n
          </div>
          <div className="Loginsubdiv">
            <label className="lplabel">Email</label>
            <input type="email" className="lpinput" ref={email} />
            <label className="lplabel">Password</label>
            <input type="password" className="lpinput" ref={password} />
            <div className="lpstatus">
              <p>{LoginStatus.msg}</p>
            </div>
            <div
              className="lploginbutton"
              onClick={() => {
                charityLogin(email.current.value, password.current.value).then(
                  (response) => {
                    setLoginStatus(response);
                  }
                );
                setLoginStatus({ status: false, loading: true, msg: "" });
              }}
            >
              {LoginStatus.loading ? <Loading /> : <button>Login</button>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const RedirectPage = ({ LoginStatus }) => {
  return (
    <>
      {LoginStatus.userData.type === "charity" ? (
        <Redirect
          to={{
            pathname: "/charityhome",
            state: {
              uid: LoginStatus.uid,
              name: LoginStatus.userData.username,
              addressLine1: LoginStatus.userData.address_1,
              addressLine2: LoginStatus.userData.address_2,
              city: LoginStatus.userData.city,
              state: LoginStatus.userData.state,
              phoneNo: LoginStatus.userData.phoneNumber,
              email: LoginStatus.userData.email,
            },
          }}
        />
      ) : (
        <Redirect
          to={{
            pathname: "/donorhome",
            state: {
              uid: LoginStatus.uid,
              name: LoginStatus.userData.username,
              addressLine1: LoginStatus.userData.address_1,
              addressLine2: LoginStatus.userData.address_2,
              state: LoginStatus.userData.state,
              city: LoginStatus.userData.city,
              phoneNo: LoginStatus.userData.phoneNumber,
              email: LoginStatus.userData.email,
            },
          }}
        />
      )}
    </>
  );
};
export default LoginPage;
