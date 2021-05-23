import 'reflect-metadata';

import { CreateStatementError } from '@modules/statements/useCases/createStatement/CreateStatementError';

import { CreateStatementUseCase } from '@modules/statements/useCases/createStatement/CreateStatementUseCase';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import {ICreateStatementDTO} from "@modules/statements/useCases/createStatement/ICreateStatementDTO";
import {ICreateUserDTO} from "@modules/users/useCases/createUser/ICreateUserDTO";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Create Statements', () => {

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }


  const userData: ICreateUserDTO  ={
    name: "User Name",
    email: "user@email.com",
    password : "123456",
  }

  const statementData: ICreateStatementDTO = {
    user_id: "",
    type: OperationType.DEPOSIT,
    amount: 20,
    description: 'Teste'
  };

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('should be able to create Statements', async () => {

    const user = await createUserUseCase.execute(userData);

    const statement = await createStatementUseCase.execute({
      ...statementData,
      user_id: `${user.id}`
    })

    expect(statement).toHaveProperty("id")
    expect(statement.user_id).toEqual(user.id)
    expect(statement.type).toEqual(OperationType.DEPOSIT)
    expect(statement.amount).toEqual(statementData.amount)
    expect(statement.description).toEqual(statementData.description)
  });

  it("should no be able to create a new statement it if user not exists", async () => {

      await expect(async () =>
        await createStatementUseCase.execute(statementData)
      ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it("should no be able to create a new statement it if insufficient funds", async () => {

    const user = await createUserUseCase.execute(userData)

    await expect(async () => await createStatementUseCase.execute({
      ...statementData,
      amount: 1000,
      type: OperationType.WITHDRAW,
      user_id: `${user.id}`
    })).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });

})
