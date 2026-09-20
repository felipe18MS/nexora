# NEXORA — Instrucciones para IA

## 1. Identidad del proyecto

El proyecto se llama NEXORA.

NEXORA es un SaaS de automatización de citas y gestión de negocios.

El frontend está siendo desarrollado con:

- Vue 3
- TypeScript
- Quasar Framework
- Pinia
- Vue Router
- Vue Router Auto Routes
- vue-i18n

Actualmente el backend/API todavía no está implementado en esta fase.

La arquitectura debe quedar preparada para conectar posteriormente una API real.

---

# 2. Arquitectura principal

NEXORA utiliza una arquitectura modular.

La estructura conceptual es:

Page
↓
Component
↓
Composable
↓
Pinia Store
↓
Service
↓
Mock / API
↓
Storage / Backend

Responsabilidad de cada capa:

### Pages

Contienen las vistas principales asociadas a las rutas.

Ubicación:

src/pages/

No colocar lógica compleja de negocio directamente en las páginas si puede pertenecer a un módulo.

---

### Components

Contienen componentes visuales reutilizables y específicos del módulo.

Ejemplo:

src/modules/platform/components/

---

### Composables

Contienen lógica reutilizable y coordinación entre componentes y stores.

Ejemplo:

use-platform.ts

---

### Stores

Contienen el estado global del módulo y las operaciones relacionadas con ese estado.

Tecnología:

Pinia.

---

### Services

Abstraen el acceso a datos.

Los componentes y composables no deben acceder directamente a mocks, localStorage o futuras APIs.

Ejemplo:

platform.service.ts

---

### Mocks

Actualmente los mocks simulan el backend.

Ejemplo:

platform.mock.ts

Los mocks pueden utilizar localStorage durante esta fase.

Cuando exista backend, debe ser posible sustituir el mock por una implementación HTTP sin modificar innecesariamente los componentes.

---

# 3. Regla fundamental de arquitectura

Antes de crear código nuevo:

1. Revisar si ya existe una funcionalidad equivalente.
2. Revisar el módulo correspondiente.
3. Revisar composables existentes.
4. Revisar stores existentes.
5. Revisar services existentes.
6. Reutilizar código antes de duplicarlo.

No crear una segunda implementación de una funcionalidad que ya existe.

---

# 4. Vue Router

NEXORA utiliza Vue Router Auto Routes.

Las rutas se generan automáticamente desde:

src/pages/

No modificar manualmente archivos generados por Vue Router.

Especialmente:

typed-router.d.ts

El archivo de rutas principal configura:

- history
- scroll behavior
- rutas generadas
- navegación
- autenticación

Actualmente las rutas bajo:

/app/*

requieren autenticación.

---

# 5. Autenticación

El sistema utiliza:

src/modules/auth/

La sesión se administra mediante Pinia.

El router restaura la sesión antes de comprobar el acceso.

Actualmente:

/app/*

requiere usuario autenticado.

Si un usuario no autenticado intenta acceder a una ruta protegida:

/app/...

debe ser enviado a:

/auth/login

con redirect hacia la ruta original.

Si un usuario autenticado intenta acceder a:

/auth/login

debe ser enviado a:

/app/dashboard

No romper este comportamiento al modificar el router.

---

# 6. Roles

NEXORA tendrá diferentes niveles de acceso.

El sistema debe prepararse para diferenciar:

- superadmin
- admin
- manager
- employee
- user

No asumir que todos los usuarios tienen acceso a todos los módulos.

La autorización por rol será una capa independiente de la autenticación.

---

# 7. Suscripciones

NEXORA utiliza un sistema de suscripción.

Estados previstos:

- trial
- active
- expired
- cancelled
- suspended

La arquitectura futura debe permitir:

Autenticación
↓
Rol
↓
Suscripción
↓
Permisos
↓
Módulo

El superadmin debe poder acceder a la plataforma independientemente de la suscripción de un negocio.

---

# 8. Plataforma / Superadministrador

El módulo:

src/modules/platform/

es responsable de la configuración global de NEXORA.

Incluye actualmente:

- branding global
- nombre de plataforma
- nombre corto
- descripción
- logo
- favicon
- términos y condiciones
- política de privacidad
- política de cookies

El estado principal se administra mediante:

usePlatformStore

La lógica reutilizable se expone mediante:

usePlatform()

El acceso a datos pasa por:

platform.service.ts

Actualmente los datos se almacenan mediante:

platform.mock.ts

y localStorage.

---

# 9. Branding global

El branding de NEXORA debe poder ser utilizado por diferentes partes del sistema.

Ejemplos:

- Login
- Registro
- Layout
- navegación
- documentos legales
- futuros correos
- futuras páginas públicas

No duplicar el nombre de NEXORA directamente cuando exista una fuente global de branding.

Preferir:

usePlatform()

y sus propiedades/computed correspondientes.

---

# 10. Documentos legales

Los documentos legales están centralizados en Platform.

Tipos actuales:

- terminos
- privacidad
- cookies

La arquitectura utiliza:

platform-legal-document-dialog.vue

como componente reutilizable.

Los componentes específicos:

- legal-terms-dialog.vue
- privacy-policy-dialog.vue
- cookie-policy-dialog.vue

funcionan como adaptadores cuando sea necesario.

No duplicar el contenido legal en diferentes componentes.

El contenido debe proceder de la configuración de Platform.

---

# 11. LocalStorage

Durante la fase mock se permite utilizar localStorage.

Las claves deben ser constantes y claramente identificadas.

Ejemplo:

nexora_platform_config

No almacenar información duplicada si puede centralizarse.

Cuando se implemente backend, el acceso a localStorage debe poder retirarse sustituyendo la capa de service/mock.

---

# 12. TypeScript

Utilizar TypeScript correctamente.

Preferir:

- interfaces
- types
- tipos explícitos
- funciones con tipos de retorno
- imports type cuando corresponda

Evitar:

- any innecesario
- casts innecesarios
- lógica dinámica sin tipado
- duplicación de tipos

Si una API futura necesita un tipo, definirlo en:

types/

---

# 13. Vue 3

Utilizar Composition API y script setup.

Preferir:

<script setup lang="ts">

Evitar Options API en código nuevo salvo que exista una razón concreta.

Usar composables para lógica reutilizable.

---

# 14. Quasar

Utilizar los componentes de Quasar existentes antes de crear componentes personalizados.

Respetar:

- responsive design
- mobile
- desktop
- accesibilidad
- estructura visual existente

No cambiar estilos globales innecesariamente.

---

# 15. Responsive Design

NEXORA debe funcionar correctamente en:

- desktop
- tablet
- móvil

Cualquier nuevo componente debe revisarse en ambos tamaños.

No solucionar problemas móviles rompiendo la experiencia desktop.

---

# 16. Formularios

Mantener validaciones centralizadas y claras.

Los formularios deben:

- validar datos
- mostrar errores correctamente
- evitar acciones duplicadas
- respetar estados de carga
- mantener UX consistente

No duplicar expresiones de validación si pueden convertirse en utilidades reutilizables.

---

# 17. Utilidades globales

Si una función puede utilizarse en diferentes módulos, considerar colocarla en una utilidad global.

Ejemplo:

formatearFecha()

No duplicar funciones idénticas en:

clientes
citas
reportes
finanzas
etc.

---

# 18. Módulos actuales

NEXORA contiene actualmente módulos relacionados con:

- autenticación
- clientes
- citas
- horario
- disponibilidad
- servicios
- profesionales
- productos
- inventario
- pedidos
- finanzas
- conversaciones
- llamadas
- WhatsApp
- automatizaciones
- recordatorios
- agente IA
- reportes
- integraciones
- usuarios y permisos
- configuración
- suscripción
- perfil
- plataforma

Antes de crear un módulo nuevo, comprobar si la funcionalidad pertenece a uno existente.

---

# 19. Navegación actual

Las rutas principales de la aplicación están bajo:

/app

Entre ellas:

/app/dashboard
/app/appointments
/app/customers
/app/schedule
/app/availability
/app/services
/app/employees
/app/products
/app/inventory
/app/orders
/app/finance
/app/conversations
/app/calls
/app/whatsapp
/app/automations
/app/reminders
/app/ai
/app/reports
/app/integrations
/app/users
/app/settings
/app/subscription
/app/profile
/app/platform

---

# 20. Documentación visual

La documentación técnica se mantiene en:

docs/

Actualmente:

docs/navegacion.md
docs/arquitectura.md
docs/acceso.md

Estos documentos utilizan Mermaid.

Cuando se realicen cambios estructurales importantes:

- nuevas rutas
- nuevos módulos
- cambios de arquitectura
- cambios de autenticación
- cambios de permisos
- cambios de suscripción

la documentación correspondiente debe revisarse y actualizarse.

---

# 21. IA y análisis del proyecto

Cuando se solicite analizar NEXORA:

No asumir.

Primero buscar en el workspace.

Revisar los archivos reales relacionados con la tarea.

Seguir las referencias entre:

pages
components
composables
stores
services
mocks
types

Si una relación no puede confirmarse mediante el código, indicarlo.

No inventar dependencias.

---

# 22. Cambios de código

Antes de modificar un archivo:

1. Leer el archivo actual.
2. Identificar dependencias.
3. Identificar imports.
4. Identificar componentes consumidores.
5. Revisar si existe código relacionado.
6. Mantener compatibilidad con la arquitectura actual.

Al modificar:

- conservar funcionalidad existente
- evitar cambios innecesarios
- evitar refactors masivos sin necesidad
- mantener nombres coherentes
- mantener el estilo existente

---

# 23. Archivos generados

No modificar manualmente archivos generados automáticamente.

Especialmente archivos generados por:

- Vue Router
- herramientas de build
- Quasar
- TypeScript
- otros generadores del proyecto

Modificar la fuente que genera el archivo.

---

# 24. Backend futuro

Actualmente el backend está fuera del alcance principal.

No crear backend, endpoints, controladores o bases de datos salvo que se solicite explícitamente.

Sin embargo, todo nuevo service debe mantener una arquitectura preparada para sustituir:

Mock

por:

API

en el futuro.

---

# 25. Regla para nuevos componentes

Antes de crear un componente:

1. Buscar componentes existentes.
2. Determinar si puede reutilizarse.
3. Si la funcionalidad es específica de un módulo, mantenerlo dentro del módulo.
4. Si la funcionalidad es transversal a todo NEXORA, considerar un componente/shared/utilidad global.

---

# 26. Regla para nuevos composables

Crear un composable cuando exista lógica reutilizable relacionada con:

- estado
- interacción
- formularios
- navegación
- lógica de negocio de presentación
- integración entre componentes y stores

No crear composables simplemente para envolver una función trivial.

---

# 27. Regla para nuevos stores

Crear un Pinia store cuando exista estado que deba mantenerse:

- globalmente
- entre varias vistas
- entre varios componentes
- asociado a una entidad o módulo

No colocar todo el estado de la aplicación en un único store global.

Mantener stores separados por dominio/módulo.

---

# 28. Regla para services

Los componentes no deben llamar directamente a:

- localStorage
- fetch
- axios
- mocks

cuando exista un service correspondiente.

La comunicación debe pasar por la capa de service.

---

# 29. Calidad

Al finalizar cambios importantes:

- revisar errores TypeScript
- revisar imports
- revisar rutas
- revisar responsive
- revisar navegación
- revisar estados vacíos
- revisar loading
- revisar errores
- comprobar que no se rompió funcionalidad existente

Si es posible, ejecutar:

npm run build

o el comando de validación correspondiente del proyecto.

---

# 30. Principio general

NEXORA debe crecer como un producto real.

Prioridades:

1. claridad
2. mantenibilidad
3. reutilización
4. separación de responsabilidades
5. escalabilidad
6. tipado
7. experiencia de usuario
8. preparación para API/backend

No resolver problemas simplemente agregando código.

Primero comprender la arquitectura existente y después realizar el cambio mínimo necesario.
