import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';
import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '@modules/statements/useCases/createStatement/CreateStatementUseCase';
import { ICreateStatementDTO } from '@modules/statements/useCases/createStatement/ICreateStatementDTO';
import { GetStatementOperationError } from '@modules/statements/useCases/getStatementOperation/GetStatementOperationError';
import { GetStatementOperationUseCase } from '@modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase';

describe("Get Statement Operation Use Case", () => {

  let statementsRepositoryInMemory: InMemoryStatementsRepository;
  let usersRepositoryInMemory: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  const statementData: ICreateStatementDTO = {
    user_id: "",
    amount: 0,
    description: "Statement Test",
    type: OperationType.DEPOSIT
  }

  const userData: ICreateUserDTO = {
    name: "Test User",
    email: "user@test.com",
    password: "test123"
  }

  beforeEach(() => {

    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();

    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );

  });

  it("should be able to get one statement operation", async () => {

    const user = await createUserUseCase.execute(userData);
    const statement = await createStatementUseCase.execute({
      ...statementData,
      user_id: `${user.id}`
    });

    const response = await getStatementOperationUseCase.execute({
      user_id: `${user.id}`,
      statement_id: `${statement.id}`
    });

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("user_id");
    expect(response.type).toBe(statementData.type);
    expect(response.amount).toBe(statementData.amount);
    expect(response.description).toBe(statementData.description);
    expect(response.user_id).toBe(user.id);
  });

  it("should no be able to get one statement operation if it user not exists", async () => {

    const user = await createUserUseCase.execute(userData);
    const statement = await createStatementUseCase.execute({
      ...statementData,
      user_id: `${user.id}`
    });

    await expect( async () =>
      await getStatementOperationUseCase.execute({
        user_id: `${user.id}-invalid`,
        statement_id: `${statement.id}`
      }
    )).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should no be able to get one statement operation if it statement operation not exists", async () => {

    const user = await createUserUseCase.execute(userData);

    const statement = await createStatementUseCase.execute({
      ...statementData,
      user_id: `${user.id}`
    });

    await expect( async () => await getStatementOperationUseCase.execute({
      user_id: `${user.id}`,
      statement_id: `${statement.id}-invalid`
    })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

});
