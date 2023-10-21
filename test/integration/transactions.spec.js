const app = require("../../app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const request = require("supertest");
let users;
let accounts;
let transactions;

describe("test POST /api/v1/transaction endpoint", () => {
  beforeAll(async () => {
    accounts = await prisma.bankAccounts.findMany();
  });
  test("Menambahkan Transaksu Baru dengan Account Id ", async () => {
    try {
      let senderId = accounts[0].id;
      let destinationId = accounts[0].id;
      let amount = 11000;
      let { statusCode, body } = await request(app)
        .post("/api/v1/transaction")
        .send({ senderId, destinationId, amount });
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("sourceAccountId");
      expect(body.data).toHaveProperty("destinationAccountId");
      expect(body.data).toHaveProperty("amount");
    } catch (err) {
      expect(err).toBe("err");
    }
  });

  test("Menambhkan Transaksu Baru ,dengan senderId  dan destinationId kosong", async () => {
    try {
      let senderId = null;
      let destinationId = null;
      let amount = 11000;
      let { statusCode, body } = await request(app)
        .post("/api/v1/transaction")
        .send({ senderId, destinationId, amount });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body.status).toBe(false);
    } catch (err) {
      console.log(err);
      expect(err).toBe("err");
    }
  });
});

describe("test GET/api/v1/transaction/", () => {
  test("Menampilkan semua Transaksi yang sudah terdaftar", async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/transaction/`);
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body.status).toBe(true);
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("sourceAccountId");
      expect(body.data[0]).toHaveProperty("destinationAccountId");
      expect(body.data[0]).toHaveProperty("amount");
    } catch (err) {
      expect(err).toBe("err");
    }
  });
});

describe("test GET/api/v1/transaction/:id", () => {
  beforeAll(async () => {
    transactions = await prisma.transactions.findMany();
  });
  test("mencari Account dengan id yang terdaftar", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/transaction/${transactions[0].id}`
      );
      console.log(body)
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("amount");
      expect(body.data).toHaveProperty("userPengirim");
      expect(body.data).toHaveProperty("userPenerima");
    } catch (err) {
      console.log(err);
      expect(err).toBe("err");
    }
  });

  test("mencari Account dengan id yang tidak terdaftar", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/transaction/${transactions[0].id + 1990}`
      );
      expect(statusCode).toBe(404);
      expect(body.status).toBe(false);
    } catch (err) {
      expect(err).toBe("err");
    }
  });
});
