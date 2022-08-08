import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface StudentsModelAttributeType {
  student_id: number;
  name: string;
  favorite_class: string;
  school_year: number;
  subscribed_to_pay: boolean;
}
export const studentsModelAttribute = ['student_id', 'name', 'favorite_class', 'school_year', 'subscribed_to_pay'];

type StudentCreationAttributes = Optional<StudentsModelAttributeType, 'student_id'>;

export type StudentModelType = Model<StudentsModelAttributeType, StudentCreationAttributes>;

/// create models
export const createModels = async (sequelize: Sequelize) => {
  const StudentsModel = sequelize.define<StudentModelType>(
    'students',
    {
      student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [4, 16] },
      },
      favorite_class: {
        type: DataTypes.STRING,
        defaultValue: 'Computer Science',
      },
      school_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subscribed_to_pay: {
        type: DataTypes.TINYINT,
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
  );
  // StudentsModel.sync({ alter: true });
  return StudentsModel;
};
