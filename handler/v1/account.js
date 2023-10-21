const { PrismaClient,Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const rn = require("random-number");
var options = {
  min: 1000,
  max: 9999,
  integer: true,
};

module.exports = {
  createAccount: async (req, res, next) => {
    try {
      const accountNumber = rn(options);
      JSON.stringify(
        this,
        (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
      );
      const { bankName, balance = 0, userId } = req.body;
      if (!bankName || !userId) {
        return res.status(400).json({
          status: false,
          message: "Bad Request",
        });
      }
      const findUser = await prisma.users.findFirst({
        where: {
          id: userId,
        },
      });
      if (!findUser) {
        return res.status(404).json({
          status: false,
          message: `Data Users Not Found`,
          data :null
        });
      }

      const bankAccount = await prisma.bankAccounts.create({
        data: {
          bank_name: bankName,
          bank_account_number: accountNumber,
          balance: balance,
          usersId: userId,
        },
      });
      res.status(201).json({
        status: true,
        message: "OK",
        data: bankAccount,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllAccount: async (req, res, next) => {
    try {
      const bankAccount = await prisma.bankAccounts.findMany({
        include: {
          Users: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
      res.status(200).json({
        status: true,
        message: "Succes show Account Bank",
        data: bankAccount,
      });
    } catch (error) {
      next(error);
    }
  },
  getAccountDetail: async (req, res, next) => {
    try {
      const { accountsId } = req.params;
      const detailAccount = await prisma.bankAccounts.findUnique({
        where: {
          id: Number(accountsId),
        },
        include: {
          Users: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if(!accountsId){
        return res.status(400).json({
          status: false,
          message: "Bad Request",
        });
      }

      if (!detailAccount) {
        return res.status(404).json({
          status: false,
          message: `Bank Account Not Found`,
          data : null
        });
      }

      res.status(200).json({
        status: true,
        message: `Succes to Show Data with id ${accountsId}`,
        data: detailAccount,
      });
    } catch (error) {
      next(error);
    }
  },
};
