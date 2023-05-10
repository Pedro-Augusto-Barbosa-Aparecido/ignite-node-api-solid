import { expect, it, describe, beforeEach } from "vitest";
import { RegisterUseCase } from "@/use-cases/register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "Jhon Doe",
      email: "jhondoe@gmail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "Jhon Doe",
      email: "jhondoe@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to register with same email twice", async () => {
    const email = "jhondoe@gmail.com";

    await sut.execute({
      name: "Jhon Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "Jhon Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
