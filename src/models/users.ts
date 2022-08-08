import bcrypt from 'bcrypt';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface UserModelAttributeType {
  user_id: number;
  username: string;
  passwd: string;
  dob: Date;
  num: number;
  about_user: string;
  email: string;
}
export const userModelAttribute = ['user_id', 'username', 'passwd', 'dob', 'num'];

type UserCreationAttributes = Optional<UserModelAttributeType, 'user_id'>;

export type UserModelType = Model<UserModelAttributeType, UserCreationAttributes>;

/// create models
export const createModels = async (sequelize: Sequelize) => {
  const UserModel = sequelize.define<UserModelType>(
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
        set(value: string) {
          const salt = bcrypt.genSaltSync(12);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue('passwd', hash);
        },
      },
      dob: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      num: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isNumEnought(value: number) {
            if (value < -10) {
              throw new Error('Value!!!!');
            }
          },
        },
      },
      about_user: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.getDataValue('username')} ${this.getDataValue('num')}`;
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      // table name as defined above (see DAO change)
      freezeTableName: true,
      // remove this if I want createdAt & updatedAt by default
      timestamps: false,
      initialAutoIncrement: '10',
    }
  );
  // UserModel.sync({ alter: true });
  return UserModel;
};
