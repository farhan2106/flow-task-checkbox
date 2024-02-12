import TaskRepository from "../repositories/TaskRepo";

interface ISomeService {
  taskRepo: TaskRepository;
}

export default class SomeService {
  private taskRepo: TaskRepository;

  constructor(deps: ISomeService) {
    this.taskRepo = deps.taskRepo;
  }

  async someBusinessFunction() {
  }

}
