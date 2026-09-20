<template>
  <section class="login-visual">
    <div class="login-visual__glow login-visual__glow--one"></div>
    <div class="login-visual__glow login-visual__glow--two"></div>

    <div class="login-visual__brand">
      <div class="login-visual__brand-mark">
        <q-img
          v-if="logoPlataforma"
          :src="logoPlataforma"
          :alt="nombrePlataforma"
          fit="contain"
          width="24px"
          height="24px"
        />

        <q-icon v-else name="auto_awesome" size="24px" />
      </div>

      <span>{{ nombrePlataforma || 'NEXORA' }}</span>
    </div>

    <div class="login-visual__content">
      <div class="login-visual__eyebrow">AUTOMATIZACIÓN INTELIGENTE</div>

      <h2>
        Tu negocio.
        <br />
        <span>Más inteligente.</span>
      </h2>

      <p>
        {{
          descripcionPlataforma ||
          'Automatiza citas, clientes, conversaciones y tareas repetitivas desde un solo lugar.'
        }}
      </p>
    </div>

    <div class="automation-scene">
      <div class="automation-scene__orbit automation-scene__orbit--one"></div>
      <div class="automation-scene__orbit automation-scene__orbit--two"></div>

      <div class="automation-card automation-card--ai">
        <q-icon name="smart_toy" size="28px" />

        <span>IA</span>
      </div>

      <div class="automation-card automation-card--calendar">
        <q-icon name="event_available" size="25px" />

        <span>Citas</span>
      </div>

      <div class="automation-card automation-card--whatsapp">
        <q-icon name="chat" size="25px" />

        <span>WhatsApp</span>
      </div>

      <div class="automation-card automation-card--customer">
        <q-icon name="person" size="24px" />

        <span>Cliente</span>
      </div>

      <div class="automation-core">
        <div class="automation-core__inner">
          <q-icon name="auto_awesome" size="34px" />
        </div>
      </div>

      <div class="automation-line automation-line--one"></div>
      <div class="automation-line automation-line--two"></div>
      <div class="automation-line automation-line--three"></div>
      <div class="automation-line automation-line--four"></div>
    </div>

    <div class="login-visual__bottom">
      <div>
        <strong>Automatiza</strong>
        <span>lo repetitivo</span>
      </div>

      <q-icon name="arrow_forward" size="18px" />

      <div>
        <strong>Enfócate</strong>
        <span>en crecer</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePlatform } from '../../platform';

const { nombrePlataforma, logoPlataforma, descripcionPlataforma } = usePlatform();
</script>

<style scoped>
.login-visual {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 34px 42px;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(circle at 70% 35%, rgba(25, 118, 210, 0.2), transparent 32%),
    radial-gradient(circle at 20% 80%, rgba(124, 58, 237, 0.14), transparent 30%), #0b1220;
  color: white;
}

.login-visual__glow {
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.3;
  pointer-events: none;
}

.login-visual__glow--one {
  top: 18%;
  right: 5%;
  background: #1976d2;
}

.login-visual__glow--two {
  bottom: 5%;
  left: 8%;
  background: #7c3aed;
}

.login-visual__brand {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.login-visual__brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.login-visual__content {
  position: relative;
  z-index: 2;
  max-width: 500px;
  margin-top: 12vh;
}

.login-visual__eyebrow {
  margin-bottom: 14px;
  color: #7db7ff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.login-visual__content h2 {
  margin: 0;
  font-size: clamp(38px, 4vw, 62px);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.04em;
}

.login-visual__content h2 span {
  color: #8cc4ff;
}

.login-visual__content p {
  max-width: 440px;
  margin: 22px 0 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 15px;
  line-height: 1.7;
}

.automation-scene {
  position: absolute;
  top: 43%;
  right: 5%;
  width: 430px;
  height: 300px;
  transform: translateY(-50%);
}

.automation-scene__orbit {
  position: absolute;
  inset: 30px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.automation-scene__orbit--two {
  inset: 70px 5px;
  transform: rotate(-22deg);
}

.automation-core {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 5;
  width: 104px;
  height: 104px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04));
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
  animation: coreFloat 5s ease-in-out infinite;
}

.automation-core__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #8cc4ff;
}

.automation-card {
  position: absolute;
  z-index: 6;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(17, 28, 48, 0.72);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(12px);
  color: rgba(255, 255, 255, 0.88);
  font-size: 12px;
  font-weight: 700;
  animation: cardFloat 5s ease-in-out infinite;
}

.automation-card .q-icon {
  color: #8cc4ff;
}

.automation-card--ai {
  top: 5px;
  left: 43%;
  animation-delay: -1s;
}

.automation-card--calendar {
  top: 36%;
  left: 2%;
  animation-delay: -2s;
}

.automation-card--whatsapp {
  right: 0;
  bottom: 25%;
  animation-delay: -3s;
}

.automation-card--customer {
  bottom: 3px;
  left: 38%;
  animation-delay: -4s;
}

.automation-line {
  position: absolute;
  z-index: 1;
  height: 1px;
  transform-origin: left center;
  background: linear-gradient(90deg, transparent, rgba(125, 183, 255, 0.55), transparent);
}

.automation-line--one {
  top: 31%;
  left: 47%;
  width: 130px;
  transform: rotate(105deg);
}

.automation-line--two {
  top: 52%;
  left: 27%;
  width: 100px;
  transform: rotate(-5deg);
}

.automation-line--three {
  top: 53%;
  left: 55%;
  width: 130px;
  transform: rotate(-15deg);
}

.automation-line--four {
  top: 67%;
  left: 47%;
  width: 100px;
  transform: rotate(80deg);
}

.login-visual__bottom {
  position: absolute;
  right: 42px;
  bottom: 34px;
  left: 42px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 14px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
}

.login-visual__bottom div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.login-visual__bottom strong {
  color: rgba(255, 255, 255, 0.82);
}

@keyframes coreFloat {
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0);
  }

  50% {
    transform: translate(-50%, -50%) translateY(-10px);
  }
}

@keyframes cardFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@media (max-width: 1100px) {
  .automation-scene {
    right: -70px;
    transform: translateY(-50%) scale(0.85);
  }
}

@media (max-width: 900px) {
  .login-visual {
    display: none;
  }
}
</style>
