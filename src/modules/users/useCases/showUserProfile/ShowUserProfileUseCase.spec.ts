import 'reflect-metadata';

import { ShowUserProfileError } from '@modules/users/useCases/showUserProfile/ShowUserProfileError';

import { ShowUserProfileUseCase } from '@modules/users/useCases/showUserProfile/ShowUserProfileUseCase';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import {AppError} from "@shared/errors/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Show User Profile', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to show an user', async () => {

    const user = await createUserUseCase.execute({
      name: "User Name",
      email: "user@email.com",
      password : "123456",
    });

    const user_id = user.id === 'undefined' ? "" : user.id as string;

    const showUser = await showUserProfileUseCase.execute(user_id);

    expect(showUser).toHaveProperty('id');
    expect(showUser.id).toEqual(user.id);
    expect(showUser.email).toEqual(user.email);
    expect(showUser.name).toEqual(user.name);
  });

  it('should not be able to show an user', async () => {

    await expect(async () => {

      const user = await createUserUseCase.execute({
        name: "User Name",
        email: "user@email.com",
        password : "123456",
      });

      const user_id = 'falkadfasdflajsdfksldfasdlkfj'

      await showUserProfileUseCase.execute(user_id);

    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });


})
