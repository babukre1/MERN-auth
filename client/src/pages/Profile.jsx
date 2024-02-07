import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
      console.log(formData);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    setImageError(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.floor(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          hidden
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          className="w-24 h-24 self-center cursor-pointer rounded-full object-cover mt-3"
          src={currentUser.profilePicture}
          alt="profile picture"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm font-semibold self-center">
          {imageError ? (
            <span className="text-red-700">Error uploading image</span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span>{`uploading: ${imagePercent}%`}</span>
          ) : formData.profilePicture ? (
            <span className="text-green-500">Image Uploaded Succesfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Usename"
          className="bg-slate-100 rounded-lg p-3"
          id="username"
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          id="email"
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          id="password"
        />
        <button
          className="p-3 bg-slate-800 rounded-lg text-white
         uppercase hover:opacity-90
         disabled:opacity-80 "
        >
          update
        </button>
      </form>
      <div className="flex justify-between mt-3">
        <span className="text-red-500 cursor-pointer font-semibold">
          Delete Account
        </span>
        <span className="text-red-500 cursor-pointer font-semibold">
          Sign Out
        </span>
      </div>
    </div>
  );
}
