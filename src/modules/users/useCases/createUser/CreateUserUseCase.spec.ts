import 'reflect-metadata';

import { CreateUserError } from '@modules/users/useCases/createUser/CreateUserError';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to create a new user', async () => {

    const user = await createUserUseCase.execute({
      name: "User Name",
      email: "user@email.com",
      password : "123456",
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user two times', async () => {

    await expect(async () => {
      await createUserUseCase.execute({
        name: "User Name",
        email: "user@email.com",
        password : "123456",
      });

      const user = await createUserUseCase.execute({
        name: "User Name",
        email: "user@email.com",
        password : "123456",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });


})
