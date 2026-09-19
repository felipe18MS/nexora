<template>
  <q-dialog v-model="dialogoAbierto" persistent>
    <q-card class="confirm-dialog">
      <q-card-section class="confirm-dialog__header">
        <div class="confirm-dialog__icon" :class="`confirm-dialog__icon--${tipo}`">
          <q-icon :name="icono" size="26px" />
        </div>

        <div class="confirm-dialog__content">
          <div class="confirm-dialog__title">
            {{ titulo }}
          </div>

          <div class="confirm-dialog__message">
            {{ mensaje }}
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="confirm-dialog__actions">
        <q-btn flat no-caps label="Cancelar" color="grey-7" :disable="loading" @click="cancelar" />

        <q-btn
          unelevated
          no-caps
          :color="colorBoton"
          :label="textoConfirmar"
          :loading="loading"
          @click="confirmar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type TipoConfirmacion = 'danger' | 'warning' | 'primary';

interface Props {
  modelValue: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  tipo?: TipoConfirmacion;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  textoConfirmar: 'Confirmar',
  tipo: 'primary',
  loading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  cancel: [];
}>();

const dialogoAbierto = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value);
  },
});

const icono = computed(() => {
  if (props.tipo === 'danger') {
    return 'delete_outline';
  }

  if (props.tipo === 'warning') {
    return 'warning_amber';
  }

  return 'check_circle_outline';
});

const colorBoton = computed(() => {
  if (props.tipo === 'danger') {
    return 'negative';
  }

  return 'primary';
});

const confirmar = (): void => {
  emit('confirm');
};

const cancelar = (): void => {
  emit('cancel');
  dialogoAbierto.value = false;
};
</script>

<style scoped lang="scss">
.confirm-dialog {
  width: 460px;
  max-width: calc(100vw - 32px);
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;
}

.confirm-dialog__header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 28px 28px 24px;
}

.confirm-dialog__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  border-radius: 14px;
}

.confirm-dialog__icon--danger {
  background: #fef2f2;
  color: #dc2626;
}

.confirm-dialog__icon--warning {
  background: #fffbeb;
  color: #d97706;
}

.confirm-dialog__icon--primary {
  background: #eef2ff;
  color: var(--q-primary);
}

.confirm-dialog__content {
  min-width: 0;
  padding-top: 1px;
}

.confirm-dialog__title {
  color: #172033;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
}

.confirm-dialog__message {
  margin-top: 7px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.confirm-dialog__actions {
  gap: 8px;
  padding: 16px 28px;
  background: #fafbfc;
}

.confirm-dialog__actions :deep(.q-btn) {
  min-width: 92px;
  border-radius: 9px;
}

@media (max-width: 500px) {
  .confirm-dialog__header {
    padding: 22px 20px 20px;
  }

  .confirm-dialog__actions {
    padding: 14px 20px;
  }
}
</style>
