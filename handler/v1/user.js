const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createUser: async (req, res, next) => {
    try {
      let { name, email, password, gender, identityNumber, address } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          status: false,
          message: "name ,email,or password undifined ",
        });
      }
      let findUserExist = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });
      if (findUserExist) {
        return res.status(404).json({
          status: false,
          message: `Use another email , email already registered `,
        });
      }
      let newUser = await prisma.users.create({
        data: {
          name: name,
          email: email,
          password: password,
          profile: {
            create: {
              gender: gender,
              identityNumber: identityNumber,
              address: address,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      res.status(201).json({
        status: true,
        message: "Succes to Create Users",
        data: newUser,
      });
    } catch (err) {
      next(err);
    }
  },

  // get all users
  getAllUsers: async (req, res, next) => {
    try {
      let users = await prisma.users.findMany();
      res.status(200).json({
        status: true,
        message: "OK",
        data: users,
      });
    } catch (err) {
      next(err);
    }
  },

  // get user detail
  getUserDetail: async (req, res, next) => {
    try {
      let { userId } = req.params;
      let user = await prisma.users.findFirst({
        where: { id: Number(userId) },
        include: {
          profile: {
            select: {
              gender: true,
              address: true,
              identityNumber: true,
            },
          },
        },
      });
      if (!userId) {
        return res.status(400).json({
          status: false,
          message: "Bad Request",
        });
      }
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "Data Users Not Found ",
          data: null,
        });
      }
      res.status(200).json({ status: true, message: "OK", data: user });
    } catch (err) {
      next(err);
    }
  },
};
