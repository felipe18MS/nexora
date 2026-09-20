# NEXORA — Autenticación, roles y acceso

## Flujo actual

```mermaid
flowchart TD

    USER([Usuario])

    USER --> LOGIN[Login]
    USER --> REGISTER[Registro]

    LOGIN --> AUTH[Auth Store]
    REGISTER --> AUTH

    AUTH --> SESSION[Sesión]

    SESSION --> ROUTER[Vue Router]

    ROUTER --> CHECK{¿Ruta /app?}

    CHECK -->|No| PUBLIC[Acceso público]

    CHECK -->|Sí| AUTHENTICATED{¿Autenticado?}

    AUTHENTICATED -->|No| LOGIN_REDIRECT[Redirigir a Login]

    AUTHENTICATED -->|Sí| APP[Acceder a aplicación]
```


## Router Guard actual

La protección actual funciona conceptualmente así:

```text
Usuario
   │
   ▼
Router
   │
   ▼
restaurarSesion()
   │
   ▼
¿Ruta empieza por /app?
   │
   ├── NO ──► continuar
   │
   └── SÍ
          │
          ▼
     ¿Autenticado?
          │
          ├── NO ──► /auth/login
          │
          └── SÍ ──► permitir acceso
```


## Redirección al Login

Cuando un usuario no autenticado intenta acceder a:

```text
/app/dashboard
```

el router genera:

```text
/auth/login?redirect=/app/dashboard
```

Esto permite conservar la ruta que el usuario intentaba visitar.


## Usuario autenticado

Si un usuario autenticado intenta acceder a:

```text
/auth/login
```

el router actualmente lo envía a:

```text
/app/dashboard
```


# Próxima arquitectura de autorización

La arquitectura prevista para NEXORA será:

```mermaid
flowchart TD

    USER[Usuario]

    USER --> AUTH[Autenticación]

    AUTH --> ROLE[Rol]

    ROLE --> SUBSCRIPTION[Estado de suscripción]

    SUBSCRIPTION --> PERMISSIONS[Permisos]

    PERMISSIONS --> MODULE[Acceso al módulo]

    MODULE --> PAGE[Página]
```


## Capas de acceso

### 1. Autenticación

Determina:

```text
¿El usuario inició sesión?
```

Ejemplo:

```text
autenticado = true
```


### 2. Rol

Determina:

```text
¿Qué tipo de usuario es?
```

Ejemplos previstos:

```text
superadmin
admin
manager
employee
user
```


### 3. Suscripción

Determina:

```text
¿La cuenta puede utilizar NEXORA?
```

Estados previstos:

```text
trial
active
expired
cancelled
suspended
```


### 4. Permisos

Determina:

```text
¿Qué puede hacer el usuario?
```

Ejemplo conceptual:

```text
appointments.view
appointments.create
appointments.edit
appointments.delete
customers.view
customers.create
reports.view
```


## Superadministrador

La Plataforma será una zona especial:

```mermaid
flowchart TD

    USER[Usuario]

    USER --> AUTH[Autenticación]
    AUTH --> ROLE{Rol}

    ROLE -->|Superadmin| PLATFORM[Plataforma]
    ROLE -->|Usuario normal| SUBSCRIPTION[Suscripción]

    PLATFORM --> BRANDING[Branding global]
    PLATFORM --> LEGAL[Documentos legales]
    PLATFORM --> SYSTEM[Configuración global]

    SUBSCRIPTION --> ACCESS[Aplicación NEXORA]
```

El objetivo es que:

```text
Superadmin
   ↓
Plataforma
```

no dependa de la suscripción normal de un negocio.


## Arquitectura final prevista

```mermaid
flowchart TD

    USER[Usuario]

    USER --> AUTH[Autenticación]

    AUTH --> ROLE{Rol}

    ROLE -->|Superadmin| PLATFORM[Platform]
    ROLE -->|Usuario de negocio| SUBSCRIPTION[Subscription]

    SUBSCRIPTION --> STATUS{Estado}

    STATUS -->|trial| ACCESS[Acceso]
    STATUS -->|active| ACCESS

    STATUS -->|expired| RESTRICTED[Acceso restringido]
    STATUS -->|cancelled| RESTRICTED
    STATUS -->|suspended| RESTRICTED

    ACCESS --> PERMISSIONS[Permisos]

    PERMISSIONS --> MODULES[Módulos]

    MODULES --> DASHBOARD[Dashboard]
    MODULES --> CUSTOMERS[Clientes]
    MODULES --> APPOINTMENTS[Citas]
    MODULES --> SERVICES[Servicios]
    MODULES --> REPORTS[Reportes]
    MODULES --> OTHER[Otros módulos]

    PLATFORM --> BRANDING[Branding]
    PLATFORM --> LEGAL[Documentos legales]
    PLATFORM --> SYSTEM[Configuración global]
```


# Estado de implementación

## Implementado


## Siguiente fase

