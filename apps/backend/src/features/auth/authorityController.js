const { loginAuthority } = require('../../localAuth');

const loginAuthorityController = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const result = await loginAuthority(username, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  loginAuthority: loginAuthorityController,
};
