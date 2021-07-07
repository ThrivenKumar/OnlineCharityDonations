import { useLocation, Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import noimage from "./images/noimage.png";
import "./CharityHomePage.css";
import userPNG from "./images/user.png";
import deletePNG from "./images/deletePNG.png";
import Loading from "./Loading.js";
import { CitiesList } from "./CitiesList";
import { getDonorsData } from "./Authentication.js";

const getItems = async (city) => {
  try {
    // const response = await fetch(
    //   `http://localhost:5000/charityGetRequest/${city}`
    // );
    const response = await fetch(
      `https://us-central1-onlinecharitydonations.cloudfunctions.net/app/charityGetRequest/${city}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

const getPhotos = async (id) => {
  try {
    // const response = await fetch(`http://localhost:5000/getPhoto/${id}`);
    const response = await fetch(
      `https://us-central1-onlinecharitydonations.cloudfunctions.net/app/getPhoto/${id}`
    );
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

const sendRequestToDonor = async (city, donoruid, doneeuid, productId) => {
  console.log(productId);
  // const response = await fetch(`http://localhost:5000/sendRequest`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ donoruid, doneeuid, city, productId }),
  // });
  const response = await fetch(
    `https://us-central1-onlinecharitydonations.cloudfunctions.net/app/sendRequest`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ donoruid, doneeuid, city, productId }),
    }
  );
  const data = await response.json();
  console.log(data);
};

const deleteRequest = async (productinfo) => {
  // const response = await fetch("http://localhost:5000/deleteRequest", {
  //   method: "DELETE",
  //   body: JSON.stringify(productinfo),
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  const response = await fetch(
    "https://us-central1-onlinecharitydonations.cloudfunctions.net/app/deleteRequest",
    {
      method: "DELETE",
      body: JSON.stringify(productinfo),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  console.log(data);
  return data;
};

const CharityHomePage = () => {
  const location = useLocation();
  const userInfo = location.state;
  const [searchKey, setSearchKey] = useState(userInfo.city);
  const [warning, setWarning] = useState(false);
  const searchCity = useRef(null);
  console.log(userInfo);
  const [navstyle, setnavstyle] = useState({
    items: {
      backgroundColor: "rgb(22, 29, 111)",
      color: "rgb(152, 222, 217)",
      boxShawdow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)",
    },
    booli: true,
    requests: {
      backgroundColor: "white",
      color: "rgb(22, 29, 111)",
    },
  });
  return (
    <>
      <div className="chpmaindiv">
        <div className="chptitle">
          <div className="chptitleleft">
            <p>O C D</p>
          </div>
          <div className="chpnavbar">
            <button
              style={navstyle.items}
              onClick={() =>
                setnavstyle({
                  booli: true,
                  items: {
                    backgroundColor: "rgb(22, 29, 111)",
                    color: "rgb(152, 222, 217)",
                    boxShadow:
                      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)",
                  },
                  requests: {
                    backgroundColor: "white",
                    color: "rgb(22, 29, 111)",
                  },
                })
              }
            >
              Items
            </button>
            <button
              style={navstyle.requests}
              onClick={() => {
                setnavstyle({
                  booli: false,
                  items: {
                    backgroundColor: "white",
                    color: "rgb(22, 29, 111)",
                  },
                  requests: {
                    backgroundColor: "rgb(22, 29, 111)",
                    color: "rgb(152, 222, 217)",
                    boxShadow:
                      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)",
                  },
                });
              }}
            >
              My Requests
            </button>
          </div>
          <div className="chptitleright">
            <div className="chpsearchcity">
              <p>City: </p>
              <select
                className="chpsearchbar"
                ref={searchCity}
                onChange={() => {
                  if (searchCity.current.value !== "")
                    setSearchKey(searchCity.current.value);
                  else {
                    setWarning(true);
                    setTimeout(() => {
                      setWarning(false);
                    }, 2000);
                  }
                }}
              >
                <option>{searchKey}</option>
                <CitiesList state={userInfo.state} />
              </select>
              {warning && <h5 className="chpwarning">Enter value to search</h5>}
            </div>
            <Link to={{ pathname: "charityprofile", state: userInfo }}>
              <div>
                <img src={userPNG} alt="user" className="userPNG" />
              </div>
            </Link>
          </div>
        </div>
        <ItemsContainer
          city={userInfo.city}
          state={userInfo.state}
          uid={userInfo.uid}
          booli={navstyle.booli}
          searchKey={searchKey}
        />
      </div>
    </>
  );
};

const ItemsContainer = ({ uid, booli, searchKey }) => {
  const [products, setProducts] = useState({ status: 0, loading: true });
  const [reload, setReload] = useState(false);
  console.log(uid);
  useEffect(() => {
    console.count("UseEffect");
    getItems(searchKey).then((response) => {
      if (response.status === 1) {
        console.log(response.products);
        const items = segregateItems(response.products, uid);
        setProducts({
          status: response.status,
          requestedProducts: items.req,
          nonReqProducts: items.noreq,
          acceptedRequests: items.reqaccepted,
          loading: false,
        });
      }
    });
  }, [searchKey, reload, uid]);
  return (
    <div>
      {products.loading ? (
        <div className="chploading">
          <Loading />
        </div>
      ) : (
        <>
          {products.status === 1 ? (
            <>
              {booli ? (
                <Items
                  products={products.nonReqProducts}
                  city={searchKey}
                  doneeuid={uid}
                  booli={booli}
                  setReload={setReload}
                  reload={reload}
                  msg="No items available. Go to 'My Requests' for requested Items."
                  header="Donated Items"
                />
              ) : (
                <>
                  <AcceptedItems
                    products={products.acceptedRequests}
                    city={searchKey}
                    doneeuid={uid}
                    booli={booli}
                  />
                  <Items
                    products={products.requestedProducts}
                    city={searchKey}
                    doneeuid={uid}
                    booli={booli}
                    setReload={setReload}
                    reload={reload}
                    header="Requested Items"
                    msg="No requested items."
                  />
                </>
              )}
            </>
          ) : (
            <div className="chploading">Server Error !!!</div>
          )}
        </>
      )}
    </div>
  );
};

const segregateItems = (data, doneeuid) => {
  const req = [];
  const reqaccepted = [];
  const noreq = [];
  console.log(doneeuid);
  data.forEach((donor) => {
    donor.products.forEach((item) => {
      console.log(item);
      var booli = false;
      if (item.donated.status === false) {
        console.log(item.requests);
        item.requests.forEach((id) => {
          if (doneeuid === id.doneeuid) {
            req.push({ uid: donor.uid, item });
            booli = true;
          }
        });
        if (booli === false) {
          noreq.push({ uid: donor.uid, item });
        }
      } else if (item.donated.status && item.donated.uid === doneeuid) {
        reqaccepted.push({ uid: donor.uid, item });
      }
    });
  });
  console.log("Requested Products:", req, " Other Pros :", noreq);
  return { req, noreq, reqaccepted };
};

const Items = ({
  products,
  city,
  doneeuid,
  booli,
  setReload,
  reload,
  msg,
  header,
}) => {
  console.log(products);
  console.log(doneeuid);
  return (
    <>
      {products.length === 0 ? (
        <div className="chpnoitems">
          <div className="chploading">{msg}</div>
        </div>
      ) : (
        <>
          <div className="chpaccitemheader">
            <p>{header}</p>
          </div>
          <div className="chpdonateditemscontainer">
            {products.map((singleitem, index) => {
              const { item, uid } = singleitem;
              return (
                <div className="chpitem" key={index}>
                  <Images photos={item.photos} />
                  <div className="chpitemfooter">
                    <div className="chpitemdetails">
                      <p className="chpitemname">{item.productName}</p>
                      <p className="chpitemaddress">{item.address}</p>
                    </div>
                    {booli ? (
                      <button
                        className="chprequestbutton"
                        onClick={() => {
                          sendRequestToDonor(
                            city,
                            uid,
                            doneeuid,
                            item.productId
                          ).then(() => {
                            console.log(!reload);
                            setReload(!reload);
                          });
                        }}
                      >
                        Request
                      </button>
                    ) : (
                      <div
                        className="chpdelreqbtn"
                        onClick={() => {
                          const data = {
                            uid,
                            doneeuid,
                            productid: item.productId,
                            city: item.city,
                          };
                          deleteRequest(data).then((response) => {
                            if (response.status) {
                              setReload(!reload);
                            }
                          });
                        }}
                      >
                        <img src={deletePNG} alt="delete" />
                        <p>Request</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

const AcceptedItems = ({ products }) => {
  console.log(products);
  const [donorsData, setDonorsData] = useState({ status: 0 });
  useEffect(() => {
    getDonorsData(products).then((response) => {
      setDonorsData(response);
      console.log(response);
    });
  }, [products]);
  return (
    <>
      {products.length > 0 && (
        <div className="chpaccitemscontainer">
          {donorsData.status ? (
            <>
              <div className="chpaccitemheader">
                <p>Accepted requests</p>
              </div>
              {products.map((item, index) => {
                return (
                  <>
                    <div className="chpaccitem" key={index}>
                      <div className="chpaccitemleft">
                        <Images photos={item.item.photos} />
                        <div className="chpaccitemfooter">
                          <div className="chpitemdetails">
                            <p className="chpitemname">
                              {item.item.productName}
                            </p>
                            <p className="chpitemaddress">
                              {item.item.address}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="chpaccitemright">
                        <div className="chpaccdonorheader">
                          <p>Donor information</p>
                        </div>
                        <div className="chpaccdonordetail">
                          <div className="chpaccdonorlabel">Name :</div>
                          <div className="chpaccdonorvalue">
                            {donorsData.donorsData[0].username}
                          </div>
                        </div>
                        <div className="chpaccdonordetail">
                          <div className="chpaccdonorlabel">Phone No :</div>
                          <div className="chpaccdonorvalue">
                            {donorsData.donorsData[0].phoneNumber}
                          </div>
                        </div>
                        <div className="chpaccdonordetail">
                          <div className="chpaccdonorlabel">E-mail :</div>
                          <div className="chpaccdonorvalue">
                            {donorsData.donorsData[0].email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          ) : (
            <div className="chploading">
              <Loading />
            </div>
          )}
        </div>
      )}
    </>
  );
};

const Images = ({ photos }) => {
  const [allimages, setAllImages] = useState({ status: 0, noimage: 0 });
  useEffect(() => {
    if (photos.length) {
      setAllImages({ status: 0, noimage: 0 });
      convertbuff(photos).then((response) => {
        setAllImages({ status: 1, response });
      });
    } else {
      setAllImages({ status: 1, noimage: 1 });
    }
  }, [photos]);
  return (
    <div className="chpproductimagesdiv">
      {allimages.status ? (
        allimages.response.map((photo, index) => {
          return (
            <img
              src={`data:image/png;base64,${photo}`}
              alt="ProductImage"
              key={index}
              className="chpproductimg"
            />
          );
        })
      ) : (
        <>
          {allimages.noimage ? (
            <img src={noimage} alt="noimage" />
          ) : (
            <Loading />
          )}
        </>
      )}
    </div>
  );
};

const convertbuff = async (photos) => {
  const photoarray = [];
  for (let i = 0; i < photos.length; i++) {
    const response = await getPhotos(photos[i]);
    if (response.status === 1) {
      const onlybuff = response.photoBuffer.map((buff) => {
        return Buffer.from(buff.data);
      });
      const base64img = Buffer.concat(onlybuff);
      photoarray.push(base64img.toString("base64"));
    }
  }
  return photoarray;
};

export default CharityHomePage;
