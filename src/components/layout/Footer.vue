<script setup lang="ts">
const year = new Date().getFullYear()

const links = [
  { label: 'Privacidad', href: '/privacidad' },
  { label: 'Centro de ayuda', href: '/ayuda' },
  { label: 'Términos', href: '/terminos' },
  { label: 'Sustentabilidad', href: '/sustentabilidad' },
  { label: 'Acerca de UFRO', href: 'https://www.ufrontera.cl', external: true },
]
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <!-- Brand -->
      <div class="footer__brand">
        <div class="footer__logo">
          <img src="@/assets/Logo_Ufro.png" alt="logo ufro"/>
        </div>
        <div>
          <p class="footer__brand-name">UFRO Market</p>
          <p class="footer__brand-uni">Universidad De La Frontera</p>
        </div>
      </div>

      <!-- Links -->
      <nav class="footer__nav" aria-label="Pie de página">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="footer__link"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
        >{{ link.label }}</a>
      </nav>

      <!-- Copyright -->
      <p class="footer__copy">© {{ year }} Universidad De La Frontera. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--gray-300);
  color: var(--gray-300);
  padding: var(--space-6) 0;
  margin-top: auto;
}
.footer__inner {
  max-width: var(--content-max-w);
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-8);
}
@media (max-width: 768px) {
  .footer__inner {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--space-5);
  }
  .footer__brand { justify-content: center; }
  .footer__nav { justify-content: center; }
}

/* Brand */
.footer__brand { 
  display: flex; 
  align-items: center; 
  gap: var(--space-3); 
}
.footer__logo {
  width: 50px;
  height: 50px;
  display: flex; 
  align-items: center; 
  justify-content: center;
  color: var(--white); flex-shrink: 0;
}
.footer__logo img{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.footer__brand-name { font-weight: 700; font-size: var(--font-size-sm); color: var(--gray-700); }
.footer__brand-uni { font-size: var(--font-size-xs); color: var(--gray-500); }

/* Nav */
.footer__nav { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: var(--space-1) var(--space-5); }
.footer__link {
  font-size: var(--font-size-xs);
  color: var(--gray-500);
  text-decoration: none;
  transition: color var(--transition-fast);
  white-space: nowrap;
}
.footer__link:hover { color: var(--white); text-decoration: underline; }
.footer__link:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; border-radius: 2px; }

/* Copy */
.footer__copy { font-size: var(--font-size-xs); color: var(--gray-500); text-align: right; white-space: nowrap; }
@media (max-width: 768px) { .footer__copy { text-align: center; } }
</style>