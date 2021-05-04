import mongoose, { Schema, Document } from 'mongoose';

export interface IPokemon extends Document {
  number: string;
  name: string;
  generation: string;
  about: string;
  types: string[];
  resistant: string[];
  weaknesses: string[];
  fastAttacks: [
    {
      name: string;
      type: string;
      damage: number;
    }
  ];
  specialAttacks: [
    {
      name: string;
      type: string;
      damage: number;
    }
  ];
  weight: {
    minimum: string;
    maximum: string;
  };
  height: {
    minimum: string;
    maximum: string;
  };
  buddyDistance: string;
  baseStamina: string;
  baseAttack: string;
  baseDefense: string;
  baseFleeRate: string;
  nextEvolutionRequirements: {
    amount: number;
    name: string;
  };
  nextEvolutions: [
    {
      number: number;
      name: string;
    }
  ];
  maxCP: number;
  maxHP: number;
}

const PokemonSchema: Schema = new Schema({});

export default mongoose.model<IPokemon>('Pokemon', PokemonSchema);
