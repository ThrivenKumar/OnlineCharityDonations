import "./DonorProfile.css";
import closePNG from "./images/closePNG.png";
import { LogoutUser } from "./Authentication";
import { Redirect } from "react-router";
import { useState } from "react";
const DonorProfile = ({ data, setViewProfile }) => {
  console.log(data);
  const [redirect, setRedirect] = useState({ status: false, warning: false });
  return (
    <>
      {redirect.status ? (
        <Redirect to="/" />
      ) : (
        <div className="dpmaindiv">
          <div className="dpsubdiv">
            <div className="dpheader">
              <div className="dpdonorname">
                <p>{data.name}</p>
              </div>
              <div
                className="dpheadersmall"
                onClick={() => {
                  console.log("Hello");
                  setViewProfile(false);
                }}
              >
                <img src={closePNG} alt="close" />
              </div>
            </div>
            <div className="dpbody">
              <div className="dpdonorinfo">
                <div className="dpdetailhead">Address</div>
              </div>
              <div className="dpprofileelement">
                <div className="dpprofilelabel">Street :</div>
                <div className="dpprofilevalue">{data.addressLine1}</div>
              </div>
              <div className="dpprofileelement">
                <div className="dpprofilelabel">City :</div>
                <div className="dpprofilevalue">{data.city}</div>
              </div>
              <div className="dpprofileelement">
                <div className="dpprofilelabel">State :</div>
                <div className="dpprofilevalue">{data.state}</div>
              </div>
              <div className="dpdonorinfo">
                <div className="dpdetailhead">Contact Information</div>
              </div>
              <div className="dpprofileelement">
                <div className="dpprofilelabel">Phone No :</div>
                <div className="dpprofilevalue">{data.phoneNo}</div>
              </div>
              <div className="dpprofileelement">
                <div className="dpprofilelabel">E-mail :</div>
                <div className="dpprofilevalue">{data.email}</div>
              </div>
            </div>
            <div className="chplogout">
              {redirect.warning && <p>Error!! Try again</p>}
              <button
                onClick={() => {
                  LogoutUser().then((response) => {
                    if (response.status === 1) {
                      setRedirect({ status: true, warning: false });
                    } else {
                      setRedirect({ status: false, warning: true });
                    }
                  });
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonorProfile;
