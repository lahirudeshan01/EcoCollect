const Authority = require('./authorityModel');
const jwt = require('jsonwebtoken');

const loginAuthority = async (username, password) => {
  const authority = await Authority.findOne({ username });
  if (!authority) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await authority.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: authority._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return { token, authority: { username: authority.username } };
};

module.exports = {
  loginAuthority,
};
