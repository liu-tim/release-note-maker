exports.getUser = (req, res) => {
  res.send({ user: req.session.user });
};
