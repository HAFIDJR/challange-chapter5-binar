const app = require("../../app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const request = require("supertest");
let token = "";
describe("test register POST /auth/register endpoint", () => {
  beforeAll(async () => {
    await prisma.transactions.deleteMany();
    await prisma.bankAccounts.deleteMany();
    await prisma.profiles.deleteMany();
    await prisma.users.deleteMany();
  });
  test("succes dengan email dan password ", async () => {
    try {
      let email = "sabrina2@mail.com";
      let password = "sabrina123";
      let name = "sabrina";
      let password_confirmation = "sabrina123";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({ email, password, name, password_confirmation });
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("err");
      expect(body.data.user).toHaveProperty("id");
      expect(body.data.user).toHaveProperty("email");
      expect(body.data.user).toHaveProperty("password");
      expect(body.data.user).toHaveProperty("name");
    } catch (err) {
      expect(err).toBe("err");
    }
  });
  test("gagal dengan password tidak sama", async () => {
    try {
      let email = "sabrina2@mail.com";
      let password = "sabrina123";
      let name = "sabrina";
      let password_confirmation = "sabrina1234";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({ email, password, name, password_confirmation });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("err");
      expect(body.status).toBe(false);
    } catch (err) {
      expect(err).toBe("err");
    }
  });
  test("Email sudah terdaftar ", async () => {
    try {
      let email = "sabrina2@mail.com";
      let password = "sabrina123";
      let name = "sabrina";
      let password_confirmation = "sabrina123";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({ email, password, name, password_confirmation });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("err");
      expect(body.status).toBe(false);
    } catch (err) {
      expect(err).toBe("err");
    }
  });
});

describe("test login POST /auth/login endpoint", () => {
  test("succes dengan email dan password ", async () => {
    try {
      let email = "sabrina2@mail.com";
      let password = "sabrina123";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/login")
        .send({ email, password });
      console.log(body);
      token = body.data.token;

      expect(statusCode).toBe(201);
      expect(body.status).toBe(true);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("err");
      expect(body.data.user).toHaveProperty("email");
      expect(body.data.user).toHaveProperty("password");
      expect(body.data.user).toHaveProperty("name");
      expect(body.data.user).toHaveProperty("id");
      expect(body.data).toHaveProperty("token");
    } catch (err) {
      expect(err).toBe("err");
    }
  });
  test("gagal dengan email tidak terdaftar", async () => {
    try {
      let email = "sabrina222@mail.com";
      let password = "sabrina123";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/login")
        .send({ email, password });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("err");
      expect(body.status).toBe(false);
    } catch (err) {
      expect(err).toBe("err");
    }
  });
  test("Gagal dengan password salah  ", async () => {
    try {
      let email = "sabrina2@mail.com";
      let password = "salah";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/login")
        .send({ email, password });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("err");
      expect(body.status).toBe(false);
    } catch (err) {
      expect(err).toBe("err");
    }
  });
});

describe("test authentication user  /auth/authenticate endpoint", () => {
  test("succes dengan dengan berhasil authentifikasi user ", async () => {
    try {
      let { statusCode, body } = await request(app)
        .get("/api/v1/auth/authenticate")
        .set("Authorization", `Bearer ${token}`);
      expect(statusCode).toBe(200);
      expect(body.status).toBe(true);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("err");
      expect(body.data).toHaveProperty("user");
    } catch (err) {
      expect(err).toBe("err");
    }
  });
  test("gagal Authentifikasi USer", async () => {
    try {
      let { statusCode, body } = await request(app)
        .get("/api/v1/auth/authenticate")
        .set("Authorization", `${token}a`);
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("err");
      expect(body.status).toBe(false);
    } catch (err) {
      expect(err).toBe("err");
    }
  });
});
