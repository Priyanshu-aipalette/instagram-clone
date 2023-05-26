import "./App.css";
import Post from "./Post";
import React, { useState } from "react";
import { useEffect } from "react";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Avatar } from "@material-ui/core";
import { Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import { hotjar } from 'react-hotjar';



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 350,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user is logged in
        setUser(authUser);
        if (authUser.displayName) {
          //don't update username
        } else {
          return authUser
            .updateProfile({
              displayName: username,
            })
            .then(() => {
              console.log("successful");
              setUser(user);
            })
            .catch((error) => {
              console.log("error");
            });
        }
      } else {
        //user is looged out
        setUser(null);
        setPassword("");
        setEmail("");
        setUsername("");
      }
    });

    return () => {
      //perform some cleanup options
      unsubscribe();
    };
  }, [user, username]);

  useEffect(()=>{
    const siteId = 3508816;
    const hotjarVersion = 6;

    hotjar.initialize(siteId, hotjarVersion);
    hotjar.identify('USER_ID', { email:email });

    
    // Initializing with `debug` option:
    // Hotjar.init(siteId, hotjarVersion, {
    //   debug: true
    // });
  },[email])

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => {
        alert(error.message);
      });

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      alert(error.message);
    });

    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <div className="app_header">
              <div className="logo">
                <img
                  src="https://image.freepik.com/free-vector/instagram-icon_1057-2227.jpg"
                  alt="Instagram"
                  className="app_headerImage"
                />
                <span>InstaClone</span>
              </div>
            </div>
            <form className="app-signup">
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Input
                placeholder="password"
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Button type="submit" onClick={signUp}>
                SignUp
              </Button>
            </form>
          </center>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => {
          setOpenSignIn(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <div className="app_header">
              <div className="logo">
                <img
                  src="https://image.freepik.com/free-vector/instagram-icon_1057-2227.jpg"
                  alt="Instagram"
                  className="app_headerImage"
                />
                <span>InstaClone</span>
              </div>
            </div>
            <form className="app-signup">
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Input
                placeholder="password"
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Button type="submit" onClick={signIn}>
                SignIn
              </Button>
            </form>
          </center>
        </div>
      </Modal>
      <div className="app_header">
        <div className="logo">
          <img
            src="https://image.freepik.com/free-vector/instagram-icon_1057-2227.jpg"
            alt="Instagram"
            className="app_headerImage"
          />
          <span>InstaClone</span>
        </div>
        {user ? (
          <Button
            onClick={() => {
              auth.signOut();
            }}
          >
            Sign Out
          </Button>
        ) : (
          <div className="app_loginContainer">
            <Button
              onClick={() => {
                setOpenSignIn(true);
              }}
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      <div className="app_flex">
        <div className="app_posts">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              userName={post.userName}
              caption={post.caption}
              imageURL={post.imageurl}
            />
          ))}
        </div>
        <div className="right_flex">
          {user ? (
            <>
              {/* {user?.displayName ? (
                <> */}

              <h3 className="post_heading">Upload Post</h3>
              <div className="profile">
                <Avatar
                  className="profile_avatar"
                  id="profile_avatar"
                  src="{user.displayName}"
                  alt={user.displayName}
                />
                <h3>{user.displayName}</h3>
              </div>

              <ImageUpload username={user.displayName} />
              {/* </>
              ) : (
                <></>
              )} */}
            </>
          ) : (
            <div className="login_details">
              <h3>Please Login First to upload posts.</h3>
              <h3>
                If you don't want to register you can use following details :
                <br /> Email Id - User@gmail.com <br /> Password - 12345678
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
