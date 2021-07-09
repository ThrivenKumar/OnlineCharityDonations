import { useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import "./userRegistration.css";
import { DonorRegistration } from "./Authentication.js";
import { StatesList, CitiesList } from "./CitiesList";
import Loading from "./Loading.js";

const Register = async (prop) => {
  const {
    name,
    addressLine1,
    state,
    city,
    phoneNo,
    email,
    password,
    reEnterPassword,
  } = prop;
  if (
    name !== "" &&
    addressLine1 !== "" &&
    state !== "" &&
    city !== "" &&
    phoneNo !== "" &&
    email !== "" &&
    password !== ""
  ) {
    if (reEnterPassword === password) {
      try {
        const response = await DonorRegistration(prop);
        console.log(response);
        return response;
      } catch (e) {
        console.log(e);
        return { status: 0, msg: "Server Error" };
      }
    } else {
      return { status: 0, msg: "Passwords do not match" };
    }
  } else {
    return { status: 0, msg: "Please fill all details" };
  }
};
const UserRegistration = () => {
  const name = useRef(null);
  const addressLine1 = useRef(null);
  const addressLine2 = useRef(null);
  const state = useRef(null);
  const city = useRef(null);
  const phoneNo = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const reEnterPassword = useRef(null);

  const [status, setStatus] = useState("");
  const [redirect, setRedirect] = useState({ status: false, uid: null });
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      {redirect.status ? (
        <Redirect
          to={{
            pathname: "/donorhome",
            state: {
              uid: redirect.uid,
              name: name.current.value,
              addressLine1: addressLine1.current.value,
              state: state.current.value,
              city: state.current.value,
              phoneNo: phoneNo.current.value,
              email: email.current.value,
            },
          }}
        />
      ) : (
        <div className="cr">
          <div className="crtitle">
            R<span className="evenletter">e</span>g
            <span className="evenletter">i</span>s
            <span className="evenletter">t</span>e
            <span className="evenletter">r</span>
          </div>
          <div className="crdescription">
            <p>
              Please enter details below and click Upload and Register. Fields
              marked with <span className="mandatory">*</span> are mandatory
            </p>
          </div>
          <div className="urdetails">
            <form className="crform">
              <label>
                Name <span className="mandatory">*</span> :
              </label>
              <input type="text" className="crinput" ref={name} />
              <label>
                Address Line 1 <span className="mandatory">*</span> :
              </label>
              <input type="text" className="crinput" ref={addressLine1} />
              <label>Address Line 2 :</label>
              <input type="text" className="crinput" ref={addressLine2} />
              <label>
                Phone No <span className="mandatory">*</span> :
              </label>
              <input
                type="tel"
                maxLength="10"
                className="crinput"
                ref={phoneNo}
              />
              <label>
                State <span className="mandatory">*</span> :
              </label>
              <select
                className="crselect"
                ref={state}
                onChange={(r) => {
                  setSelectedState(r.target.value);
                }}
              >
                <StatesList />
              </select>
              <label>
                City <span className="mandatory">*</span> :
              </label>
              <select className="crselect" ref={city}>
                <CitiesList state={selectedState} />
              </select>
              <label>
                Email<span className="mandatory">*</span>:
              </label>
              <input type="email" className="crinput" ref={email} />
              <label>
                Password<span className="mandatory">*</span>:
              </label>
              <input type="password" className="crinput" ref={password} />
              <label>
                Re enter Password<span className="mandatory">*</span>:
              </label>
              <input
                type="password"
                className="crinput"
                ref={reEnterPassword}
              />
            </form>
            {loading ? (
              <div className="crloading">
                <Loading />
              </div>
            ) : (
              <div className="crregister">
                <p className="crstatus">{status}</p>
                <button
                  onClick={() => {
                    setLoading(true);
                    Register({
                      name: name.current.value,
                      addressLine1: addressLine1.current.value,
                      addressLine2: addressLine2.current.value,
                      state: state.current.value,
                      city: city.current.value,
                      phoneNo: phoneNo.current.value,
                      email: email.current.value,
                      password: password.current.value,
                      reEnterPassword: reEnterPassword.current.value,
                    }).then((response) => {
                      console.log(response);
                      if (response.status === 0) {
                        setStatus(response.msg);
                      } else if (response.status === 1) {
                        setRedirect({ status: true, uid: response.uid });
                      }
                    });
                  }}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default UserRegistration;
