import jwt from 'jsonwebtoken';

const generateToken = {
  // Tạo access token của độc giả
  async generateReaderAccessToken (reader, secretKey, expiresIn) {
    return jwt.sign(
      { MADOCGIA: reader.MADOCGIA },
      secretKey,
      { expiresIn: expiresIn }
    );
  },
  // Tạo refresh token của độc giả
  async generateReaderRefreshToken (reader, secretKey, expiresIn) {
    return jwt.sign(
      { MADOCGIA: reader.MADOCGIA },
      secretKey,
      { expiresIn: expiresIn }
    );
  }
};

export default generateToken;
