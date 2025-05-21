import { InjectionToken } from "tsyringe";

import { IPeopleRepository } from "../../modules/people/interfaces/IPeopleRepository";
import { IPeopleService } from "../../modules/people/interfaces/IPeopleService";

export const TOKENS = {
  PeopleRepository: "PeopleRepository" as InjectionToken<IPeopleRepository>,
  PeopleService: "PeopleService" as InjectionToken<IPeopleService>,
};
