import SomeEntityRepository from "../repositories/some_entity_repo";

interface ISomeService{
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
