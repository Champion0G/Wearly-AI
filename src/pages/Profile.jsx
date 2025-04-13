import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/profile.css';

function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>
        <div className="profile-info">
          <div className="info-group">
            <label>Name</label>
            <p>{user?.name || 'N/A'}</p>
          </div>
          <div className="info-group">
            <label>Email</label>
            <p>{user?.email || 'N/A'}</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="edit-profile">Edit Profile</button>
          <button className="change-password">Change Password</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
