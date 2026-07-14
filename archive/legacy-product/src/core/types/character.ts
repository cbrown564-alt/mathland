export interface Character {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  specialty?: string;
  color: string;
  animal?: string;
  concept?: string;
  tagline?: string;
  image?: string;
  fullName?: string;
  catchphrase?: string;
  expertise?: string;
  description?: string;
  modules?: string[];
  icon?: string;
  reactionVerb?: string;
  explainVerb?: string;
}