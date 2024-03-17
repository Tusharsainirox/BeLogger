import express, { json } from "express";
import mongoose from "mongoose";
import bcypt from "bcrypt";
import "dotenv/config";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import serviceAccountKey from "./firebaseConnect.json" assert {type:"json"} ;
import { getAuth } from "firebase-admin/auth";
import aws from "aws-sdk"


const server = express();
const port = 3000;

//Schemas
import User from "./Schema/User.js";

//fireBase
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});


//setting up aws s3 bucket
const s3 = new aws.S3({
  region : 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY ,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY

})

const getFormatDataToSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token: access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  isUsernameNotUnique ? (username += nanoid().substring(0, 5)) : "";
  return username;
};

server.post("/signup", (req, res) => {
  let { fullname, email, password } = req.body;
  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be atleast 3 letters long" });
  }
  if (!email.length) {
    return res.status(403).json({ error: "Enter Email" });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email Invaild" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password should be 6 Ito 20 characters long with a numeric, 1 lowercase and 1 uppercase",
    });
  }

  bcypt.hash(password, 10, async (err, hashed_password) => {
    const username = await generateUsername(email);

    let user = new User({
      personal_info: {
        fullname,
        email,
        password: hashed_password,
        username,
      },
    });

    user
      .save()
      .then((u) => {
       return res.status(200).json(getFormatDataToSend(u));
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res.status(500).json({ error: "Email already exists!" });
        }
        return res.status(500).json({ error: err.message });
      });
  });
});

server.post("/signin", (req, res) => {
  let { email, password } = req.body;
  // console.log(email,password)
  User.findOne({ "personal_info.email": email })
    .then((user) => {
      // console.log(user)
      if (!user) {
        return res.status(403).json({ error: "Email not found" });
      }
      if(!user.google_auth){
        bcypt.compare(password, user.personal_info.password, (err, result) => {
          if (err) {
            return res
              .status(403)
              .json({ error: "error while loggin please try later" });
          }
          if (!result) {
            return res.status(403).json({ error: "password incorrect" });
          }
          if (result) {
            return res.status(200).json(getFormatDataToSend(user));
          }
        });
      }else{
        return res.status(403).json({"error" : "Account was created using google, Try signing in with Google"})
      }
      
      // return res.status(200).json({ message: "Got user document" });
    })
    .catch((error) => {
      return res.status(403).json({ error: error.message });
    });
});

server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });

      if (user) {
        //login
        if (!user.google_auth) {
          return res
            .status(403)
            .json({
              "error":
                "This email was already signed without google, please use the password to access the account",
            });
        }
      } else {
        let username = await generateUsername(email);
        user = new User({
          personal_info: {
            email: email,
            fullname: name,
            username: username,
          },
          google_auth: true
        });

        await user.save().then((u)=>{
          user = u
        }).catch(err=>{
          return res.status(500).json({"error":err.message})
        })
      }

      return res.status(200).json(getFormatDataToSend(user))

    }).catch(err=>{
      if(!res.headersSent){
        return res.status(500).json({"error":"You failed to login with google.Try with another account"})
      }
    })
});

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
