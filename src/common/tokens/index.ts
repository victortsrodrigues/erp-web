import { InjectionToken } from "tsyringe";

import { IPeopleRepository } from "../../modules/people/interfaces/IPeopleRepository";
import { IPeopleService } from "../../modules/people/interfaces/IPeopleService";
import { PrismaClient } from "@prisma/client";

export const TOKENS = {
  PeopleRepository: "PeopleRepository" as InjectionToken<IPeopleRepository>,
  PeopleService: "PeopleService" as InjectionToken<IPeopleService>,
  PrismaClient: "PrismaClient" as InjectionToken<PrismaClient>,
};
