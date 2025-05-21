import { injectable } from "tsyringe";
import { IPeopleRepository } from "../interfaces/IPeopleRepository";

@injectable()
export class PeopleRepository implements IPeopleRepository {
  log(name: string): void {
    console.log(`Hello from people repository ${name}`);
  }
}
