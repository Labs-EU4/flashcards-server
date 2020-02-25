const { remove, updateProfile } = require('./model');

exports.deleteUser = async (req, res) => {
  try {
    await remove(req.decodedToken.subject);
    res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { subject } = req.decodedToken;
    const { fullName } = req.body;
    await updateProfile(subject, fullName);
    res.status(200).json({
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating profile ${error.message}` });
  }
};
