/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from 'express';

export default (): Router => {
  // Export the base-router
  const baseRouter = Router();

  let personas = [
    {
      id: 1,
      name: 'hola',
      email: 'a@a.com',
    },
    {
      id: 2,
      name: 'hola-2',
      email: 'a@a.com',
    },
    {
      id: 3,
      name: 'hola-3',
      email: 'a@a.com',
    },
    {
      id: 4,
      name: 'hola-4',
      email: 'a@a.com',
    },
  ];

  baseRouter.get('/personas', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(personas);
  });

  baseRouter.get('/personas/:id', (req: Request, res: Response, next: NextFunction) => {
    const result = personas.find((persona) => {
      if (persona.id === parseInt(req.params.id)) {
        return true;
      }
      return false;
    });

    if (result) {
      return res.status(200).json(result);
    }

    return res.status(200).json({});
  });

  interface PersonaCreateType extends Request {
    body: {
      name: string;
      email: string;
    };
  }

  baseRouter.post('/personas', (req: PersonaCreateType, res: Response, next: NextFunction) => {
    const newPerson = {
      id: personas.length + 1,
      name: req.body.name,
      email: req.body.email,
    };

    personas.push(newPerson);

    return res.status(200).json(newPerson);
  });

  baseRouter.delete('/personas/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);

    personas = personas.filter((persona) => persona.id !== id);

    return res.status(200).send('ok');
  });

  return baseRouter;
};
