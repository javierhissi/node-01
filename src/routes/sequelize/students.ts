/* eslint-disable @typescript-eslint/no-unused-vars */
import { getModel } from '@models/index';
import { StudentModelType, StudentsModelAttributeType } from '@models/students';
import { Request, Response, Router } from 'express';

export default (): Router => {
  // Export the base-router
  const baseRouter = Router();

  interface StundentCreationType extends Request {
    body: Omit<StudentsModelAttributeType, 'user_id'>;
  }

  baseRouter.post('/students', async (req: StundentCreationType, res: Response) => {
    const model = getModel<StudentModelType>('Students');

    return res.status(200).json(await model.create(req.body));
  });
  return baseRouter;
};
