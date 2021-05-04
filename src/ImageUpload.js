import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  //   const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    if (caption != null && image != null) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);

      uploadTask.on(
        "status_changed",
        (snapshot) => {
          //progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
          alert(error.message);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageurl: url,
                userName: username,
              });

              setProgress(0);
              setCaption("");
              setImage(null);
            });
        }
      );
    }
  };
  return (
    <div className="imageupload">
      <progress className="imageupload-progress" value={progress} max="100" />
      <input
        className="imageupload-caption"
        type="text"
        placeholder="Enter a caption"
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input
        type="file"
        className="imageupload-file"
        placeholder="Upload Image"
        onChange={handleChange}
      />
      <Button
        className="imageupload-button"
        id="imageupload-button"
        onClick={handleUpload}
      >
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
