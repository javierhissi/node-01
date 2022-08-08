import { sequelize } from '@db/index';
import { getModel } from '@models/index';
import { userModelAttribute, UserModelAttributeType, UserModelType } from '@models/users';
import { Request, Response, Router } from 'express';
import { FindAttributeOptions, Op, Sequelize } from 'sequelize';

interface UserCreationType extends Request {
  body: Omit<UserModelAttributeType, 'user_id'>;
}
const createUser = (req: UserCreationType, res: Response) => {
  const newUser = req.body;
};

export default (): Router => {
  // Export the base-router
  const baseRouter = Router();

  type FilterType = keyof UserCreationType['body'];

  const isTypeOf = (paramKey: string): paramKey is FilterType => userModelAttribute.includes(paramKey);

  baseRouter.post('/users-01-', async (req: UserCreationType, res: Response) => {
    try {
      const userMoldel = getModel<UserModelType>('Users');

      //   const result = await userMoldel.build(req.body);
      //   // return res.status(200).json(await result.save());
      //   await result.validate();
      //   console.log('hola');

      return res.status(200).json(await userMoldel.create(req.body));
    } catch (e) {
      res.status(500).json(e.errors[0]);
    }
  });

  baseRouter.get('/users-01-/:id', async (req: Request, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');

    return res.status(200).json(
      await userMoldel.findOne({
        where: {
          user_id: req.params.id,
        },
      })
    );
  });

  baseRouter.put('/users-01-/:id', async (req: UserCreationType, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');

    const user = await userMoldel.findOne({
      where: {
        user_id: req.params.id,
      },
    });
    const newUser = await user?.update({
      ...user,
      ...req.body,
    });

    return res.status(200).json(newUser);
  });

  baseRouter.put('/users-01-_update_01/:id', async (req: UserCreationType, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');

    await userMoldel.update(
      { num: req.body.num },
      {
        where: {
          user_id: {
            [Op.eq]: req.params.id,
          },
        },
      }
    );
    return res.status(200).json(await userMoldel.findByPk(req.params.id));
  });

  interface userPathType extends Partial<UserCreationType> {
    params: {
      id: string;
    };
  }

  baseRouter.patch('/users-01-/:id', async (req: userPathType, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');

    const user = await userMoldel.findOne({
      where: {
        user_id: req.params.id,
      },
    });
    if (req.body?.username) {
      user?.setDataValue('username', req.body?.username);
    }
    if (req.body?.num || !!req.body?.num) {
      await user?.increment({ num: req.body?.num + 1 });
      await user?.decrement({ num: req.body?.num + 5 });
    }
    await user?.save({ fields: ['username'] });

    return res.status(200).json(await user?.reload());
  });

  baseRouter.delete('/users-01-/:id', async (req: Request, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');
    await userMoldel.destroy({
      where: {
        user_id: req.params.id,
      },
    });

    return res.status(201).json({});
  });

  interface UsersFilters extends Request {
    query: {
      [key: string]: string | string[];
    };
  }

  baseRouter.get('/users-01-', async ({ query: q }: UsersFilters, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');
    const query = {};
    const buildAttributes = ((): FindAttributeOptions | undefined => {
      //   let attributes: FindAttributeOptions = [];
      let includeAttr: FindAttributeOptions = [];
      let excludeAttr: string[] = [];
      if (q.sum) {
        return [
          [Sequelize.fn('sum', Sequelize.col('num')), 'sum'],
          [Sequelize.fn('max', Sequelize.col('num')), 'max'],
          [Sequelize.fn('min', Sequelize.col('num')), 'min'],
        ];
      }

      if (q.sum_username) {
        return ['username', [Sequelize.fn('sum', Sequelize.col('num')), 'sum']];
      }

      if (q.username) {
        includeAttr = ['username'];
      }
      if (q.exclude) {
        excludeAttr = Array.isArray(q.exclude) ? q.exclude : [q.exclude];
      }

      if (includeAttr.length && excludeAttr.length) {
        return {
          include: includeAttr,
          exclude: excludeAttr,
        };
      }
      if (includeAttr.length || excludeAttr.length) {
        return includeAttr.length ? includeAttr : { exclude: excludeAttr };
      }

      return undefined;
    })();

    const whereClause = (() => {
      const result = Object.entries(q).reduce((acc, [key, value]) => {
        if (isTypeOf(key)) {
          return {
            ...acc,
            [key]: value,
          };
        }
        return acc;
      }, {});

      return Object.keys(result).length ? result : undefined;
    })();

    const groupClause = (() => {
      if (q.sum_username) {
        return 'username';
      }
    })();

    if (buildAttributes) {
      Object.assign(query, { attributes: buildAttributes });
    }

    if (whereClause) {
      Object.assign(query, { where: whereClause });
    }

    if (groupClause) {
      Object.assign(query, { group: groupClause });
    }

    try {
      return res.status(200).json(await userMoldel.findAll(query));
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  interface ReqOr extends Request {
    query: {
      username: string;
      num: string;
    };
  }

  baseRouter.get('/users-01-_or', async (req: ReqOr, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');

    return res.status(200).json(
      await userMoldel.findAll({
        where: {
          [Op.or]: {
            username: req.query.username || '',
            num: {
              [Op.eq]: req.query.num || 0,
            },
          },
          [Op.and]: { passwd: { [Op.not]: 'NULL' } },
          // [Op.and]: { passwd: { [Op.is]: undefined } },
        },
      })
    );
  });

  baseRouter.get('/users-01-_gte', async (req: ReqOr, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');

    return res.status(200).json(
      await userMoldel.findAll({
        where: {
          num: { [Op.gte]: req.query.num },
          // [Op.and]: { passwd: { [Op.is]: undefined } },
        },
      })
    );
  });

  baseRouter.get('/users-01-_gte', async (req: ReqOr, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');

    return res.status(200).json(
      await userMoldel.findAll({
        where: {
          num: { [Op.gte]: req.query.num },
          // [Op.and]: { passwd: { [Op.is]: undefined } },
        },
      })
    );
  });

  baseRouter.get('/users-01-_or_gte', async (req: ReqOr, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');

    return res.status(200).json(
      await userMoldel.findAll({
        where: {
          num: {
            [Op.or]: {
              [Op.gte]: req.query.num,
              [Op.eq]: 0,
            },
          },
        },
      })
    );
  });

  baseRouter.get('/users-01-_seq_func', async (req: ReqOr, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');

    return res.status(200).json(
      await userMoldel.findAll({
        // WHERE length(`username`) = 5;
        // where: Sequelize.where(Sequelize.fn('length', Sequelize.col('username')), 5),
        // GTE than WHERE length(`username`) > 5
        where: Sequelize.where(Sequelize.fn('length', Sequelize.col('username')), { [Op.gt]: 5 }),
      })
    );
  });

  baseRouter.get('/users-01-_raw', async (req: ReqOr, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');

    return res.status(200).json(
      await userMoldel.findAll({
        where: Sequelize.where(Sequelize.fn('length', Sequelize.col('username')), { [Op.gt]: req.query.num || 0 }),
        // VIRTUAL FIELDS are eliminated in this way
        raw: true,
      })
    );
  });

  baseRouter.get('/users-01-_query', async (req: ReqOr, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');

    // returns 2?¿ so adding the type or model in order to return only 1
    const x = await sequelize.query<UserModelType>(
      'SELECT * FROM user as u inner join students as t WHERE t.student_id = u.user_id',
      {
        // type: QueryTypes.SELECT,
        model: userMoldel,
      }
    );

    // const y = await sequelize.query(
    //     'SELECT * FROM user as u inner join students as t WHERE t.student_id = u.user_id',
    //     {
    //      type: QueryTypes.SELECT,
    //     //  model: userMoldel,
    //     }
    //   );
    // const x = await sequelize.query('SELECT * FROM user as u  WHERE u.user_id = 12');
    // console.log(x[0].getDataValue());
    return res.status(200).json(x);
  });

  baseRouter.get('/users-01-_injection', async (req: ReqOr, res: Response) => {
    const userMoldel = getModel<UserModelType>('Users');

    // returns 2?¿ so adding the type or model in order to return only 1
    const x = await sequelize.query<UserModelType>('SELECT * FROM user as u  WHERE u.username = $1', {
      // type: QueryTypes.SELECT,
      model: userMoldel,
      // one way for prevent injection -> ?
      // replacements: [req.query.username || ''],
      // one way for prevent injection -> $1
      bind: [req.query.username || ''],
    });

    // const y = await sequelize.query(
    //     'SELECT * FROM user as u inner join students as t WHERE t.student_id = u.user_id',
    //     {
    //      type: QueryTypes.SELECT,
    //     //  model: userMoldel,
    //     }
    //   );
    // const x = await sequelize.query('SELECT * FROM user as u  WHERE u.user_id = 12');
    // console.log(x[0].getDataValue());
    return res.status(200).json(x);
  });
  return baseRouter;
};
