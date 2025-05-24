import { InjectionToken } from "tsyringe";
import { PrismaClient } from "@prisma/client";

// People
import { IPeopleRepository } from "../../modules/people/interfaces/IPeopleRepository";
import { IPeopleService } from "../../modules/people/interfaces/IPeopleService";

// Category
import { ICategoryRepository } from "../../modules/people/interfaces/ICategoryRepository";
import { ICategoryService } from "../../modules/people/interfaces/ICategoryService";

export const TOKENS = {
  PeopleRepository: "PeopleRepository" as InjectionToken<IPeopleRepository>,
  PeopleService: "PeopleService" as InjectionToken<IPeopleService>,
  PrismaClient: "PrismaClient" as InjectionToken<PrismaClient>,
  CategoryRepository: "CategoryRepository" as InjectionToken<ICategoryRepository>,
  CategoryService: "CategoryService" as InjectionToken<ICategoryService>,
};
