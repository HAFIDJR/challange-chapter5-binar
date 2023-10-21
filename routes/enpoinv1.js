const express = require("express");
const router = express.Router();
const { restrict } = require('../middleware/auth.middlewares');
const {
  createUser,
  getAllUsers,
  getUserDetail,
} = require("../handler/v1/user");

const {
  createAccount,
  getAllAccount,
  getAccountDetail,
} = require("../handler/v1/account");

const {
  createTransaction,
  getTransactions,
  getTransactionDetail,
} = require("../handler/v1/transactions");

const {
  login,
  register,
  whoami,
} = require("../handler/v1/auth");




router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "welcome to CHALLANGE BINAR prisma api",
  });
});

// Endpoin Users
router.post("/users", createUser);
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetail);

// Endpoint Accounts
router.post("/accounts", createAccount);
router.get("/accounts", getAllAccount);
router.get("/accounts/:accountsId", getAccountDetail);

// Endpoint Transactions
router.post("/transaction", createTransaction);
router.get("/transaction", getTransactions);
router.get("/transaction/:idTransaction", getTransactionDetail);

// Login and Register
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/authenticate',restrict ,whoami);

module.exports = router;
