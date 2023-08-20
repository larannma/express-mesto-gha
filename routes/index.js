const router = require('express').Router();
const userRouter = require('./users');

router.use(userRouter);
// router.use(cardrRouter);

module.exports = router;
