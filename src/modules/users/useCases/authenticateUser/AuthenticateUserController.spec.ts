import jwt from 'jsonwebtoken';

import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';
import { AuthenticateUserUseCase } from '@modules/users/useCases/authenticateUser/AuthenticateUserUseCase';

import authConfig from '@config/auth';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { User } from '@modules/users/entities/User';
import { AppError } from '@shared/errors/AppError';


describe("Authenticate User Use Case", () => {

  interface ITokenUser {
    user: User,
    token: string,
  }

  let authenticateUserUseCase: AuthenticateUserUseCase;
  let usersRepositoryInMemory: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;


  const userData: ICreateUserDTO = {
    name: "Test Admin",
    email: "admin@test.com",
    password: "123456"
  }

  beforeEach(() => {

    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

  });

  it("should be able to init a new session", async() => {

    await createUserUseCase.execute(userData);

    const { user, token } = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password
    });

    const decodedToken = jwt.verify(token, authConfig.jwt.secret) as ITokenUser;

    expect(user).toHaveProperty("id");
    expect(user).not.toHaveProperty("password");
    expect(user.name).toEqual(userData.name);
    expect(user.email).toEqual(userData.email);

    expect(decodedToken.user).toHaveProperty("id");
    expect(decodedToken.user).toHaveProperty("password");
    expect(decodedToken.user.name).toEqual(userData.name);
    expect(decodedToken.user.email).toEqual(userData.email);
  });

  it("should not be able to init a new session if it user not exists", async() => {

    await expect( async () => await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password
    })).rejects.toBeInstanceOf(AppError)
  });

  it("should not be able to init a new session if it password is incorrect", async() => {

    await createUserUseCase.execute(userData);

    await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password
    });

    await expect( async () => await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password + "-incorrect"
    })).rejects.toBeInstanceOf(AppError);
  });
});
