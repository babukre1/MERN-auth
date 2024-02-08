import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { app } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import axios from "axios";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
} from "../redux/userSlice";
export default function Profile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [userUpdated, setUserUpdated] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUserUpdated(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          hidden
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          className="w-24 h-24 self-center cursor-pointer rounded-full object-cover mt-3"
          src={formData.profilePicture || currentUser.profilePicture}
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
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          id="password"
          onChange={handleChange}
        />
        <button
          className="p-3 bg-slate-800 rounded-lg text-white
         uppercase hover:opacity-90
         disabled:opacity-80 "
        >
          {loading? "...loading" : "Update"}
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
      <p className="text-red-500 mt-5"> {error && "Something went wrong!"}</p>
      <p className="text-green-600 mt-5"> {userUpdated && "User Updated successfully!"}</p>
    </div>
  );
}
