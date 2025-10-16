const authorityService = require('./authorityService');

const loginAuthority = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { token, authority } = await authorityService.loginAuthority(username, password);
    res.json({ token, authority });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  loginAuthority,
};
