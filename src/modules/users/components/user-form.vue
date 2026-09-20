<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="user-form">
      <q-card-section class="user-form__header">
        <div class="user-form__title-wrapper">
          <div class="user-form__icon">
            <q-icon :name="modoEdicion ? 'edit' : 'person_add'" size="22px" />
          </div>

          <div class="user-form__heading">
            <div class="user-form__title">
              {{ modoEdicion ? 'Editar usuario' : 'Nuevo usuario' }}
            </div>

            <div class="user-form__subtitle">
              {{
                modoEdicion
                  ? 'Actualiza la información y configuración del usuario.'
                  : 'Registra un nuevo miembro para tu equipo en NEXORA.'
              }}
            </div>
          </div>
        </div>

        <q-btn flat round dense icon="close" color="grey-7" aria-label="Cerrar" @click="cerrar" />
      </q-card-section>

      <q-separator />

      <q-card-section class="user-form__body">
        <div class="user-form__section">
          <div class="user-form__section-heading">
            <div class="user-form__section-icon">
              <q-icon name="person_outline" size="18px" />
            </div>

            <div>
              <div class="user-form__section-title">Información personal</div>

              <div class="user-form__section-description">
                Datos básicos para identificar al usuario.
              </div>
            </div>
          </div>

          <div class="user-form__grid">
            <q-input
              v-model="formulario.nombre"
              outlined
              label="Nombre"
              placeholder="Ej. Juan"
              :rules="[reglaRequerido]"
              class="user-form__field"
            >
              <template #prepend>
                <q-icon name="person_outline" />
              </template>
            </q-input>

            <q-input
              v-model="formulario.apellido"
              outlined
              label="Apellido"
              placeholder="Ej. Pérez"
              :rules="[reglaRequerido]"
              class="user-form__field"
            >
              <template #prepend>
                <q-icon name="badge" />
              </template>
            </q-input>

            <q-input
              v-model="formulario.email"
              outlined
              type="email"
              label="Correo electrónico"
              placeholder="usuario@empresa.com"
              :rules="[reglaRequerido, reglaEmail]"
              class="user-form__field"
            >
              <template #prepend>
                <q-icon name="mail_outline" />
              </template>
            </q-input>

            <q-input
              v-model="formulario.telefono"
              outlined
              label="Teléfono"
              placeholder="+57 300 000 0000"
              class="user-form__field"
            >
              <template #prepend>
                <q-icon name="phone" />
              </template>
            </q-input>
          </div>
        </div>

        <q-separator class="user-form__separator" />

        <div class="user-form__section">
          <div class="user-form__section-heading">
            <div class="user-form__section-icon">
              <q-icon name="business_center" size="18px" />
            </div>

            <div>
              <div class="user-form__section-title">Información del equipo</div>

              <div class="user-form__section-description">
                Define el rol y la posición del usuario dentro de NEXORA.
              </div>
            </div>
          </div>

          <div class="user-form__grid">
            <q-select
              v-model="formulario.rol"
              outlined
              emit-value
              map-options
              label="Rol"
              :options="roles"
              :rules="[reglaRequerido]"
              class="user-form__field"
            >
              <template #prepend>
                <q-icon name="admin_panel_settings" />
              </template>
            </q-select>

            <q-input
              v-model="formulario.cargo"
              outlined
              label="Cargo"
              placeholder="Ej. Recepcionista"
              :rules="[reglaRequerido]"
              class="user-form__field"
            >
              <template #prepend>
                <q-icon name="work_outline" />
              </template>
            </q-input>
          </div>
        </div>

        <q-separator class="user-form__separator" />

        <div class="user-form__section">
          <div class="user-form__section-heading">
            <div class="user-form__section-icon">
              <q-icon name="toggle_on" size="18px" />
            </div>

            <div>
              <div class="user-form__section-title">Estado de acceso</div>

              <div class="user-form__section-description">
                Controla el estado actual de la cuenta.
              </div>
            </div>
          </div>

          <q-select
            v-model="formulario.estado"
            outlined
            emit-value
            map-options
            label="Estado"
            :options="estados"
            :rules="[reglaRequerido]"
            class="user-form__field user-form__field--status"
          >
            <template #prepend>
              <q-icon name="verified_user" />
            </template>
          </q-select>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="user-form__footer">
        <q-btn flat no-caps label="Cancelar" color="grey-7" :disable="guardando" @click="cerrar" />

        <q-btn
          unelevated
          no-caps
          color="primary"
          :icon="modoEdicion ? 'save' : 'person_add'"
          :label="modoEdicion ? 'Guardar cambios' : 'Crear usuario'"
          :loading="guardando"
          @click="guardar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { Notify } from 'quasar';

import type {
  ActualizarUsuario,
  CrearUsuario,
  EstadoUsuario,
  RolUsuario,
  Usuario,
} from '../types/user.types';

interface OpcionRol {
  label: string;
  value: RolUsuario;
}

interface OpcionEstado {
  label: string;
  value: EstadoUsuario;
}

interface FormularioUsuario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: RolUsuario;
  cargo: string;
  estado: EstadoUsuario;
}

const props = defineProps<{
  modelValue: boolean;
  usuario: Usuario | null;
  roles: OpcionRol[];
  estados: OpcionEstado[];
  guardando: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  crear: [datos: CrearUsuario];
  actualizar: [datos: ActualizarUsuario];
}>();

const crearFormularioInicial = (): FormularioUsuario => ({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  rol: 'recepcionista',
  cargo: '',
  estado: 'activo',
});

const formulario = reactive<FormularioUsuario>(crearFormularioInicial());

const modoEdicion = computed(() => props.usuario !== null);

const cargarUsuario = (usuario: Usuario | null): void => {
  if (!usuario) {
    Object.assign(formulario, crearFormularioInicial());

    return;
  }

  formulario.nombre = usuario.nombre;
  formulario.apellido = usuario.apellido;
  formulario.email = usuario.email;
  formulario.telefono = usuario.telefono;
  formulario.rol = usuario.rol;
  formulario.cargo = usuario.cargo;
  formulario.estado = usuario.estado;
};

watch(
  [() => props.usuario, () => props.modelValue],
  ([usuario, abierto]) => {
    if (abierto) {
      cargarUsuario(usuario);
    }
  },
  {
    immediate: true,
  },
);

const reglaRequerido = (valor: string | null | undefined): true | string => {
  return Boolean(valor?.trim()) || 'Este campo es obligatorio';
};

const reglaEmail = (valor: string | null | undefined): true | string => {
  if (!valor?.trim()) {
    return 'El correo es obligatorio';
  }

  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return patron.test(valor) || 'Ingresa un correo válido';
};

const cerrar = (): void => {
  emit('update:modelValue', false);
};

const guardar = (): void => {
  const nombre = formulario.nombre.trim();
  const apellido = formulario.apellido.trim();
  const email = formulario.email.trim();
  const telefono = formulario.telefono.trim();
  const cargo = formulario.cargo.trim();

  if (!nombre || !apellido || !email || !cargo) {
    Notify.create({
      type: 'warning',
      message: 'Completa los campos obligatorios.',
    });

    return;
  }

  if (reglaEmail(email) !== true) {
    Notify.create({
      type: 'warning',
      message: 'Ingresa un correo electrónico válido.',
    });

    return;
  }

  if (props.usuario) {
    emit('actualizar', {
      id: props.usuario.id,
      nombre,
      apellido,
      email,
      telefono,
      rol: formulario.rol,
      cargo,
      estado: formulario.estado,
    });

    return;
  }

  emit('crear', {
    nombre,
    apellido,
    email,
    telefono,
    rol: formulario.rol,
    cargo,
    estado: formulario.estado,
  });
};
</script>

<style scoped>
.user-form {
  display: flex;
  flex-direction: column;
  width: min(720px, 95vw);
  max-width: 720px;
  max-height: 90vh;
  border-radius: 18px;
  overflow: hidden;
}

.user-form__header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px;
}

.user-form__title-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.user-form__heading {
  min-width: 0;
}

.user-form__icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;
}

.user-form__title {
  font-size: 19px;
  font-weight: 700;
  line-height: 1.3;
  color: #1f2937;
}

.user-form__subtitle {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.45;
  color: #6b7280;
}

.user-form__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 24px;
}

.user-form__section {
  width: 100%;
}

.user-form__section-heading {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-bottom: 18px;
}

.user-form__section-icon {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #f3f4f6;
  color: #4b5563;
}

.user-form__section-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
  color: #374151;
}

.user-form__section-description {
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.45;
  color: #9ca3af;
}

.user-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.user-form__field {
  min-width: 0;
}

.user-form__field :deep(.q-field__control) {
  border-radius: 11px;
}

.user-form__field :deep(.q-field__prepend) {
  color: #9ca3af;
}

.user-form__field :deep(.q-field__label) {
  color: #6b7280;
}

.user-form__separator {
  margin: 24px 0;
}

.user-form__field--status {
  max-width: 340px;
}

.user-form__footer {
  flex: 0 0 auto;
  gap: 8px;
  padding: 16px 24px;
  background: #ffffff;
}

@media (max-width: 600px) {
  .user-form {
    width: 96vw;
    max-height: 92vh;
  }

  .user-form__header,
  .user-form__body,
  .user-form__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .user-form__grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .user-form__field--status {
    max-width: none;
  }

  .user-form__footer {
    justify-content: stretch;
  }

  .user-form__footer .q-btn {
    flex: 1;
  }

  .user-form__subtitle {
    font-size: 12px;
  }
}
</style>
