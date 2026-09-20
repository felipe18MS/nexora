import type { RolSistema } from '@/modules/auth/types/auth.types';
import type { ModuloSistema } from '@/modules/authorization/types/authorization.types';

declare module 'vue-router' {
  interface RouteMeta {
    roles?: readonly RolSistema[];
    module?: ModuloSistema;
    permissions?: readonly string[];
    requiresSubscription?: boolean;
  }
}
