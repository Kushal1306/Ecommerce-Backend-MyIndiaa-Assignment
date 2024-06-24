
const checkRole = (role) => {
    return (req, res, next) => {
      if (req.userId && req.role === role) {
        next();
      } else {
        res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
      }
    };
  };
  
export default checkRole;
  