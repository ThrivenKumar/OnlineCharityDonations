import "./CharityRegistration.css";
import { useRef, useState } from "react";
import { CharityRegister } from "./Authentication.js";
import { Redirect } from "react-router-dom";
import { StatesList, CitiesList } from "./CitiesList";

const readFilesPromise = (prop) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(prop);
  });
};

const FileURL = async (prop) => {
  console.log(prop);
  const url = [];
  for (let i = 0; i < prop.length; i++) {
    const response = await readFilesPromise(prop[i]);
    url.push(response);
  }
  console.log(url);
  return url;
};

const Register = async (prop, file, photos) => {
  const {
    name,
    addressLine1,
    city,
    state,
    phoneNo,
    email,
    password,
    reEnterPassword,
  } = prop;
  if (
    name !== "" &&
    addressLine1 !== "" &&
    city !== "" &&
    state !== "" &&
    phoneNo !== "" &&
    email !== "" &&
    password !== "" &&
    file &&
    photos
  ) {
    if (reEnterPassword === password) {
      try {
        const response = await CharityRegister(prop, file, photos);
        console.log(response);
        if (response.status === 1) {
          return { status: 1 };
        }
        return { status: 0, msg: response.code };
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("error");
      return { status: 0, msg: "Passwords does not match" };
    }
  } else {
    console.log("error");
    return { status: 0, msg: "Please enter all details" };
  }
};

const CharityRegistration = () => {
  const [certificate, setCertificate] = useState({
    status: false,
    url: [],
    file: false,
  });
  const [photos, setPhotos] = useState({ status: false, url: [], file: false });
  const [status, setStatus] = useState("");
  const [redirect, setRedirect] = useState({ status: false });
  const [selectedState, setSelectedState] = useState("");
  const inpFile = useRef(null);
  const otherphotos = useRef(null);
  const name = useRef(null);
  const addressLine1 = useRef(null);
  const addressLine2 = useRef(null);
  const city = useRef(null);
  const state = useRef(null);
  const phoneNo = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const reEnterPassword = useRef(null);

  return (
    <>
      {redirect.status ? (
        <Redirect
          to={{
            pathname: "/charityhome",
            state: {
              uid: redirect.uid,
              name: name.current.value,
              addressLine1: addressLine1.current.value,
              city: city.current.value,
              state: state.current.value,
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
          <div className="crdetails">
            <form className="crform">
              <label>
                Donee Name <span className="mandatory">*</span> :
              </label>
              <input type="text" className="crinput" ref={name} />
              <label>
                Address Line 1 <span className="mandatory">*</span> :
              </label>
              <input type="text" className="crinput" ref={addressLine1} />
              <label>Address Line 2 :</label>
              <input type="text" className="crinput" ref={addressLine2} />
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
              {/* <input className="crinput" ref={state} /> */}
              <label>
                City <span className="mandatory">*</span> :
              </label>
              <select className="crselect" ref={city}>
                <option></option>
                <CitiesList state={selectedState} />
              </select>
              {/* <input text="text" className="crinput" ref={city} /> */}
              <label>
                Donee Phone No <span className="mandatory">*</span> :
              </label>
              <input
                type="tel"
                maxLength="10"
                className="crinput"
                ref={phoneNo}
              />
              <label>
                Donee Email<span className="mandatory">*</span>:
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
            <div className="crimages">
              {certificate.status ? (
                <div className="crcertificate">
                  <img
                    src={certificate.url[0]}
                    alt="Certificate"
                    className="certificate"
                  />
                  <div
                    className="removecertificate"
                    onClick={() =>
                      setCertificate({ status: false, url: [], file: false })
                    }
                  >
                    <img
                      src="https://img.icons8.com/windows/96/000000/delete-forever.png"
                      alt="delete"
                    />
                  </div>
                </div>
              ) : (
                <div className="uploadimages">
                  <p className="operation">
                    Click + to upload Certificate
                    <span className="mandatory">*</span>
                  </p>
                  <input
                    type="file"
                    hidden="hidden"
                    ref={inpFile}
                    onChange={() => {
                      console.log(inpFile.current.files);
                      FileURL(inpFile.current.files).then((response) => {
                        setCertificate({
                          status: true,
                          url: response,
                          file: inpFile.current.files,
                        });
                      });
                    }}
                  />
                  <div
                    className="addbutton"
                    onClick={() => inpFile.current.click()}
                  >
                    +
                  </div>
                </div>
              )}
              {photos.status ? (
                <div className="charityphotos">
                  {photos.url.map((photo) => {
                    return <img src={photo} alt="1" className="photo" />;
                  })}
                </div>
              ) : (
                <div className="uploadimages">
                  <p className="operation">Click + to upload photos of Donee</p>
                  <input
                    type="file"
                    name="photos"
                    hidden="hidden"
                    ref={otherphotos}
                    multiple
                    onChange={(e) => {
                      FileURL(otherphotos.current.files).then((result) =>
                        setPhotos({
                          status: true,
                          url: result,
                          file: otherphotos.current.files,
                        })
                      );
                    }}
                  />
                  <div
                    className="addbutton"
                    onClick={() => otherphotos.current.click()}
                  >
                    +
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="crregister">
            <p className="crstatus">{status}</p>
            <button
              onClick={() => {
                Register(
                  {
                    name: name.current.value,
                    addressLine1: addressLine1.current.value,
                    addressLine2: addressLine2.current.value,
                    city: city.current.value,
                    state: state.current.value,
                    phoneNo: phoneNo.current.value,
                    email: email.current.value,
                    password: password.current.value,
                    reEnterPassword: reEnterPassword.current.value,
                  },
                  certificate.file,
                  photos.file
                ).then((iferror) => {
                  console.log(iferror);
                  if (iferror.status === false) {
                    setStatus(iferror.msg);
                  } else {
                    setRedirect(iferror);
                  }
                });
              }}
            >
              Upload and Register
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default CharityRegistration;
