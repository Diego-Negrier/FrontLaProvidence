// Export all services
export { AuthService } from './AuthService';
export { ClientsService } from './ClientsService';
export { ClientService } from './ClientService';
export { ProduitsService } from './ProduitsService';
export { PanierService } from './PanierService';
export { CommandesService } from './CommandesService';
export { LivraisonsService } from './LivraisonsService';
export { CategoriesService } from './CategoriesService';
export { FournisseursService } from './FournisseursService';
export { StripeService } from './StripeService';
export { BaseService } from './BaseService';

// Export all types
export * from './types';
export type { Client, AdresseLivraison, AdresseFacturation } from './ClientService';
