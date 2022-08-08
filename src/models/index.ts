import { sequelize } from '@db/index';
import { Model, ModelStatic } from 'sequelize/types';
import { associate } from './associations';
import { createModels as createStudentModes, StudentModelType } from './students';
// eslint-disable-next-line import/no-cycle
import { createModels as createUserModels, UserModelType } from './users';

type ModelKeyType = 'Users' | 'Students';

type Models = ModelStatic<UserModelType> | ModelStatic<StudentModelType> | ModelStatic<any>;
type ModelsType = {
  [key in ModelKeyType]?: Models;
};

const currentModels = ['Users', 'Students'];
const models: { definedModel: ModelsType } = { definedModel: {} };

export const initModels = async () => {
  const resolved = await Promise.all([await createUserModels(sequelize), await createStudentModes(sequelize)]);

  models.definedModel = currentModels.reduce(
    (acc, key, index) => ({
      ...acc,
      [key]: resolved[index],
    }),
    models.definedModel
  );

  associate(models.definedModel);

  sequelize.sync({ force: true });
};
interface GetModelType {
  <T extends Model>(modelType: ModelKeyType): ModelStatic<T>;
}

export const getModel: GetModelType = <T extends Model>(modelType: ModelKeyType): ModelStatic<T> =>
  models.definedModel[modelType] as ModelStatic<T>;
