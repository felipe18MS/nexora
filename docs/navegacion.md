# NEXORA — Flujo de navegación

Este documento representa la navegación actual de NEXORA.

## Flujo principal

```mermaid
flowchart TD

    START([Inicio]) --> LOGIN[Login]
    START --> REGISTER[Registro]

    REGISTER --> DASHBOARD[Dashboard]
    LOGIN --> DASHBOARD

    DASHBOARD --> APP[NEXORA / Aplicación]

    APP --> DASHBOARD
    APP --> CUSTOMERS[Clientes]
    APP --> APPOINTMENTS[Citas]
    APP --> SCHEDULE[Horario]
    APP --> AVAILABILITY[Disponibilidad]
    APP --> SERVICES[Servicios]
    APP --> EMPLOYEES[Profesionales]
    APP --> PRODUCTS[Productos]
    APP --> INVENTORY[Inventario]
    APP --> ORDERS[Pedidos]
    APP --> FINANCE[Finanzas]

    APP --> CONVERSATIONS[Conversaciones]
    APP --> CALLS[Llamadas]
    APP --> WHATSAPP[WhatsApp]
    APP --> AUTOMATIONS[Automatizaciones]
    APP --> REMINDERS[Recordatorios]
    APP --> AI[Agente IA]

    APP --> REPORTS[Reportes]
    APP --> INTEGRATIONS[Integraciones]

    APP --> USERS[Usuarios y permisos]
    APP --> SETTINGS[Configuración]
    APP --> SUBSCRIPTION[Suscripción]
    APP --> PROFILE[Perfil]

    APP --> PLATFORM[Plataforma / Superadministrador]
```


## Rutas públicas

```text
/
├── /
├── /auth/login
└── /auth/register
```

### Login

```text
/auth/login
      │
      ├── Usuario no autenticado
      │        │
      │        └── Puede iniciar sesión
      │
      └── Usuario autenticado
               │
               └── /app/dashboard
```

### Registro

```text
/auth/register
      │
      └── Crear cuenta
             │
             └── /app/dashboard
```


## Rutas protegidas

Todas las rutas que comienzan por:

```text
/app
```

requieren autenticación.

Actualmente existen:

```text
/app
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
```


## Estructura conceptual

```mermaid
flowchart LR

    AUTH[Autenticación]

    LOGIN[Login]
    REGISTER[Registro]

    APP[Aplicación NEXORA]

    CORE[Gestión del negocio]
    COMM[Comunicación y automatización]
    ANALYTICS[Información]
    ADMIN[Administración]
    PLATFORM[Plataforma]

    AUTH --> LOGIN
    AUTH --> REGISTER

    LOGIN --> APP
    REGISTER --> APP

    APP --> CORE
    APP --> COMM
    APP --> ANALYTICS
    APP --> ADMIN
    APP --> PLATFORM

    CORE --> CUSTOMERS[Clientes]
    CORE --> APPOINTMENTS[Citas]
    CORE --> SCHEDULE[Horario]
    CORE --> AVAILABILITY[Disponibilidad]
    CORE --> SERVICES[Servicios]
    CORE --> EMPLOYEES[Profesionales]

    CORE --> PRODUCTS[Productos]
    CORE --> INVENTORY[Inventario]
    CORE --> ORDERS[Pedidos]
    CORE --> FINANCE[Finanzas]

    COMM --> CONVERSATIONS[Conversaciones]
    COMM --> CALLS[Llamadas]
    COMM --> WHATSAPP[WhatsApp]
    COMM --> AUTOMATIONS[Automatizaciones]
    COMM --> REMINDERS[Recordatorios]
    COMM --> AI[Agente IA]

    ANALYTICS --> REPORTS[Reportes]

    ADMIN --> INTEGRATIONS[Integraciones]
    ADMIN --> USERS[Usuarios y permisos]
    ADMIN --> SETTINGS[Configuración]
    ADMIN --> SUBSCRIPTION[Suscripción]
    ADMIN --> PROFILE[Perfil]

    PLATFORM --> PLATFORM_PAGE[Panel de Plataforma]
```


## Flujo de redirección

El router actualmente implementa estas reglas:

```mermaid
flowchart TD

    REQUEST([Usuario intenta acceder a una ruta])
        --> RESTORE[Restaurar sesión]

    RESTORE --> CHECK{¿Ruta comienza por /app?}

    CHECK -->|No| LOGIN_CHECK{¿Es /auth/login?}

    CHECK -->|Sí| AUTH_CHECK{¿Está autenticado?}

    AUTH_CHECK -->|No| REDIRECT_LOGIN[Redirigir a /auth/login]
    REDIRECT_LOGIN --> REDIRECT_QUERY[Guardar ruta original en redirect]

    AUTH_CHECK -->|Sí| ALLOW[Permitir navegación]

    LOGIN_CHECK -->|Sí| AUTHENTICATED{¿Está autenticado?}

    LOGIN_CHECK -->|No| ALLOW

    AUTHENTICATED -->|Sí| DASHBOARD[Redirigir a /app/dashboard]
    AUTHENTICATED -->|No| ALLOW
```


## Estado actual de protección

Actualmente el router protege:

```text
/app/*
```

mediante autenticación.

Todavía quedan como siguientes capas:

```text
Autenticación
      ↓
Rol
      ↓
Suscripción
      ↓
Permisos del módulo
```

Estas capas serán implementadas posteriormente.


## Nota técnica

NEXORA utiliza Vue Router Auto Routes.

Las rutas se generan automáticamente desde:

```text
src/pages/
```

Por esta razón:

```text
src/router/routes.ts
```

no contiene manualmente cada ruta.

No modificar manualmente:

```text
typed-router.d.ts
```

porque es un archivo generado por Vue Router.
