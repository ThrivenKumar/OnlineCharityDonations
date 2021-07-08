import "./DonorHomepage.css";
import noimage from "./images/noimage.png";
import userPNG from "./images/user.png";
import backPNG from "./images/back.png";
import closePNG from "./images/closePNG.png";
import Loading from "./Loading.js";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDoneeData, getCertificate, getSingleDonee } from "./Authentication";
import { CitiesList } from "./CitiesList";
import DonorProfile from "./DonorProfile";
const uploadItems = async (files, data) => {
  console.log(data);
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("productImages", files[i]);
  }
  formData.append("uid", data.uid);
  formData.append("productName", data.productName);
  formData.append("address", data.address);
  formData.append("city", data.city);
  for (var i of formData.values()) {
    console.log(i);
  }
  try {
    // const response = await fetch("http://localhost:5000/uploadImages", {
    //   method: "POST",
    //   body: formData,
    //   header: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // });
    const response = await fetch(
      "https://us-central1-onlinecharitydonations.cloudfunctions.net/app/uploadImages",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
    return { msg: "Internal error try again", status: false };
  }
};

const getData = async (uid) => {
  try {
    // const response = await fetch(
    //   `http://localhost:5000/donorGetRequest/${uid}`
    // );
    const response = await fetch(
      `https://us-central1-onlinecharitydonations.cloudfunctions.net/app/donorGetRequest/${uid}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log("error");
    console.log(e);
    return { status: 0, loading: false };
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
const acceptRequest = async (donoruid, doneeuid, productid, city) => {
  console.log(donoruid, doneeuid, productid);
  // const response = await fetch("http://localhost:5000/acceptRequest", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     donoruid,
  //     doneeuid,
  //     productid,
  //     city,
  //   }),
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  const response = await fetch(
    "https://us-central1-onlinecharitydonations.cloudfunctions.net/app/acceptRequest",
    {
      method: "POST",
      body: JSON.stringify({
        donoruid,
        doneeuid,
        productid,
        city,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  console.log(data);
};

const deleteItem = async (details) => {
  const { productId, city, uid, photos } = details;
  console.log(details);
  // const response = await fetch("http://localhost:5000/deleteItem", {
  //   method: "DELETE",
  //   body: JSON.stringify({ productId, city, uid, photos }),
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  const response = await fetch(
    "https://us-central1-onlinecharitydonations.cloudfunctions.net/app/deleteItem",
    {
      method: "DELETE",
      body: JSON.stringify({ productId, city, uid, photos }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  console.log(data);
  return data;
};

const UserHomepage = () => {
  const location = useLocation();
  const userInfo = location.state;
  const [addNewItem, setAddNewItem] = useState({ booli: false, count: 0 });
  const [viewProfile, setViewProfile] = useState(false);
  console.log(userInfo);
  return (
    <div className="dhpmaindiv">
      <div className="dhptitle">
        <div className="dhptitleleft">
          <p>O C D</p>
        </div>
        <div className="dhptitleright">
          <button
            className="dhpadditem"
            onClick={() => {
              setAddNewItem({ booli: true, count: addNewItem.count });
            }}
          >
            Donate
          </button>
          <div
            onClick={() => {
              setViewProfile(true);
            }}
          >
            <img src={userPNG} alt="user" className="userPNG" />
          </div>
        </div>
      </div>
      {addNewItem.booli && (
        <AddItem
          uid={userInfo.uid}
          setAddNewItem={setAddNewItem}
          count={addNewItem.count}
          userInfo={userInfo}
        />
      )}
      <DonatedItems uid={userInfo.uid} count={addNewItem.count} />
      {viewProfile && (
        <DonorProfile data={userInfo} setViewProfile={setViewProfile} />
      )}
    </div>
  );
};

const DonatedItems = ({ uid, count }) => {
  const [items, setItems] = useState({
    status: 0,
    loading: true,
    products: [],
  });
  const [reload, setReload] = useState(false);
  useEffect(() => {
    getData(uid).then((response) => {
      console.log(response);
      setItems(response);
    });
  }, [count, reload, uid]);
  return (
    <>
      {items.loading ? (
        <div className="dhploading">
          <Loading />
        </div>
      ) : (
        <>
          {items.status && items.products.length ? (
            <>
              <div className="chpaccitemheader">
                <p>Donated items</p>
              </div>
              <div className="dhpdonateditems">
                <Items
                  items={items.products}
                  uid={uid}
                  reload={reload}
                  setReload={setReload}
                />
              </div>
            </>
          ) : (
            <div className="dhpstartdonating">
              <div>
                <h3>Start Donating</h3>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

const Items = ({ items, uid, reload, setReload }) => {
  const [viewProduct, setViewProduct] = useState({ booli: false, data: {} });
  console.log(viewProduct);
  return (
    <>
      {viewProduct.booli ? (
        <SingleProduct
          data={viewProduct.data}
          uid={uid}
          setViewProduct={setViewProduct}
          reload={reload}
          setReload={setReload}
        />
      ) : (
        <div className="dhpdonateditemscontainer">
          {items.map((item, index) => {
            return (
              <div
                className="dhpitem"
                key={index}
                onClick={() => {
                  setViewProduct({ booli: true, data: item });
                }}
              >
                <div className="dhpproductimagesdiv">
                  <Images photos={item.photos} />
                </div>
                <div className="dhpitemfooter">
                  <div className="dhpitemdetails">
                    <p className="dhpitemname">{item.productName}</p>
                    <p className="dhpitemaddress">{item.address}</p>
                  </div>
                  <div className="dhpitemrequests">
                    <p>
                      <span>{item.requests.length} </span>
                      req(s)
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const SingleProduct = ({ data, uid, setViewProduct, reload, setReload }) => {
  const { productName, photos, address } = data;
  const [loading, setLoading] = useState(false);
  return (
    <div className="dhpsingleitem">
      <div className="dhpsingleitemheader">
        <div className="dhpsingleitemname">
          <p>{productName}</p>
        </div>
        <div
          className="dhpsingleclosePNG"
          onClick={() => {
            setViewProduct({ booli: false, data: {} });
          }}
        >
          <img src={backPNG} alt="Back" />
          <p>Back</p>
        </div>
      </div>
      <div className="dhpsingleitembody">
        <div className="dhpsingleprdctimgdiv">
          <div className="dhpsingleprdctimgcontainer">
            <Images photos={photos} />
          </div>
        </div>
        <div className="dhpsingleitemright">
          <div className="dhpsingleitemdetails">
            <div className="dhpdoneedetailhead">Address :</div>
            <div className="dhpsingleaddressvalue">
              <p className="dhpsingleitemaddress">{address}</p>
            </div>
          </div>
          <DonatedOrNot
            singledata={data}
            uid={uid}
            reload={reload}
            setReload={setReload}
            setViewProduct={setViewProduct}
          />
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="dhpdeleteitem">
          <button
            onClick={() => {
              setLoading(true);
              deleteItem({
                productId: data.productId,
                city: data.city,
                uid,
                photos: data.photos,
              }).then((response) => {
                if (response.count > 0) {
                  setReload(!reload);
                  setViewProduct({ booli: false, data: {} });
                } else {
                  setLoading(false);
                }
              });
            }}
          >
            Delete Item
          </button>
        </div>
      )}
    </div>
  );
};

const DonatedOrNot = ({
  singledata,
  uid,
  reload,
  setReload,
  setViewProduct,
}) => {
  return (
    <>
      {singledata.donated.status ? (
        <SingleDonee uid={singledata.donated.uid} />
      ) : (
        <div className="dhpsingleproductrequests">
          <div className="dhpdoneedetailhead">Requests </div>
          {singledata.requests.length ? (
            <Requests
              requests={singledata.requests}
              productId={singledata.productId}
              donoruid={uid}
              city={singledata.city}
              reload={reload}
              setReload={setReload}
              setViewProduct={setViewProduct}
            />
          ) : (
            <div className="dhpnorequests">
              <p>No requests for this Item</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const SingleDonee = ({ uid }) => {
  const [doneeData, setDoneeData] = useState({ loading: true });
  const [viewProfile, setViewProfile] = useState({ status: false, data: {} });
  useEffect(() => {
    getSingleDonee(uid).then((response) => {
      console.log(response);
      setDoneeData(response);
    });
  }, [uid]);
  return (
    <>
      {viewProfile.status && (
        <DoneeProfile data={viewProfile.data} setViewProfile={setViewProfile} />
      )}
      {doneeData.loading ? (
        <div className="dhploading">
          <Loading />
        </div>
      ) : (
        <>
          {doneeData.status ? (
            <div className="dhpaccdonee">
              <div className="dhpaccrequestheader">
                You accepted the request of
              </div>
              <div className="dhpaccdoneedetails">
                <div className="dhpaccdoneedetailheader">
                  <div className="dhpaccdoneename">
                    {doneeData.donee.username}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setViewProfile({
                          status: true,
                          data: {
                            donee: doneeData.donee,
                            uid,
                          },
                        });
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
                <div className="dhpaccdoneeemailphone">
                  <div className="dhpaccdoneephone">
                    <div className="dhpacclabel">Phone No :</div>
                    <div className="dhpaccvalue">
                      {doneeData.donee.phoneNumber}
                    </div>
                  </div>
                  <div className="dhpaccdoneeemail">
                    <div className="dhpacclabel">E-mail :</div>
                    <div className="dhpaccvalue">{doneeData.donee.email}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>Server Error</div>
          )}
        </>
      )}
    </>
  );
};

const Requests = ({
  requests,
  productId,
  donoruid,
  city,
  reload,
  setReload,
  setViewProduct,
}) => {
  const [reqDonees, setReqDonees] = useState({ loading: true });
  const [viewProfile, setViewProfile] = useState({ status: false, data: {} });
  useEffect(() => {
    console.count("Render count");
    getDoneeData(requests).then((response) => {
      setReqDonees(response);
    });
  }, [requests]);
  return (
    <>
      {viewProfile.status && (
        <DoneeProfile data={viewProfile.data} setViewProfile={setViewProfile} />
      )}
      <div>
        {reqDonees.loading ? (
          <Loading />
        ) : (
          <div className="dhprequestdiv">
            {reqDonees.donees.map((donee, index) => {
              console.log(donee);
              return (
                <div key={index} className="dhpsinglerequest">
                  <div className="dhpsingledoneename">
                    <p>{donee.username}</p>
                  </div>
                  <div className="dhpsingledoneeoptions">
                    <button
                      className="dhpdoneeviewprofile"
                      onClick={() => {
                        setViewProfile({
                          status: true,
                          data: { donee, uid: requests[index].doneeuid },
                        });
                      }}
                    >
                      view profile
                    </button>
                    <button
                      className="dhpdoneeaccept"
                      onClick={() => {
                        acceptRequest(
                          donoruid,
                          requests[index].doneeuid,
                          productId,
                          city
                        ).then(() => {
                          setViewProduct({ booli: false, data: {} });
                          setReload(!reload);
                        });
                      }}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

const DoneeProfile = ({ data, setViewProfile }) => {
  const { email, address_1, city, phoneNumber, state, username } = data.donee;
  const [certificate, setCertificate] = useState({ status: false, url: "" });
  useEffect(() => {
    getCertificate(email)
      .then((response) => {
        setCertificate(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [email]);
  return (
    <div className="dhpdoneeprofile">
      <div className="dhpdoneeprofilecontainer">
        <div className="dhpdoneenameheader">
          <div className="dhpdoneenamesmall"></div>
          <div className="dhpdoneename">
            <p>{username}</p>
          </div>
          <div
            className="dhpdoneenamesmall"
            onClick={() => {
              setViewProfile({ status: false, data: {} });
            }}
          >
            <img src={closePNG} alt="close" />
          </div>
        </div>
        <div className="dhpdoneebody">
          <div className="dhpdoneebodyleft">
            <div className="dhpdoneeinfo">
              <div className="dhpdoneedetailhead">Address</div>
            </div>
            <div className="dhpdoneeinfo">
              <div className="dhpdoneeprofilelabel">Street :</div>
              <div className="dhpdoneeprofilevalue">{address_1}</div>
            </div>
            <div className="dhpdoneeinfo">
              <div className="dhpdoneeprofilelabel">City :</div>
              <div className="dhpdoneeprofilevalue">{city}</div>
            </div>
            <div className="dhpdoneeinfo">
              <div className="dhpdoneeprofilelabel">State :</div>
              <div className="dhpdoneeprofilevalue">{state}</div>
            </div>
            <div className="dhpdoneeinfo">
              <div className="dhpdoneedetailhead">Contact Information</div>
            </div>
            <div className="dhpdoneeinfo">
              <div className="dhpdoneeprofilelabel">Phone No :</div>
              <div className="dhpdoneeprofilevalue">{phoneNumber}</div>
            </div>
            <div className="dhpdoneeinfo">
              <div className="dhpdoneeprofilelabel">E-mail :</div>
              <div className="dhpdoneeprofilevalue">{email}</div>
            </div>
          </div>
          <div className="dhpdoneebodyright">
            <div className="dhpdoneeinfo">
              <div className="dhpdoneedetailhead">Certificate</div>
            </div>
            <div className="dhpdoneecertificate">
              {certificate.status ? (
                <img src={certificate.url} alt="certificate" />
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Images = ({ photos }) => {
  const [allimages, setAllImages] = useState({ status: 0, noimage: 0 });
  useEffect(() => {
    if (photos.length) {
      convertbuff(photos).then((response) => {
        setAllImages({ status: 1, response });
      });
    } else {
      setAllImages({ status: 1, noimage: 1 });
    }
  }, [photos]);
  return (
    <>
      {allimages.status ? (
        <>
          {allimages.response.map((photo, index) => {
            return (
              <img
                src={`data:image/png;base64,${photo}`}
                alt="ProductImage"
                key={index}
              />
            );
          })}
        </>
      ) : (
        <>
          {allimages.noimage ? (
            <img src={noimage} alt="noimage" />
          ) : (
            <div className="dhploading">
              <Loading />
            </div>
          )}
        </>
      )}
    </>
  );
};

const convertbuff = async (photos) => {
  console.log(photos);
  const photoarray = [];
  for (let i = 0; i < photos.length; i++) {
    const response = await getPhotos(photos[i]);
    if (response.status === 1) {
      const onlybuff = response.photoBuffer.map((buff) => {
        return Buffer.from(buff.data);
      });
      console.log(onlybuff);
      const base64img = Buffer.concat(onlybuff);
      photoarray.push(base64img.toString("base64"));
    }
  }
  return photoarray;
};

const AddItem = ({ uid, setAddNewItem, count, userInfo }) => {
  const productNameInput = useRef(null);
  const addressInput = useRef(null);
  const cityInput = useRef(null);
  const fileInput = useRef(null);
  const [images, setImages] = useState({ status: false, files: [] });
  const [status, setStatus] = useState({ booli: false, msg: "" });
  const [reload, setReload] = useState(false);
  return (
    <div className="dhpnewitemdiv">
      <form className="dhpproductdetails">
        <label>Product name</label>
        <input type="text" ref={productNameInput} />
        <label>Address</label>
        <input type="text" ref={addressInput} />
        <label>City</label>
        <select ref={cityInput}>
          <option></option>
          <CitiesList state={userInfo.state} />
        </select>
        <label>Photos</label>
        <input
          type="file"
          hidden
          ref={fileInput}
          multiple
          onChange={(e) => {
            FileUrl(e.target.files, images.files).then((response) => {
              setImages({ status: true, files: response });
            });
          }}
        />
        <div className="dhpaddimages">
          <div
            className="dhpaddbutton"
            onClick={() => fileInput.current.click()}
          >
            +
          </div>
          {images.status && <UploadedImages images={images.files} />}
        </div>
        <div className="dhpnewitemstatus">
          <p>{status.msg}</p>
        </div>

        {reload ? (
          <Loading />
        ) : (
          <div className="dhpnewitemfooter">
            <button
              type="button"
              onClick={() => {
                if (
                  productNameInput.current.value !== "" &&
                  addressInput.current.value !== "" &&
                  cityInput.current.value !== "" &&
                  images.files.length !== 0
                ) {
                  setReload(true);
                  const data = {
                    uid,
                    productName: productNameInput.current.value,
                    address: addressInput.current.value,
                    city: cityInput.current.value,
                  };
                  uploadItems(fileInput.current.files, data).then(
                    (response) => {
                      console.log(response);
                      if (response.status) {
                        setAddNewItem({ booli: false, count: count + 1 });
                      } else {
                        setStatus({ booli: true, msg: response.msg });
                      }
                    }
                  );
                } else {
                  setStatus({ booli: true, msg: "Please enter all details" });
                }
              }}
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={() => {
                productNameInput.current.value = "";
                addressInput.current.value = "";
                cityInput.current.value = "";
                setImages({ status: false, files: [] });
                setStatus({ booli: false, msg: "" });
              }}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                setAddNewItem({ booli: false, count: count });
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const UploadedImages = ({ images }) => {
  return (
    <div className="dhpimages">
      <div className="dhpimagecontainer">
        {images.map((url, index) => {
          return (
            <img
              src={url}
              alt="uploadedImage"
              className="dhpuploadedimage"
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

const FileUrl = async (currentImages, previousImages) => {
  const url = [];
  for (let i = 0; i < currentImages.length; i++) {
    const singleUrl = await getUrl(currentImages[i]);
    url.push(singleUrl);
  }
  url.push(...previousImages);
  return url;
};

const getUrl = (prop) => {
  const readFile = new FileReader();
  return new Promise((resolve, reject) => {
    readFile.readAsDataURL(prop);
    readFile.onload = (e) => {
      resolve(e.target.result);
    };
  });
};

export default UserHomepage;
