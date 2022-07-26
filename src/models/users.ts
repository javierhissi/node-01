import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface UserModelAttributeType {
  user_id: number;
  username: string;
  passwd: string;
  dob: Date;
}
type UserCreationAttributes = Optional<UserModelAttributeType, "user_id">;

export type UserModelType = Model<
  UserModelAttributeType,
  UserCreationAttributes
>;

/// create models
export const createModels = async (
  sequelize: Sequelize
): Promise<UserModelType> =>
  await sequelize
    .define<UserModelType>(
      "user",
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
      },
      {
        // table name as defined above (see DAO change)
        freezeTableName: true,
        // remove this if I want createdAt & updatedAt by default
        timestamps: false,
        initialAutoIncrement: "10",
      }
    )
    .sync({ alter: true });
