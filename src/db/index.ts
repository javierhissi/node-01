import logger from 'jet-logger';
import { DataTypes, Sequelize } from 'sequelize';

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
    // sequelize.sync({ alter: true});
    // sequelize.sync({ force: true});
  } catch (e) {
    logger.err('DB error');
    throw e;
  }
};

/// create models
export const createModels = async () => {
  if (!sequelize) {
    throw new Error();
  }

  await sequelize
    .define(
      'user',
      {
        user_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        passwd: {
          type: DataTypes.STRING,
        },
        dob: {
          type: DataTypes.DATE,
          defaultValue: new Date(),
        },
        with_code_rocks: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        // table name as defined above (see DAO change)
        freezeTableName: true,
        // remove this if I want createdAt & updatedAt by default
        timestamps: false,
        initialAutoIncrement: '10',
      }
    )
    .sync({ alter: true });
};
