import { Router } from 'express';
import PokemonController from '@src/controllers/pokemon.controller';

const pokemonController = new PokemonController();

const ROUTE_PREFIX = '/pokemons';

export default (): Router => {
  const router = Router();

  router.get(`${ROUTE_PREFIX}/id`, pokemonController.index);
  router.get(`${ROUTE_PREFIX}`, pokemonController.show);
  router.post(`${ROUTE_PREFIX}`, pokemonController.store);

  return router;
};
