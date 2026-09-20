<template>
  <aside v-if="conversacion" class="details-panel">
    <div class="details-header">
      <div class="details-title">Información</div>

      <q-btn flat round dense icon="close" color="grey-7" @click="emit('cerrar')" />
    </div>

    <div class="profile-section">
      <div class="profile-avatar">
        {{ obtenerIniciales(conversacion.clienteNombre) }}
      </div>

      <div class="profile-name">
        {{ conversacion.clienteNombre }}
      </div>

      <div class="profile-phone">
        {{ conversacion.clienteTelefono }}
      </div>
    </div>

    <q-separator />

    <div class="info-section">
      <div class="info-label">Asunto</div>
      <div class="info-value">
        {{ conversacion.asunto }}
      </div>
    </div>

    <div class="info-section">
      <div class="info-label">Canal</div>

      <div class="info-value channel-value">
        <q-icon :name="obtenerIconoCanal(conversacion.canal)" size="16px" />

        {{ obtenerNombreCanal(conversacion.canal) }}
      </div>
    </div>

    <div class="info-section">
      <div class="info-label">Estado</div>

      <q-badge class="status-badge" :label="obtenerNombreEstado(conversacion.estado)" />
    </div>

    <div class="info-section">
      <div class="info-label">Última actividad</div>

      <div class="info-value">
        {{ formatearFecha(conversacion.ultimoMensajeEn) }}
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type {
  CanalConversacion,
  Conversacion,
  EstadoConversacion,
} from '../types/conversation.types';

defineProps<{
  conversacion: Conversacion | null;
}>();

const emit = defineEmits<{
  cerrar: [];
}>();

const obtenerIniciales = (nombre: string): string => {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join('')
    .toUpperCase();
};

const obtenerIconoCanal = (canal: CanalConversacion): string => {
  const iconos: Record<CanalConversacion, string> = {
    whatsapp: 'chat',
    llamada: 'phone',
    email: 'mail',
    interno: 'forum',
  };

  return iconos[canal];
};

const obtenerNombreCanal = (canal: CanalConversacion): string => {
  const nombres: Record<CanalConversacion, string> = {
    whatsapp: 'WhatsApp',
    llamada: 'Llamada',
    email: 'Email',
    interno: 'Interno',
  };

  return nombres[canal];
};

const obtenerNombreEstado = (estado: EstadoConversacion): string => {
  const nombres: Record<EstadoConversacion, string> = {
    abierta: 'Abierta',
    pendiente: 'Pendiente',
    resuelta: 'Resuelta',
    cerrada: 'Cerrada',
  };

  return nombres[estado];
};

const formatearFecha = (fecha: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha));
};
</script>

<style scoped>
.details-panel {
  width: 260px;
  min-width: 260px;
  height: 100%;
  border-left: 1px solid #e5e7eb;
  background: #ffffff;
}

.details-header {
  height: 60px;
  padding: 0 12px 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}

.details-title {
  color: #334155;
  font-size: 13px;
  font-weight: 600;
}

.profile-section {
  padding: 24px 18px;
  text-align: center;
}

.profile-avatar {
  width: 58px;
  height: 58px;
  margin: 0 auto 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8eef7;
  color: #334155;
  font-size: 16px;
  font-weight: 700;
}

.profile-name {
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
}

.profile-phone {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 11px;
}

.info-section {
  padding: 14px 18px;
}

.info-label {
  margin-bottom: 5px;
  color: #94a3b8;
  font-size: 11px;
}

.info-value {
  color: #475569;
  font-size: 12px;
  line-height: 1.5;
}

.channel-value {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-badge {
  background: #f1f5f9;
  color: #475569;
  font-size: 10px;
}

@media (max-width: 1000px) {
  .details-panel {
    display: none;
  }
}
</style>
