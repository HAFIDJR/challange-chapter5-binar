const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createTransaction: async (req, res, next) => {
    try {
      const { senderId, destinationId, amount } = req.body;
      if (!senderId || !destinationId || !amount) {
        return res.status(400).json({
          status: false,
          message: "Bad Request",
        });
      }
      let accountSender = await prisma.bankAccounts.findUnique({
        where: {
          id: senderId,
        },
      });
      let accountDestination = await prisma.bankAccounts.findUnique({
        where: {
          id: destinationId,
        },
      });
      if (!accountDestination || !accountSender) {
        return res.status(404).json({
          status: false,
          message: "Bank Account Not Found",
          data: null,
        });
      }
      const transactions = await prisma.transactions.create({
        data: {
          sourceAccountId: senderId,
          destinationAccountId: destinationId,
          amount: amount,
        },
      });

      res.status(201).json({
        status: true,
        message: "OK",
        data: transactions,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  getTransactions: async (req, res, next) => {
    try {
      let allTransaction = await prisma.transactions.findMany();
      if (!allTransaction) {
        return res.status(404).json({
          status: false,
          message: "Bad Request",
          data: null,
        });
      }
      res.status(200).json({
        status: true,
        message: "Succces to show Transaction",
        data: allTransaction,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  getTransactionDetail: async (req, res, next) => {
    try {
      const { idTransaction } = req.params;
      const transaction = await prisma.transactions.findUnique({
        where: {
          id: Number(idTransaction),
        },
        include: {
          bankAccountDestination: {
            select: {
              Users: {
                select: {
                  name: true,
                  email: true,
                  profile: true,
                },
              },
            },
          },
          bankAccountsSource: {
            select: {
              Users: {
                select: {
                  name: true,
                  email: true,
                  profile: true,
                },
              },
            },
          },
        },
      });
      if (!transaction) {
        return res.status(404).json({
          status: false,
          message: `Transaction Not Found`,
          data : null
        });
      }

      const dataTransaction = {
        id: transaction.id,
        amount: transaction.amount,
        userPengirim: transaction.bankAccountsSource.Users,
        userPenerima: transaction.bankAccountDestination.Users,
      };
      res.status(200).json({
        status: true,
        message: "OK",
        data: dataTransaction,
      });
    } catch (error) {
      next(error);
    }
  },
};
