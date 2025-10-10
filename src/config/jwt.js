module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'default_secret_key',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    jwtAlgorithm: 'HS256'
};
