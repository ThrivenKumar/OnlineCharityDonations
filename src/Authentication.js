import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
var firebaseConfig = {
  apiKey: "AIzaSyBRXHFVSu-E-K7uRqvyVpOJ1DINWyKzZHo",
  authDomain: "onlinecharitydonations.firebaseapp.com",
  projectId: "onlinecharitydonations",
  storageBucket: "onlinecharitydonations.appspot.com",
  messagingSenderId: "806074930971",
  appId: "1:806074930971:web:91aa7a7bd341ced68825be",
  databaseURL: "https://onlinecharitydonations-default-rtdb.firebaseio.com/",
  measurementId: "G-CY0XR4ZJZ9",
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const storageRef = storage.ref();

export const CharityRegister = async (prop, file, photos) => {
  const {
    name,
    addressLine1,
    addressLine2,
    city,
    state,
    phoneNo,
    email,
    password,
  } = prop;
  try {
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const userId = user.user.uid;
    firebase
      .database()
      .ref("users/" + userId)
      .set({
        username: name,
        address_1: addressLine1,
        address_2: addressLine2,
        city: city,
        state: state,
        phoneNumber: phoneNo,
        email: email,
        type: "charity",
      });
    console.log(file);
    const certificateRef = storageRef.child(`certificates/${email}`);
    const response = await certificateRef.put(file[0]);
    const photosRef = storageRef.child(`photos/${email}`);
    for (let i = 0; i < photos.length; i++) {
      const fileRef = photosRef.child(`${i}`);
      await fileRef.put(photos[i]);
    }
    console.log(response);
    // const anotherRef = storageRef.child(`/cetificates/${prop.fileName}`);
    return { status: 1, uid: userId };
  } catch (e) {
    console.log(e);
    return { status: 0, code: e.code };
  }
};

export const charityLogin = async (email, password) => {
  try {
    const response = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    console.log(response.user);
    const userRef = firebase.database().ref();
    const userData = await userRef
      .child("users")
      .child(response.user.uid)
      .get();
    if (userData.exists()) {
      console.log(userData.val());
      return {
        status: true,
        loading: false,
        userData: userData.val(),
        uid: response.user.uid,
      };
    }
  } catch (e) {
    console.log(e);
    return { status: false, loading: false, msg: e.code };
  }
};

export const getCertificate = async (email) => {
  try {
    const urls = [];
    const certificateURL = await storageRef
      .child(`certificates/${email}`)
      .getDownloadURL();
    urls.push(certificateURL);
    const otherPhotosRef = await storageRef.child(`photos/${email}`);
    const otherPhotosURL = await otherPhotosRef.listAll();
    const len = otherPhotosURL.items.length;
    for (let i = 0; i < len; i++) {
      const photourl = await otherPhotosURL.items[i].getDownloadURL();
      urls.push(photourl);
    }
    console.log(urls);
    return { status: true, urls };
  } catch (e) {
    console.log(e);
    return { status: false, msg: "Failed to load image" };
  }
};

export const DonorRegistration = async (prop) => {
  const {
    name,
    addressLine1,
    state,
    city,
    addressLine2,
    phoneNo,
    email,
    password,
  } = prop;
  try {
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const userId = user.user.uid;
    await firebase
      .database()
      .ref("users/" + userId)
      .set({
        username: name,
        address_1: addressLine1,
        address_2: addressLine2,
        state: state,
        city: city,
        phoneNumber: phoneNo,
        email: email,
        type: "donor",
      });
    console.log(user);
    return { uid: userId, status: 1 };
  } catch (e) {
    console.log(e);
    return { status: 0, code: e.code };
  }
};
export const getDoneeData = async (requests) => {
  try {
    const donees = [];
    const doneeRef = firebase.database().ref();
    // requests.map(async (request) => {
    //   console.log(request);
    //   const donee = await doneeRef.child("users").child(request.doneeuid).get();
    //   if (donee.exists()) {
    //     donees.push(donee.val());
    //   }
    // });
    for (let i = 0; i < requests.length; i++) {
      console.log(requests[i]);
      const donee = await doneeRef
        .child("users")
        .child(requests[i].doneeuid)
        .get();
      if (donee.exists()) {
        donees.push(donee.val());
      }
    }
    console.log(donees);
    return { status: 1, donees };
  } catch (e) {
    return { status: 0 };
  }
};

export const getSingleDonee = async (uid) => {
  try {
    const doneeRef = firebase.database().ref();
    const donee = await doneeRef.child("users").child(uid).get();
    if (donee.exists()) {
      console.log(donee.val());
      return { status: 1, donee: donee.val() };
    }
  } catch (e) {
    console.log(e);
    return { status: 0 };
  }
};

export const getDonorsData = async (products) => {
  try {
    const donorRef = firebase.database().ref();
    const donorsData = [];
    for (let i = 0; i < products.length; i++) {
      const donor = await donorRef.child("users").child(products[i].uid).get();
      if (donor.exists()) {
        console.log(donor.val());
        donorsData.push(donor.val());
      }
    }
    return { status: 1, donorsData };
  } catch (e) {
    console.log("getDonorsData Error", e);
    return { status: 0 };
  }
};

export const LogoutUser = async () => {
  try {
    await firebase.auth().signOut();
    return { status: 1 };
  } catch (e) {
    console.log("SignOut Unsuccessful", e);
    return { status: 0 };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await firebase.auth().sendPasswordResetEmail(email);
    console.log(response);
    return { status: true, msg: "mail sent", response };
  } catch (e) {
    return { status: false, msg: e.code };
  }
};
