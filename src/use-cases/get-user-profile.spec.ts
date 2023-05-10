import { hash } from "bcryptjs";
import { expect, it, describe, beforeEach } from "vitest";

import { InMemoryUsersReprository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resources-not-found-error";

let usersRepository: InMemoryUsersReprository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersReprository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "Jhon Doe",
      email: "jhondoe@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.name).toEqual("Jhon Doe");
  });

  it("should not be able to get user profile with wrong id", async () => {
    await usersRepository.create({
      name: "Jhon Doe",
      email: "jhondoe@gmail.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        userId: "not exists id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
