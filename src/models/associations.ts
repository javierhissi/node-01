import { ModelStatic } from 'sequelize/types';

export const associate = (models: { [key: string]: ModelStatic<any> }) => {
  //   models.Students.hasOne(models.Users, { foreignKey: 'student_id' });
  models.Users.belongsTo(models.Students, { foreignKey: 'student_id' });
  //   models.Users.hasMany(models.Students);
  //   models.Users.sync({ alter: true });

  //   models.Students.sync({ alter: true });
};
