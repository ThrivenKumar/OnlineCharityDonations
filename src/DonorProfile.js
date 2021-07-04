import "./DonorProfile.css";
import backPNG from "./images/back.png";
const DonorProfile = ({ data, setViewProfile }) => {
  console.log(data);
  return (
    <div className="dpmaindiv">
      <div className="dpsubdiv">
        <div className="dpheader">
          <div className="dpheadertitle">
            <p>Profile</p>
          </div>
          <div
            className="dpheadersmall"
            onClick={() => {
              setViewProfile(false);
            }}
          >
            <img src={backPNG} alt="back" className="dpback" />
            <p>back</p>
          </div>
        </div>
        <div className="dpbody">
          <div className="dpform">
            <div className="dpprofileelement">
              <div className="dpprofilelabel">Name :</div>
              <div className="dpprofilevalue">{data.name}</div>
            </div>
            <div className="dpprofileelement">
              <div className="dpprofilelabel">Address :</div>
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
            <div className="dpprofileelement">
              <div className="dpprofilelabel">E-mail :</div>
              <div className="dpprofilevalue">{data.email}</div>
            </div>
            <div className="dpprofileelement">
              <div className="dpprofilelabel">Phone No :</div>
              <div className="dpprofilevalue">{data.phoneNo}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
