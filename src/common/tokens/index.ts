import { InjectionToken } from "tsyringe";
import { PrismaClient } from "@prisma/client";

// People
import { IPeopleRepository } from "../../modules/people/interfaces/IPeopleRepository";
import { IPeopleService } from "../../modules/people/interfaces/IPeopleService";

// Category
import { ICategoryRepository } from "../../modules/people/interfaces/ICategoryRepository";
import { ICategoryService } from "../../modules/people/interfaces/ICategoryService";

// Cargo
import { ICargoRepository } from "../../modules/people/interfaces/ICargoRepository";
import { ICargoService } from "../../modules/people/interfaces/ICargoService";

// CampoAdicional
import { ICampoAdicionalRepository } from "../../modules/people/interfaces/ICampoAdicionalRepository";
import { ICampoAdicionalService } from "../../modules/people/interfaces/ICampoAdicionalService";

export const TOKENS = {
  PeopleRepository: "PeopleRepository" as InjectionToken<IPeopleRepository>,
  PeopleService: "PeopleService" as InjectionToken<IPeopleService>,
  PrismaClient: "PrismaClient" as InjectionToken<PrismaClient>,
  // Category
  CategoryRepository: "CategoryRepository" as InjectionToken<ICategoryRepository>,
  CategoryService: "CategoryService" as InjectionToken<ICategoryService>,
  //Cargo
  CargoRepository: "CargoRepository" as InjectionToken<ICargoRepository>,
  CargoService: "CargoService" as InjectionToken<ICargoService>,
  // CampoAdicional
  CampoAdicionalRepository: "CampoAdicionalRepository" as InjectionToken<ICampoAdicionalRepository>,
  CampoAdicionalService: "CampoAdicionalService" as InjectionToken<ICampoAdicionalService>,
};
