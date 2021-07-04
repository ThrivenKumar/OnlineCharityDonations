const express = require("express");
const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");
const multer = require("multer");
const { Readable } = require("stream");

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const uri =
  "mongodb+srv://RateandReview:SherlocK221b@cluster0.pujmu.mongodb.net/ReviewsandRatings?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectToDatabase = async () => {
  await client.connect();
  const db = client.db("OnlineCharityDonations");
  console.log("connected to db");
  return db;
};

const postPhotos = async () => {
  try {
    const db = await connectToDatabase();
    const bucket = new GridFSBucket(db, {
      bucketName: "productImages",
    });
    return bucket;
  } catch (e) {
    console.log("Post photos", e);
  }
  // } finally {
  // client.close();
  // }
};

const findDonor = async (prop, collectionName) => {
  try {
    const db = await connectToDatabase();
    const donor = db.collection(collectionName);
    const result = await donor.findOne({ uid: prop });
    return result;
  } catch (e) {
    console.log("Find donor", e);
  }
  // } finally {
  // client.close();
  // }
};

const findDonorsData = async (collectionName) => {
  try {
    const db = await connectToDatabase();
    const donor = db.collection(collectionName);
    const products = [];
    await donor.find().forEach((doc) => {
      console.log(doc);
      products.push({
        uid: doc.uid,
        products: doc.products,
      });
    });
    return { status: 1, products: products };
  } catch (e) {
    console.log("Error", e);
    return { status: 0 };
  }
};

const findSingleDonor = async (uid) => {
  try {
    const response = await findDonor(uid, "donor");
    if (response === null) {
      console.log("Donor Home Request Found No products");
      return { status: 0 };
    }
    const cities = response.cities;
    const products = [];
    for (let i = 0; i < cities.length; i++) {
      const donatedItem = await findDonor(uid, cities[i]);
      products.push(...donatedItem.products);
    }
    console.log(products);
    return { status: 1, products };
  } catch (e) {
    console.log("Find single Donor ", e);
    return { status: 0 };
  }
};

const insertData = async (data, collectionName) => {
  try {
    const db = await connectToDatabase();
    const donorData = db.collection(collectionName);
    const result = await donorData.insertOne(data);
    console.log(`inserted ${result.insertedCount} entries`);
  } catch (e) {
    console.log("Insert data", e);
  }
};

const updateData = async (data) => {
  const { uid, productId, productName, address, photoIDs, city } = data;
  try {
    const db = await connectToDatabase();
    const donorData = db.collection(city);
    const result = await donorData.updateOne(
      { uid: uid },
      {
        $push: {
          products: {
            productId,
            productName,
            address,
            photos: photoIDs,
            donated: { status: false, name: "", uid: "" },
            requests: [],
            city,
          },
        },
      }
    );
    console.log(`Update response ${result.modifiedCount}`);
  } catch (e) {
    console.log("Update data error", e);
  }
};

const updateDonorCities = async (data) => {
  try {
    const { uid, city } = data;
    const db = await connectToDatabase();
    const donorData = db.collection("donor");
    const result = await donorData.updateOne(
      { uid: uid },
      { $push: { cities: city } }
    );
    console.log(`Update response ${result}`);
  } catch (e) {
    console.log("Donor Cities update Error", e);
  }
};

const putRequest = async (data) => {
  try {
    const { donoruid, doneeuid, city, productId } = data;
    console.log("donee UID", doneeuid);
    console.log("Index Value", productId);
    const db = await connectToDatabase();
    const donorData = db.collection(city);
    const updateQuery = {
      $push: { "products.$.requests": { doneeuid, status: "pending" } },
    };
    const result = await donorData.updateOne(
      { uid: donoruid, "products.productId": ObjectId(productId) },
      updateQuery
    );
    console.log(`Modified ${result.modifiedCount} records`);
    return `Modified ${result.modifiedCount} records`;
  } catch (e) {
    console.log(e);
  }
};

const accceptRequest = async (data) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(data.city);
    const response = await collection.updateOne(
      { uid: data.donoruid, "products.productId": ObjectId(data.productid) },
      {
        $set: { "products.$.donated": { status: true, uid: data.doneeuid } },
      }
    );
    console.log(`Accept Request: Modified ${response.modifiedCount} records`);
    return { status: 1, modifiedCount: response.modifiedCount };
  } catch (e) {
    return { status: 0 };
  }
};

const delRequest = async (data) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(data.city);
    const response = await collection.updateOne(
      { uid: data.uid, "products.productId": ObjectId(data.productid) },
      {
        $pull: { "products.$.requests": { doneeuid: data.doneeuid } },
      }
    );
    console.log(`Delete Request: Modified ${response.modifiedCount} records`);
    return { status: 1, ModifiedCount: response.modifiedCount };
  } catch (e) {
    return { status: 0 };
  }
};

const deleteItem = async (data) => {
  const { photos } = data;
  const db = await connectToDatabase();
  const collection = db.collection(data.city);
  const response = await collection.updateOne(
    { uid: data.uid },
    {
      $pull: { products: { productId: ObjectId(data.productId) } },
    }
  );
  const bucket = await postPhotos();
  for (let i = 0; i < photos.length; i++) {
    bucket.delete(ObjectId(photos[i]), (err) => {
      if (err) {
        console.log(`Error While deleting photo with id ${photos[i]} : ${err}`);
      }
      console.log(`Deleted a photo with id ${photos[i]}`);
    });
  }
  console.log(`Delete Item: Modified ${response.modifiedCount} records`);
  return `Delete Item: Modified ${response.modifiedCount} records`;
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options("*", (req, res) => {
  res.header({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end();
});

app.delete("/deleteItem", (req, res) => {
  console.log(req.url);
  console.log(req.method);
  console.log(req.body);
  deleteItem(req.body).then((response) => {
    res
      .status(200)
      .set({
        "Access-Control-Allow-Origin": "*",
      })
      .json({ msg: response });
  });
});

app.post("/acceptRequest", (req, res) => {
  console.log("Accept Request");
  console.log(req.method);
  console.log(req.body);
  accceptRequest(req.body).then((response) => {
    res
      .status(200)
      .set({
        "Access-Control-Allow-Origin": "*",
      })
      .json(response);
  });
});

app.delete("/deleteRequest", (req, res) => {
  console.log("Delete Request");
  console.log(req.method);
  console.log(req.body);
  delRequest(req.body).then((response) => {
    res
      .status(200)
      .set({
        "Access-Control-Allow-Origin": "*",
      })
      .json(response);
  });
});

app.get("/charityGetRequest/:city", async (req, res) => {
  console.log(req.method);
  const { city } = req.params;
  const response = await findDonorsData(city);
  res
    .status(200)
    .set({
      "Access-Control-Allow-Origin": "*",
    })
    .json(response);
});

app.get("/donorGetRequest/:uid", async (req, res) => {
  console.log(req.method);
  const { uid } = req.params;
  try {
    const response = await findSingleDonor(uid);
    console.log(response);
    res.status(200).set({ "Access-Control-Allow-Origin": "*" }).json(response);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .set({ "Access-Control-Allow-Origin": "*" })
      .json({ status: 0 });
  }
});

app.get("/getPhoto/:photoId", async (req, res) => {
  const { photoId } = req.params;
  const bucket = await postPhotos();
  var buff = [];
  const dowloadStream = await bucket.openDownloadStream(ObjectId(photoId));
  dowloadStream.on("data", (chunk) => {
    buff.push(chunk);
    console.log(chunk);
  });
  dowloadStream.on("error", (err) => {
    console.log(err);
    res
      .status(500)
      .set({
        "Access-Control-Allow-Origin": "*",
      })
      .json({ status: 0 });
  });
  dowloadStream.on("end", () => {
    res
      .status(200)
      .set({
        "Access-Control-Allow-Origin": "*",
      })
      .json({ status: 1, photoBuffer: buff });
  });
});

app.post("/sendRequest", async (req, res) => {
  console.log("send request");
  console.log(req.method);
  console.log(req.body);
  const response = await putRequest(req.body);
  res
    .set({
      "Access-Control-Allow-Origin": "*",
    })
    .status(200)
    .json({ status: response });
});

app.post("/uploadImages", upload.array("productImages"), async (req, res) => {
  console.log(req.method);
  console.log(req.files);
  console.log("body", req.body);
  const { uid, productName, address, city } = req.body;
  var photoIDs = [];
  try {
    const bucket = await postPhotos();
    for (let i = 0; i < req.files.length; i++) {
      const readableStream = new Readable({
        read() {},
      });
      readableStream.push(req.files[i].buffer);
      readableStream.push(null);
      const uploadStream = bucket.openUploadStream(req.files[i].originalname);
      photoIDs.push(uploadStream.id);
      readableStream.pipe(uploadStream);
    }
    console.log("photos", photoIDs);
    const count = await findDonor(uid, "donor");
    if (count) {
      console.log(count);
      let booli = false;
      for (let i = 0; i < count.cities.length; i++) {
        if (count.cities[i] === city) {
          booli = true;
        }
      }
      console.log(photoIDs[0]);
      if (booli) {
        const newData = {
          uid,
          productId: photoIDs[0],
          productName,
          address,
          photoIDs,
          city,
        };
        console.log("update data");
        updateData(newData);
      } else {
        console.log("New City added");
        const cityanduid = { city, uid };
        await updateDonorCities(cityanduid);
        const newData = {
          uid,
          products: [
            {
              productId: photoIDs[0],
              productName,
              address,
              photos: photoIDs,
              donated: { status: false, uid: "" },
              requests: [],
              city,
            },
          ],
        };
        await insertData(newData, city);
      }
    } else {
      const donor = {
        uid,
        cities: [city],
      };
      await insertData(donor, "donor");
      const newData = {
        uid,
        products: [
          {
            productId: photoIDs[0],
            productName,
            address,
            photos: photoIDs,
            donated: { status: false, uid: "" },
            requests: [],
            city,
          },
        ],
      };
      await insertData(newData, city);
    }
    res
      .set({ "Access-Control-Allow-Origin": "*" })
      .status(200)
      .json({ msg: "Upload finished", status: true });
  } catch (e) {
    console.log(e);
    res
      .set({ "Access-Control-Allow-Origin": "*" })
      .status(500)
      .json({ msg: "Server error try again", status: false });
  }
});

app.listen(5000, () => {
  console.log("server listening at port 5000");
});
