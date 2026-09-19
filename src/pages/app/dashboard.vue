<template>
  <q-page class="dashboard-page q-pa-lg">
    <!-- Encabezado -->
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-dark">Buenos días, Cristian 👋</div>

        <div class="text-subtitle1 text-grey-7 q-mt-sm">
          Aquí tienes un resumen de lo que está pasando en tu negocio.
        </div>
      </div>

      <q-btn unelevated color="primary" icon="add" label="Nueva cita" no-caps @click="crearCita" />
    </div>

    <!-- KPIs -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div
        v-for="indicador in indicadores"
        :key="indicador.titulo"
        class="col-12 col-sm-6 col-lg-3"
      >
        <q-card flat bordered class="metric-card">
          <q-card-section>
            <div class="row items-start justify-between">
              <div>
                <div class="metric-title">
                  {{ indicador.titulo }}
                </div>

                <div class="metric-value">
                  {{ indicador.valor }}
                </div>

                <div class="metric-change">
                  <q-icon
                    :name="indicador.positivo ? 'trending_up' : 'trending_down'"
                    size="16px"
                  />

                  {{ indicador.cambio }}
                </div>
              </div>

              <div class="metric-icon" :class="`metric-icon--${indicador.color}`">
                <q-icon :name="indicador.icono" size="22px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="row q-col-gutter-md">
      <!-- Actividad -->
      <div class="col-12 col-lg-8">
        <q-card flat bordered class="dashboard-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="section-title">Actividad</div>

                <div class="section-subtitle">Resumen de los últimos 7 días</div>
              </div>

              <q-btn flat dense no-caps color="primary" label="Ver detalles" />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="activity-chart">
            <div class="chart-placeholder">
              <div class="chart-grid">
                <div v-for="valor in actividad" :key="valor.dia" class="chart-column">
                  <div class="chart-bar" :style="{ height: `${valor.valor}%` }">
                    <q-tooltip> {{ valor.cantidad }} interacciones </q-tooltip>
                  </div>

                  <div class="chart-label">
                    {{ valor.dia }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Próximas citas -->
      <div class="col-12 col-lg-4">
        <q-card flat bordered class="dashboard-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="section-title">Próximas citas</div>

                <div class="section-subtitle">Para hoy</div>
              </div>

              <q-btn
                flat
                round
                dense
                icon="arrow_forward"
                color="primary"
                aria-label="Ver citas"
                to="/app/appointments"
              />
            </div>
          </q-card-section>

          <q-separator />

          <q-list separator>
            <q-item v-for="cita in proximasCitas" :key="cita.id" class="appointment-item">
              <q-item-section avatar>
                <q-avatar size="42px" color="primary" text-color="white">
                  {{ obtenerIniciales(cita.cliente) }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ cita.cliente }}
                </q-item-label>

                <q-item-label caption>
                  {{ cita.servicio }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="appointment-time">
                  {{ cita.hora }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>

          <q-card-section>
            <q-btn
              outline
              color="primary"
              label="Ver todas las citas"
              no-caps
              class="full-width"
              to="/app/appointments"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Actividad reciente -->
      <div class="col-12 col-lg-7">
        <q-card flat bordered class="dashboard-card">
          <q-card-section>
            <div class="section-title">Actividad reciente</div>

            <div class="section-subtitle">Últimas acciones registradas</div>
          </q-card-section>

          <q-separator />

          <q-list separator>
            <q-item
              v-for="actividadReciente in actividadesRecientes"
              :key="actividadReciente.id"
              class="recent-item"
            >
              <q-item-section avatar>
                <q-avatar size="38px" :color="actividadReciente.color" text-color="white">
                  <q-icon :name="actividadReciente.icono" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  {{ actividadReciente.titulo }}
                </q-item-label>

                <q-item-label caption>
                  {{ actividadReciente.descripcion }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="text-caption text-grey-6">
                  {{ actividadReciente.tiempo }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Estado del agente -->
      <div class="col-12 col-lg-5">
        <q-card flat bordered class="dashboard-card ai-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="ai-icon">
                <q-icon name="smart_toy" size="28px" />
              </div>

              <div class="q-ml-md">
                <div class="section-title">Agente IA</div>

                <div class="section-subtitle">Estado de automatización</div>
              </div>

              <q-space />

              <q-badge color="positive" label="Activo" rounded />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="ai-stat">
              <div>
                <div class="ai-stat__label">Conversaciones atendidas</div>

                <div class="ai-stat__value">184</div>
              </div>

              <div class="ai-stat__percentage">+18.4%</div>
            </div>

            <q-linear-progress :value="0.78" color="primary" rounded size="8px" class="q-mt-md" />

            <div class="row justify-between q-mt-sm">
              <span class="text-caption text-grey-6"> Rendimiento </span>

              <span class="text-caption text-weight-medium"> 78% </span>
            </div>
          </q-card-section>

          <q-card-actions class="q-px-md q-pb-md">
            <q-btn flat color="primary" label="Administrar agente" no-caps to="/app/ai" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
interface Indicador {
  titulo: string;
  valor: string;
  cambio: string;
  icono: string;
  color: string;
  positivo: boolean;
}

interface Actividad {
  dia: string;
  valor: number;
  cantidad: number;
}

interface Cita {
  id: number;
  cliente: string;
  servicio: string;
  hora: string;
}

interface ActividadReciente {
  id: number;
  titulo: string;
  descripcion: string;
  tiempo: string;
  icono: string;
  color: string;
}

const indicadores: Indicador[] = [
  {
    titulo: 'Clientes',
    valor: '1.248',
    cambio: '+12,5% este mes',
    icono: 'people',
    color: 'blue',
    positivo: true,
  },
  {
    titulo: 'Citas',
    valor: '86',
    cambio: '+8,2% esta semana',
    icono: 'event',
    color: 'purple',
    positivo: true,
  },
  {
    titulo: 'Conversaciones',
    valor: '324',
    cambio: '+18,4% este mes',
    icono: 'chat_bubble_outline',
    color: 'green',
    positivo: true,
  },
  {
    titulo: 'Ingresos',
    valor: '$4,8 M',
    cambio: '+6,7% este mes',
    icono: 'payments',
    color: 'orange',
    positivo: true,
  },
];

const actividad: Actividad[] = [
  {
    dia: 'Lun',
    valor: 48,
    cantidad: 82,
  },
  {
    dia: 'Mar',
    valor: 72,
    cantidad: 124,
  },
  {
    dia: 'Mié',
    valor: 56,
    cantidad: 96,
  },
  {
    dia: 'Jue',
    valor: 86,
    cantidad: 148,
  },
  {
    dia: 'Vie',
    valor: 68,
    cantidad: 116,
  },
  {
    dia: 'Sáb',
    valor: 42,
    cantidad: 72,
  },
  {
    dia: 'Dom',
    valor: 28,
    cantidad: 48,
  },
];

const proximasCitas: Cita[] = [
  {
    id: 1,
    cliente: 'María Rodríguez',
    servicio: 'Consulta inicial',
    hora: '09:00',
  },
  {
    id: 2,
    cliente: 'Carlos Gómez',
    servicio: 'Seguimiento',
    hora: '10:30',
  },
  {
    id: 3,
    cliente: 'Laura Martínez',
    servicio: 'Consulta general',
    hora: '12:00',
  },
  {
    id: 4,
    cliente: 'Andrés López',
    servicio: 'Asesoría',
    hora: '15:30',
  },
];

const actividadesRecientes: ActividadReciente[] = [
  {
    id: 1,
    titulo: 'Nuevo cliente registrado',
    descripcion: 'María Rodríguez fue agregada a clientes.',
    tiempo: 'Hace 5 min',
    icono: 'person_add',
    color: 'primary',
  },
  {
    id: 2,
    titulo: 'Cita confirmada',
    descripcion: 'Carlos Gómez confirmó su cita.',
    tiempo: 'Hace 18 min',
    icono: 'event_available',
    color: 'positive',
  },
  {
    id: 3,
    titulo: 'Conversación atendida por IA',
    descripcion: 'El agente respondió una consulta.',
    tiempo: 'Hace 32 min',
    icono: 'smart_toy',
    color: 'deep-purple',
  },
  {
    id: 4,
    titulo: 'Nuevo pedido',
    descripcion: 'Se registró un nuevo pedido.',
    tiempo: 'Hace 1 h',
    icono: 'shopping_cart',
    color: 'orange',
  },
];

const obtenerIniciales = (nombre: string): string => {
  return nombre
    .split(' ')
    .map((parte) => parte.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const crearCita = (): void => {
  console.log('Crear nueva cita');
};
</script>

<style scoped lang="scss">
.dashboard-page {
  max-width: 1600px;
  margin: 0 auto;
}

.metric-card,
.dashboard-card {
  border-color: #e8ebf0;
  border-radius: 14px;
  background: #ffffff;
}

.metric-card {
  min-height: 142px;
}

.metric-title {
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.metric-value {
  margin-top: 8px;
  color: #172033;
  font-size: 28px;
  font-weight: 750;
  line-height: 1.2;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  color: #16a34a;
  font-size: 12px;
  font-weight: 500;
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 11px;
}

.metric-icon--blue {
  background: #eff6ff;
  color: #2563eb;
}

.metric-icon--purple {
  background: #f5f3ff;
  color: #7c3aed;
}

.metric-icon--green {
  background: #f0fdf4;
  color: #16a34a;
}

.metric-icon--orange {
  background: #fff7ed;
  color: #ea580c;
}

.section-title {
  color: #172033;
  font-size: 16px;
  font-weight: 700;
}

.section-subtitle {
  margin-top: 3px;
  color: #94a3b8;
  font-size: 12px;
}

.activity-chart {
  min-height: 270px;
}

.chart-placeholder {
  display: flex;
  align-items: flex-end;
  height: 220px;
  padding: 15px 10px 0;
}

.chart-grid {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #e8ebf0;
}

.chart-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 10%;
  height: 100%;
}

.chart-bar {
  width: 28px;
  max-height: 180px;
  min-height: 10px;
  border-radius: 7px 7px 0 0;
  background: var(--q-primary);
  opacity: 0.85;
  transition: opacity 0.2s ease;
}

.chart-bar:hover {
  opacity: 1;
}

.chart-label {
  margin-top: 10px;
  color: #94a3b8;
  font-size: 11px;
}

.appointment-item {
  min-height: 68px;
}

.appointment-time {
  color: #172033;
  font-size: 12px;
  font-weight: 700;
}

.recent-item {
  min-height: 70px;
}

.ai-card {
  overflow: hidden;
}

.ai-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 13px;
  background: #eef2ff;
  color: var(--q-primary);
}

.ai-stat {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.ai-stat__label {
  color: #64748b;
  font-size: 12px;
}

.ai-stat__value {
  margin-top: 5px;
  color: #172033;
  font-size: 26px;
  font-weight: 750;
}

.ai-stat__percentage {
  color: #16a34a;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 700px) {
  .dashboard-page {
    padding: 16px !important;
  }

  .text-h4 {
    font-size: 25px;
  }

  .chart-bar {
    width: 20px;
  }
}
</style>
