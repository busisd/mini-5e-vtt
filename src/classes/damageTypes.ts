export enum DamageType {
  ACID = "Acid",
  BLUDGEONING = "Bludgeoning",
  COLD = "Cold",
  FIRE = "Fire",
  FORCE = "Force",
  LIGHTNING = "Lightning",
  NECROTIC = "Necrotic",
  PIERCING = "Piercing",
  POISON = "Poison",
  PSYCHIC = "Psychic",
  RADIANT = "Radiant",
  SLASHING = "Slashing",
  THUNDER = "Thunder",
}

export type DamageTypeMap = { [key in DamageType]: number };
