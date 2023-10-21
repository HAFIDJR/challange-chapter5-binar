const app = require("../../app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const request = require("supertest");
let users
let accounts 


describe("test POST /api/v1/accounts endpoint", () => {
  beforeAll(async () => {
    users = await prisma.users.findMany();
  });
  test("Menambahkan Account Baru dengan User Id ", async () => {
    try {
      let bankName = "VISA";
      let userId = users[0].id;
      let balance = 95000;
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({bankName,userId,balance});
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data).toHaveProperty("usersId");
    } catch (err) {
      console.log(err)
      expect(err).toBe("err");
    }
  });

  test('Menambhkan Account Baru ,dengan nama bank dan userId kosong',async () => {
    try {
      let bankName = null;
      let userId = null;
      let balance = 95000;
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({bankName,userId,balance});
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body.status).toBe(false);
      
    } catch (err) {
      console.log(err)
      expect(err).toBe("err");
    }
  });

  test('Membuat Account dengan UserId yang tidak terdaftar', async() => {
    try {
      let bankName = "MANDIRI";
      let userId = users[0].id +10;
      let balance = 95000;
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({bankName,userId,balance});
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body.status).toBe(false);
      
    } catch (err) {
      console.log(err)
      expect(err).toBe("err");
    }
  });
});


describe("test GET/api/v1/accounts/", () => {
  test("Menampilkan semua users yang sudah terdaftar", async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/accounts/`);
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body.status).toBe(true);
      expect(body.data[0]).toHaveProperty("bank_name");
      expect(body.data[0]).toHaveProperty("bank_account_number");
      expect(body.data[0]).toHaveProperty("balance");
      expect(body.data[0]).toHaveProperty("usersId");
    } catch (err) {
      expect(err).toBe("err");
    }
  });
});

describe("test GET/api/v1/accounts/", () => {
  test("Menampilkan semua users yang sudah terdaftar", async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/accounts/`);
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body.status).toBe(true);
      expect(body.data[0]).toHaveProperty("bank_name");
      expect(body.data[0]).toHaveProperty("bank_account_number");
      expect(body.data[0]).toHaveProperty("balance");
      expect(body.data[0]).toHaveProperty("usersId");
    } catch (err) {
      expect(err).toBe("err");
    }
  });
});


describe("test GET/api/v1/accounts/:id", () => {
  beforeAll(async () => {
    accounts = await prisma.bankAccounts.findMany();
  });
  test("mencari Account dengan id yang terdaftar", async () => {
    try {
      
      let { statusCode, body } = await request(app).get(
        `/api/v1/accounts/${accounts[0].id}`
      );
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data).toHaveProperty("usersId");
    } catch (err) {
      console.log(err)
      expect(err).toBe("err");
    }
  });

  test("mencari Account dengan id yang tidak terdaftar", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/users/${accounts[0].id + 1990}`
      );
      expect(statusCode).toBe(404);
      expect(body.status).toBe(false);
    } catch (err) {
      expect(err).toBe("err");
    }
  });
});



