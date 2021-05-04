import React, { useState, useEffect } from "react";
import "./Post.css";
import { Avatar } from "@material-ui/core";
import { db } from "./firebase";
import firebase from "firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button } from "@material-ui/core";

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
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    display: "block",
    height: 400,
    overflow: "scroll",
    scroll: "paper",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Post({ postId, user, userName, caption, imageURL }) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  return (
    <div className="post">
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <div className="post_comments">
            {comments.map((comment) => {
              return (
                <p>
                  <b>{comment.username} </b> {comment.text}
                </p>
              );
            })}
          </div>
        </div>
      </Modal>
      <div className="post_header">
        <Avatar
          className="post_avatar"
          id="profile_avatar"
          src="{userName}"
          alt={userName}
        />
        <h3>{userName}</h3>
      </div>
      <img src={imageURL} alt="Post" className="post_image" />
      <h4 className="post_text">
        <strong> {userName} :</strong> {caption}
      </h4>

      {comments.length === 0 ? (
        <></>
      ) : (
        <div>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            View all {comments.length} comments
          </Button>
          <div className="post_comment">
            <p>
              <b>{comments[0].username}</b> : {comments[0].text}
            </p>
          </div>
        </div>
      )}

      {user && (
        <form className="post_commentBox">
          <input
            className="post_input"
            type="text"
            placeholder="Add comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post_button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
