import "./charityprofile.css";
import { Redirect, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getCertificate, LogoutUser } from "./Authentication.js";
import Loading from "./Loading.js";

const CharityProfile = () => {
  const location = useLocation();
  const [certificate, setCertificate] = useState({ status: false, url: "" });
  const [clipboard, setclipboard] = useState({
    phone: { border: "2px solid rgb(22, 29, 111)" },
    email: { border: "2px solid rgb(22, 29, 111)" },
  });
  const [redirect, setRedirect] = useState({ status: false, warning: false });
  const { name, addressLine1, city, state, phoneNo, email } = location.state;
  const [edit, setEdit] = useState(false);
  const addressref = useRef(null);
  const cityref = useRef(null);
  const stateref = useRef(null);
  const phoneNoref = useRef(null);
  const nameref = useRef(null);
  const emailref = useRef(null);
  useEffect(() => {
    console.log("useEffect");
    getCertificate(email)
      .then((data) => {
        setCertificate(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [email]);
  return (
    <>
      {redirect.status ? (
        <Redirect to="/" />
      ) : (
        <>
          <div className="cpgreeting">
            <p>
              P<span className="cpevenletters">r</span>o
              <span className="cpevenletters">f</span>i
              <span className="cpevenletters">l</span>e
            </p>
            {!edit && (
              <button
                onClick={() => {
                  setEdit(true);
                  console.log("editmode");
                }}
              >
                Edit
              </button>
            )}
          </div>
          <div className="cpmaindiv">
            <div className="cpprofile">
              <div className="cpdetails">
                <label>Name</label>
                <div className="cpvalue">{name}</div>
              </div>
              <div className="cpdetails">
                <label>Street</label>
                {edit ? (
                  <input ref={addressref} defaultValue={addressLine1} />
                ) : (
                  <div className="cpvalue">{addressLine1}</div>
                )}
              </div>
              <div className="cpdetails">
                <label>City</label>
                <div className="cpvalue">{city}</div>
              </div>
              <div className="cpdetails">
                <label>State</label>
                <div className="cpvalue">{state}</div>
              </div>
              <div className="cpdetails">
                <label>Phone No:</label>
                <div className="cpemailorphone">
                  {edit ? (
                    <input ref={phoneNoref} defaultValue={phoneNo} />
                  ) : (
                    <>
                      <div style={clipboard.phone}>{phoneNo}</div>
                      <img
                        src="https://img.icons8.com/fluent-systems-regular/96/000000/copy.png"
                        alt="copy"
                        className="copyPNG"
                        onClick={() => {
                          navigator.clipboard.writeText(phoneNo);
                          setclipboard({
                            phone: { border: "2px solid #c7ffd8" },
                            email: { border: "2px solid rgb(22, 29, 111)" },
                          });
                          setTimeout(() => {
                            setclipboard({
                              phone: { border: "2px solid rgb(22, 29, 111)" },
                              email: { border: "2px solid rgb(22, 29, 111)" },
                            });
                          }, 2000);
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="cpdetails">
                <label>Email:</label>
                <div className="cpemailorphone">
                  <div style={clipboard.email}>{email}</div>
                  <img
                    src="https://img.icons8.com/fluent-systems-regular/96/000000/copy.png"
                    alt="copy"
                    className="copyPNG"
                    onClick={() => {
                      navigator.clipboard.writeText(email);
                      setclipboard({
                        phone: { border: "2px solid rgb(22, 29, 111)" },
                        email: { border: "2px solid #c7ffd8" },
                      });
                      setTimeout(() => {
                        setclipboard({
                          phone: { border: "2px solid rgb(22, 29, 111)" },
                          email: { border: "2px solid rgb(22, 29, 111)" },
                        });
                      }, 2000);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="viewphotos">
              {certificate.status ? (
                <img
                  src={certificate.url}
                  alt="certificate"
                  className="cpcertificate"
                />
              ) : (
                <Loading />
              )}
            </div>
          </div>
          {edit ? (
            <div className="cpsaveinfodiv">
              <button
                className="cpsavebtn"
                onClick={() => {
                  setEdit(false);
                  location.state = {
                    name: nameref.current.value,
                    addressLine1: addressref.current.value,
                    city: cityref.current.value,
                    state: stateref.current.value,
                    phoneNo: phoneNoref.current.value,
                    email: emailref.current.value,
                  };
                }}
              >
                Save
              </button>
              <button
                className="cpsavebtn"
                onClick={() => {
                  setEdit(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="cplogout">
              {redirect.warning && <p>Error!! Try again</p>}
              <button
                onClick={() => {
                  LogoutUser().then((response) => {
                    if (response.status === 1) {
                      setRedirect({ status: true, warning: false });
                    } else {
                      setRedirect({ status: false, warning: true });
                      setTimeout(() => {
                        setRedirect({ status: false, warning: false });
                      }, 2000);
                    }
                  });
                }}
              >
                Logout
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CharityProfile;
