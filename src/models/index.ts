import { sequelize } from "@db/index";
import { Model } from "sequelize/types";
import { createModels, UserModelType } from "./users";

type ModelKeyType = "Users" | "cow";

type Models = UserModelType | Model;
type ModelsType = {
  [key in ModelKeyType]?: Models;
};

const currentModels = ["Users", "cow"];
let models: ModelsType = {};

export const initModels = async () => {
  const resolved = await Promise.all([await createModels(sequelize)]);

  models = currentModels.reduce(
    (acc, key, index) => ({
      ...acc,
      [key]: resolved[index],
    }),
    models
  );

  return;
};

export const getModel = (modelType: ModelKeyType): Models => {
  return models[modelType] as Models;
};
