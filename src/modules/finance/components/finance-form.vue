<template>
  <q-dialog v-model="mostrar" persistent>
    <q-card class="finance-form">
      <q-card-section class="finance-form__header">
        <div class="finance-form__header-content">
          <div class="finance-form__icon">
            <q-icon :name="modoEdicion ? 'edit' : 'account_balance_wallet'" size="22px" />
          </div>

          <div>
            <div class="finance-form__title">
              {{ modoEdicion ? 'Editar movimiento' : 'Nuevo movimiento' }}
            </div>

            <div class="finance-form__subtitle">
              {{
                modoEdicion
                  ? 'Actualiza la información del movimiento financiero.'
                  : 'Registra un nuevo ingreso o gasto del negocio.'
              }}
            </div>
          </div>
        </div>

        <q-btn flat round dense icon="close" @click="cerrar" />
      </q-card-section>

      <q-separator />

      <q-card-section class="finance-form__body">
        <div class="finance-form__grid">
          <q-select
            v-model="formulario.tipo"
            outlined
            label="Tipo de movimiento"
            emit-value
            map-options
            :options="opcionesTipo"
            :rules="[(valor) => !!valor || 'Selecciona el tipo de movimiento']"
          />

          <q-input
            v-model="formulario.concepto"
            outlined
            label="Concepto"
            maxlength="120"
            counter
            :rules="[(valor) => !!valor?.trim() || 'El concepto es obligatorio']"
          />

          <q-select
            v-model="formulario.categoria"
            outlined
            label="Categoría"
            emit-value
            map-options
            :options="opcionesCategoria"
            :rules="[(valor) => !!valor || 'Selecciona una categoría']"
          />

          <q-input
            v-model.number="formulario.monto"
            outlined
            type="number"
            min="1"
            label="Monto"
            prefix="$"
            :rules="[(valor) => Number(valor) > 0 || 'El monto debe ser mayor que cero']"
          />

          <q-select
            v-model="formulario.metodoPago"
            outlined
            label="Método de pago"
            emit-value
            map-options
            :options="opcionesMetodoPago"
            :rules="[(valor) => !!valor || 'Selecciona un método de pago']"
          />

          <q-input
            v-model="formulario.fecha"
            outlined
            type="date"
            label="Fecha"
            :rules="[(valor) => !!valor || 'La fecha es obligatoria']"
          />

          <q-input
            v-model="formulario.referencia"
            outlined
            label="Referencia"
            maxlength="80"
            counter
            placeholder="Ej. CITA-1050"
          />

          <q-input
            v-model="formulario.descripcion"
            outlined
            type="textarea"
            label="Descripción"
            maxlength="300"
            counter
            class="finance-form__description"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="finance-form__footer">
        <q-btn flat no-caps label="Cancelar" :disable="guardando" @click="cerrar" />

        <q-btn
          unelevated
          no-caps
          color="primary"
          :loading="guardando"
          :label="modoEdicion ? 'Guardar cambios' : 'Registrar movimiento'"
          @click="guardar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

import type {
  CrearMovimientoFinanciero,
  MetodoPagoFinanciero,
  MovimientoFinanciero,
  TipoMovimientoFinanciero,
} from '../types/finance.types';

interface Props {
  modelValue: boolean;
  movimiento?: MovimientoFinanciero | null;
  guardando?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  movimiento: null,
  guardando: false,
});

const emit = defineEmits<{
  'update:modelValue': [valor: boolean];
  guardar: [datos: CrearMovimientoFinanciero];
}>();

interface FormularioMovimiento {
  tipo: TipoMovimientoFinanciero;
  concepto: string;
  categoria: string;
  monto: number;
  metodoPago: MetodoPagoFinanciero;
  fecha: string;
  referencia: string;
  descripcion: string;
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD.
 *
 * Se declara antes de crearFormulario porque
 * crearFormulario puede ejecutarse inmediatamente
 * durante la inicialización del componente.
 */
const obtenerFechaActual = (): string => {
  const fecha = new Date();

  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
};

const crearFormulario = (movimiento?: MovimientoFinanciero | null): FormularioMovimiento => {
  if (movimiento) {
    return {
      tipo: movimiento.tipo,
      concepto: movimiento.concepto,
      categoria: movimiento.categoria,
      monto: movimiento.monto,
      metodoPago: movimiento.metodoPago,
      fecha: movimiento.fecha,
      referencia: movimiento.referencia ?? '',
      descripcion: movimiento.descripcion,
    };
  }

  return {
    tipo: 'ingreso',
    concepto: '',
    categoria: 'servicio',
    monto: 0,
    metodoPago: 'efectivo',
    fecha: obtenerFechaActual(),
    referencia: '',
    descripcion: '',
  };
};

const formulario = reactive<FormularioMovimiento>(crearFormulario(props.movimiento));

const mostrar = computed({
  get: () => props.modelValue,

  set: (valor: boolean) => {
    emit('update:modelValue', valor);
  },
});

const modoEdicion = computed(() => props.movimiento !== null);

const opcionesTipo = [
  {
    label: 'Ingreso',
    value: 'ingreso',
  },
  {
    label: 'Gasto',
    value: 'gasto',
  },
];

const opcionesMetodoPago = [
  {
    label: 'Efectivo',
    value: 'efectivo',
  },
  {
    label: 'Tarjeta',
    value: 'tarjeta',
  },
  {
    label: 'Transferencia',
    value: 'transferencia',
  },
  {
    label: 'Otro',
    value: 'otro',
  },
];

const categoriasIngreso = [
  {
    label: 'Venta',
    value: 'venta',
  },
  {
    label: 'Servicio',
    value: 'servicio',
  },
  {
    label: 'Cita',
    value: 'cita',
  },
  {
    label: 'Otro',
    value: 'otro',
  },
];

const categoriasGasto = [
  {
    label: 'Insumos',
    value: 'insumos',
  },
  {
    label: 'Nómina',
    value: 'nomina',
  },
  {
    label: 'Servicios',
    value: 'servicios',
  },
  {
    label: 'Alquiler',
    value: 'alquiler',
  },
  {
    label: 'Marketing',
    value: 'marketing',
  },
  {
    label: 'Impuestos',
    value: 'impuestos',
  },
  {
    label: 'Otro',
    value: 'otro',
  },
];

const opcionesCategoria = computed(() => {
  return formulario.tipo === 'ingreso' ? categoriasIngreso : categoriasGasto;
});

const categoriaValida = computed(() => {
  return opcionesCategoria.value.some((opcion) => opcion.value === formulario.categoria);
});

watch(
  () => formulario.tipo,
  () => {
    if (!categoriaValida.value) {
      formulario.categoria = formulario.tipo === 'ingreso' ? 'servicio' : 'insumos';
    }
  },
);

watch(
  () => props.movimiento,
  (movimiento) => {
    Object.assign(formulario, crearFormulario(movimiento));
  },
);

const cerrar = (): void => {
  emit('update:modelValue', false);
};

const guardar = (): void => {
  const concepto = formulario.concepto.trim();

  const referencia = formulario.referencia.trim();

  const descripcion = formulario.descripcion.trim();

  if (!concepto || formulario.monto <= 0 || !formulario.fecha || !categoriaValida.value) {
    return;
  }

  const datos: CrearMovimientoFinanciero = {
    tipo: formulario.tipo,
    concepto,
    categoria: formulario.categoria,
    monto: formulario.monto,
    metodoPago: formulario.metodoPago,
    fecha: formulario.fecha,
    ...(referencia
      ? {
          referencia,
        }
      : {}),
    descripcion,
  };

  emit('guardar', datos);
};
</script>

<style scoped>
.finance-form {
  width: min(760px, calc(100vw - 32px));
  max-width: 760px;
  border-radius: 18px;
}

.finance-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.finance-form__header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.finance-form__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.08);
  color: var(--q-primary);
}

.finance-form__title {
  color: var(--q-dark);
  font-size: 18px;
  font-weight: 700;
}

.finance-form__subtitle {
  margin-top: 3px;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.4;
}

.finance-form__body {
  max-height: 66vh;
  overflow-y: auto;
}

.finance-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.finance-form__description {
  grid-column: span 2;
}

.finance-form__footer {
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
}

@media (max-width: 600px) {
  .finance-form {
    width: calc(100vw - 20px);
  }

  .finance-form__grid {
    grid-template-columns: 1fr;
  }

  .finance-form__description {
    grid-column: auto;
  }

  .finance-form__footer {
    flex-wrap: wrap;
  }

  .finance-form__footer .q-btn {
    flex: 1;
  }
}
</style>
