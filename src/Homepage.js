import "./Homepage.css";
import image2 from "./images/charityimage11.jpg";
import GithubLogo from "./images/GithubLogo.png";
import LinkedinLogo from "./images/LinkedinLogo.png";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="navbar">
        <div className="btn" onClick={() => window.scrollTo(0, 0)}>
          <p>Home</p>
        </div>
        <div className="btn" onClick={() => window.scrollTo(0, 500)}>
          <p>About</p>
        </div>
        <Link to="/loginpage" className="btn">
          <p>Sign In</p>
        </Link>
      </div>
      <div className="title">
        <div className="titlegrid">
          <div>
            <h1>Online Charity Donations</h1>
            <p>A bridge between Donors and Donees.</p>
          </div>
        </div>
      </div>
      <div className="intro">
        <img src={image2} alt="kids" />
        <div>
          <h3>Donate almost anything</h3>
          <p>
            We accept all kinds of donations like Money, Clothes, Stationary,
            Food, Groceries and much more.
          </p>
        </div>
      </div>
      <div className="authentication">
        <div className="donate">
          DONATE
          <img
            src="https://img.icons8.com/color/480/000000/like--v3.png"
            alt="Red Heart"
          />
        </div>
        <div className="subauthentication">
          <div className="charitydiv">
            <h3>Hello Donee !</h3>
            <Link to="/charityregistration">
              <button>Register here.</button>
            </Link>
          </div>
          <div className="donordiv">
            <h3>Hello Donor !</h3>
            <Link to="/userregistration">
              <button>Register here.</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="developerprofile">
        <div className="guidename">
          <p>
            Under the guidance of{" "}
            <span className="guidenamevalue">Prof. M Humera Khanam</span>
          </p>
        </div>
        <div className="team">
          <p>Team</p>
        </div>
        <div className="teammatescontainer">
          <div className="teammate">
            <div className="developerrollno">11716042</div>
            <div className="developername">Sree Sai Nikhil Amaravadi</div>
            <div
              className="developerlink"
              onClick={() => {
                window.open("https://github.com/sainikhilll");
              }}
            >
              <img src={GithubLogo} alt="github" className="githublogo" />
              <p>Github</p>
            </div>
          </div>
          <div className="teammate">
            <div className="developerrollno">11716050</div>
            <div className="developername">Thriven Kumar Yanamandram</div>
            <div
              className="developerlink"
              onClick={() => {
                window.open("https://github.com/ThrivenKumar");
              }}
            >
              <img src={GithubLogo} alt="github" className="githublogo" />
              <p>Github</p>
            </div>
          </div>
          <div className="teammate">
            <div className="developerrollno">11716057</div>
            <div className="developername">Yaswanth Reddy Narapureddy</div>
            <div
              className="developerlink"
              onClick={() => {
                window.open(
                  "https://www.linkedin.com/in/yaswanth-reddy-4a24931a7"
                );
              }}
            >
              <img src={LinkedinLogo} alt="linkedin" className="githublogo" />
              <p>Linkedin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
