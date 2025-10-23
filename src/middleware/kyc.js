import httpStatus from 'http-status';

export const requireVerified = (req, _res, next) => {
  const status = req.user?.kyc?.status || 'unsubmitted';
  if (status !== 'verified') {
    const err = new Error('Action not allowed until KYC is verified');
    err.statusCode = httpStatus.FORBIDDEN;
    return next(err);
  }
  return next();
};
