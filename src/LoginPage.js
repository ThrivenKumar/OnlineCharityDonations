import "./LoginPage.css";
import { useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { charityLogin, forgotPassword } from "./Authentication.js";
import Loading from "./Loading.js";
const LoginPage = () => {
  const email = useRef(null);
  const password = useRef(null);
  const [LoginStatus, setLoginStatus] = useState({
    status: false,
    loading: false,
    msg: "",
    forgot: false,
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
          {LoginStatus.forgot ? (
            <div className="Loginsubdiv">
              <label className="lplabel">
                Enter email to send password reset mail
              </label>
              <input type="email" className="lpinput" ref={email} />
              <div className="lpstatus">
                <p>{LoginStatus.msg}</p>
              </div>
              <div className="lploginbutton">
                <button
                  onClick={() => {
                    if (email.current.value !== "") {
                      forgotPassword(email.current.value).then((response) => {
                        console.log(response);
                        if (response.status) {
                          setLoginStatus({
                            status: false,
                            loading: false,
                            msg: "",
                            forgot: false,
                          });
                        } else {
                          setLoginStatus({
                            status: false,
                            loading: false,
                            msg: response.msg,
                            forgot: true,
                          });
                        }
                      });
                    }
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="Loginsubdiv">
              <label className="lplabel">E-mail</label>
              <input type="email" className="lpinput" ref={email} />
              <label className="lplabel">Password</label>
              <input type="password" className="lpinput" ref={password} />
              <div className="lpstatus">
                <p>{LoginStatus.msg}</p>
              </div>
              <div className="lploginbutton">
                {LoginStatus.loading ? (
                  <Loading />
                ) : (
                  <>
                    <button
                      onClick={() => {
                        charityLogin(
                          email.current.value,
                          password.current.value
                        ).then((response) => {
                          setLoginStatus(response);
                        });
                        setLoginStatus({
                          status: false,
                          loading: true,
                          msg: "",
                        });
                      }}
                    >
                      Login
                    </button>
                    <p
                      onClick={() => {
                        setLoginStatus({
                          status: false,
                          loading: false,
                          msg: "",
                          forgot: true,
                        });
                      }}
                    >
                      Forgot Password?
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
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
