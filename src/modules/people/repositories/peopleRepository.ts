import { injectable } from "tsyringe";

@injectable()
export class PeopleRepository {
  log(name: string): void {
    console.log(`Hello from people repository ${name}`);
  }
}
