import React from "react";

const UserProfile = ({ user }) => {
  if (!user) return null;

  return (
    <div className="user-profile">
      <img src={user.photoURL || "/default-avatar.png"} alt="User avatar" />
      <span>{user.email}</span>
    </div>
  );
};

export default UserProfile;
