# NEXORA — Arquitectura frontend

## Arquitectura general

NEXORA utiliza una arquitectura modular basada en:


La arquitectura está preparada para reemplazar posteriormente los mocks por una API/backend real.


## Flujo general de datos

```mermaid
flowchart TD

    PAGE[Page / Vista]
        --> COMPONENT[Componentes]

    COMPONENT
        --> COMPOSABLE[Composable]

    COMPOSABLE
        --> STORE[Pinia Store]

    STORE
        --> SERVICE[Service]

    SERVICE
        --> MOCK[Mock actual]
| whatsapp | Si | Si | Si | Si | Si | Si |

    MOCK
        --> STORAGE[(LocalStorage)]

    SERVICE -. Futuro .-> API[API Backend]

    API -. Futuro .-> DATABASE[(Base de datos)]
```


## Arquitectura por módulo

```mermaid
flowchart TD

    MODULE[Módulo]

    MODULE --> TYPES[types]
    MODULE --> COMPONENTS[components]
    MODULE --> COMPOSABLES[composables]
    MODULE --> STORES[stores]
    MODULE --> SERVICES[services]
    MODULE --> MOCKS[mocks]
    MODULE --> INDEX[index.ts]

    COMPONENTS --> COMPOSABLES
    COMPOSABLES --> STORES
    STORES --> SERVICES
    SERVICES --> MOCKS

    TYPES --> COMPONENTS
    TYPES --> COMPOSABLES
    TYPES --> STORES
    TYPES --> SERVICES
    TYPES --> MOCKS
```


## Ejemplo: módulo Platform

```mermaid
flowchart TD

    PLATFORM[platform]

    PLATFORM --> TYPES[platform.types.ts]
    PLATFORM --> STORE[platform.store.ts]
    PLATFORM --> COMPOSABLE[use-platform.ts]
    PLATFORM --> SERVICE[platform.service.ts]
    PLATFORM --> MOCK[platform.mock.ts]

    PLATFORM --> BRANDING[platform-branding-dialog.vue]
    PLATFORM --> LEGAL[platform-legal-document-dialog.vue]

    STORE --> SERVICE
    SERVICE --> MOCK

    COMPOSABLE --> STORE

    BRANDING --> COMPOSABLE
    LEGAL --> COMPOSABLE

    MOCK --> STORAGE[(localStorage)]
```


## Platform — configuración

```mermaid
flowchart LR

    ADMIN[Superadministrador]
        --> PLATFORM_PAGE[Platform Page]

    PLATFORM_PAGE
        --> BRANDING_DIALOG[Branding Dialog]

    PLATFORM_PAGE
        --> LEGAL_DIALOG[Legal Document Dialog]

    BRANDING_DIALOG
        --> PLATFORM_STORE[Platform Store]

    LEGAL_DIALOG
        --> PLATFORM_STORE

    PLATFORM_STORE
        --> PLATFORM_SERVICE[Platform Service]

    PLATFORM_SERVICE
        --> PLATFORM_MOCK[Platform Mock]

    PLATFORM_MOCK
        --> LOCAL_STORAGE[(nexora_platform_config)]
```


## Flujo de Branding

```mermaid
sequenceDiagram

    participant U as Superadministrador
    participant P as Platform Page
    participant D as Branding Dialog
    participant S as Platform Store
    participant SV as Platform Service
    participant M as Platform Mock
    participant LS as LocalStorage

    U->>P: Abrir Plataforma
    P->>S: cargarConfiguracion()
    S->>SV: obtenerConfiguracion()
    SV->>M: obtenerConfiguracionPlataformaMock()
    M->>LS: Leer configuración
    LS-->>M: Configuración
    M-->>SV: Configuración
    SV-->>S: Configuración
    S-->>P: Branding

    U->>D: Editar branding
    D->>S: actualizarBranding()
    S->>SV: actualizarBranding()
    SV->>M: actualizarBrandingMock()
    M->>LS: Guardar configuración
    M-->>S: Branding actualizado
    S-->>D: Estado actualizado
```


## Flujo de documentos legales

```mermaid
flowchart TD

    ADMIN[Superadministrador]

    ADMIN --> PLATFORM[Plataforma]

    PLATFORM --> LEGAL_EDITOR[Editor de documento legal]

    LEGAL_EDITOR --> STORE[Platform Store]
    STORE --> SERVICE[Platform Service]
    SERVICE --> MOCK[Platform Mock]
    MOCK --> STORAGE[(LocalStorage)]

    STORAGE --> MOCK
    MOCK --> SERVICE
    SERVICE --> STORE

    STORE --> LOGIN[Login]
    STORE --> REGISTER[Registro]

    LOGIN --> TERMS[Términos]
    REGISTER --> TERMS

    REGISTER --> PRIVACY[Privacidad]
    REGISTER --> COOKIES[Cookies]
```


## Preparación para backend

Actualmente:

```text
Vue
 ↓
Composable
 ↓
Pinia
 ↓
Service
 ↓
Mock
 ↓
LocalStorage
```

Arquitectura futura:

```text
Vue
 ↓
Composable
 ↓
Pinia
 ↓
Service
 ↓
API
 ↓
Backend
 ↓
Database
```

El objetivo es que los componentes y composables no tengan que conocer directamente la implementación del backend.


## Principio de separación

```text
Component
    ↓
Presentación

Composable
    ↓
Lógica reutilizable

Store
    ↓
Estado global

Service
    ↓
Acceso a datos

Mock/API
    ↓
Persistencia
```

Esto permite reemplazar:

```text
platform.mock.ts
```

por una implementación HTTP posteriormente sin tener que reconstruir todo el módulo de Platform.
