const app = require("../../app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const request = require("supertest");
let user = {};
describe("test POST /api/v1/users endpoint", () => {
  beforeAll(async () => {
    await prisma.transactions.deleteMany();
    await prisma.bankAccounts.deleteMany();
    await prisma.profiles.deleteMany();
    await prisma.users.deleteMany();
  });
  test("test email belum terdaftar -> sukses", async () => {
    try {
      let email = "usertest233@mail.com";
      let password = "pasword123";
      let name = "hafid";
      let gender = "L";
      let identityNumber = 100629;
      let address = "Jakarta";
      let { statusCode, body } = await request(app)
        .post("/api/v1/users")
        .send({ email, password, name, gender, identityNumber, address });
      user = body.data
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("password");
      expect(body.data).toHaveProperty("name");
      expect(body.data.profile).toHaveProperty("id");
      expect(body.data.profile).toHaveProperty("gender");
      expect(body.data.profile).toHaveProperty("identityNumber");
      expect(body.data.profile).toHaveProperty("address");
      expect(body.data.profile).toHaveProperty("usersId");
      expect(body.data.email).toBe(email);
      expect(body.data.password).toBe(password);
      expect(body.data.name).toBe(name);
      expect(body.data.profile.gender).toBe(gender);
      expect(body.data.profile.identityNumber).toBe(identityNumber);
      expect(body.data.profile.address).toBe(address);
    } catch (err) {
      expect(err).toBe("err");
    }
  });
  test("test email sudah terdaftar -> gagal", async () => {
    try {
      let email = "usertest233@mail.com";
      let password = "pasword123";
      let name = "hafid";
      let gender = "L";
      let identityNumber = 100629;
      let address = "Jakarta";
      let { statusCode, body } = await request(app)
        .post("/api/v1/users")
        .send({ email, password, name, gender, identityNumber, address });
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body.status).toBe(false);
    } catch (err) {
     
      expect(err).toBe("err");
    }
  });

  test("test nama,email,dan password tidak diisi -> gagal", async () => {
    try {
      let email = "usertest233@mail.com";
      let password = null;
      let name = null;
      let gender = "L";
      let identityNumber = 100629;
      let address = "Jakarta";
      let { statusCode, body } = await request(app)
        .post("/api/v1/users")
        .send({ email, password, name, gender, identityNumber, address });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body.status).toBe(false);
    } catch (err) {
    
      expect(err).toBe("err");
    }
  });
});

describe("test GET/api/v1/users/", () => {
  test("Menampilkan semua users yang sudah terdaftar", async () => {
    try {
      let { statusCode, body } = await request(app).get(`/api/v1/users/`);
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body.status).toBe(true);
      expect(body.data[0]).toHaveProperty("email");
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("name");
      expect(body.data[0]).toHaveProperty("password");
    } catch (err) {
    
      expect(err).toBe("err");
    }
  });
});

describe("test GET/api/v1/users/:id", () => {
  test("mencari users dengan id yang terdaftar", async () => {
    try {
      
      let { statusCode, body } = await request(app).get(
        `/api/v1/users/${user.id}`
      );
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("password");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("profile");
      expect(body.data.email).toBe(user.email);
      expect(body.data.password).toBe(user.password);
      expect(body.data.name).toBe(user.name);
    } catch (err) {
      expect(err).toBe("err");
    }
  });

  test("mencari user dengan id yang tidak terdaftar", async () => {
    try {
      let { statusCode, body } = await request(app).get(
        `/api/v1/users/${user.id + 1990}`
      );
      expect(statusCode).toBe(404);
      expect(body.status).toBe(false);
    } catch (err) {
      console.log(err)
      expect(err).toBe("err");
    }
  });
});


