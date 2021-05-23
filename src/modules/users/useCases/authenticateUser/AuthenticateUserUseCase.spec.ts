import 'reflect-metadata';

import { IncorrectEmailOrPasswordError } from '@modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError';

import { AuthenticateUserUseCase } from '@modules/users/useCases/authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import {ICreateUserDTO} from "@modules/users/useCases/createUser/ICreateUserDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async () => {

    const user: ICreateUserDTO = {
      email: 'user@test.com',
      password: '1234',
      name: 'User test',
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate a none existing user", async () => {

    await expect(async () => {
      const result = await authenticateUserUseCase.execute({
        email: 'user@test.com',
        password: '1234',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with incorrect password", async () => {

    await expect(async () => {
      const user: ICreateUserDTO = {
        email: 'user@test.com',
        password: '1234',
        name: 'User test',
      };

      await createUserUseCase.execute(user);

      const result = await authenticateUserUseCase.execute({
        email: user.email,
        password: '4321',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

})
