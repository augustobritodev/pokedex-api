import { Response, Request, NextFunction } from 'express';

export default class PokemonController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ message: 'index' });
    } catch (error) {
      next(error);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ message: 'show' });
    } catch (error) {
      next(error);
    }
  };

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ message: 'store' });
    } catch (error) {
      next(error);
    }
  };
}
