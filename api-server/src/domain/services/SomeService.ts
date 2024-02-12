import SomeEntityRepository from "../repositories/TaskRepo";

interface ISomeService {
  someEntityRepository: SomeEntityRepository;
}

export default class SomeService {
  private someEntityRepository: SomeEntityRepository;

  constructor(deps: ISomeService) {
    this.someEntityRepository = deps.someEntityRepository;
  }

  async someBusinessFunction() {
  }

}
