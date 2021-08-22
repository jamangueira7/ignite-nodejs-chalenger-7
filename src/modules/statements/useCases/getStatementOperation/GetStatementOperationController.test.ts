import * as GetStatementOperationController from "@modules/statements/useCases/getStatementOperation/GetStatementOperationController"
// @ponicode
describe("execute", () => {
    let inst: any

    beforeEach(() => {
        inst = new GetStatementOperationController.GetStatementOperationController()
    })

    test("0", async () => {
        await inst.execute(undefined, undefined)
    })
})
