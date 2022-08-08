import logger from 'jet-logger';
import { Sequelize } from 'sequelize';

// eslint-disable-next-line import/no-mutable-exports
export let sequelize: Sequelize;

export const init = async () => {
  try {
    const sequelizeAuth = new Sequelize('seq2', 'root', '1234', {
      dialect: 'mysql',
      port: 3306,
    });
    await sequelizeAuth.authenticate();
    logger.info('DB started at por 3306');
    sequelize = sequelizeAuth;
    // alter performs alters to everysingle model
    // force, drop & recreate table
    // sequelize.sync({ alter: true });
    // sequelize.sync({ force: true });
  } catch (e) {
    logger.err('DB error');
    throw e;
  }
};
