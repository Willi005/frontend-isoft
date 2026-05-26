<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
  fullWidth: false,
})
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="['btn', `btn--${props.variant}`, `btn--${props.size}`, { 'btn--full': props.fullWidth, 'btn--disabled': props.disabled }]"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast),
              border-color var(--transition-fast), box-shadow var(--transition-fast),
              opacity var(--transition-fast);
  white-space: nowrap;
  user-select: none;
  line-height: 1;
}
.btn:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

/* Sizes */
.btn--sm  { padding: var(--space-2) var(--space-3); font-size: var(--font-size-sm); }
.btn--md  { padding: var(--space-3) var(--space-5); font-size: var(--font-size-md); }
.btn--lg  { padding: var(--space-4) var(--space-8); font-size: var(--font-size-lg); }

/* Full width */
.btn--full { width: 100%; }

/* Primary */
.btn--primary { background: var(--primary); color: var(--white); border-color: var(--primary); }
.btn--primary:hover:not(:disabled) { background: var(--primary-dark); border-color: var(--primary-dark); }

/* Secondary */
.btn--secondary { background: var(--accent); color: var(--white); border-color: var(--accent); }
.btn--secondary:hover:not(:disabled) { background: #004d32; border-color: #004d32; }

/* Outline */
.btn--outline { background: transparent; color: var(--primary); border-color: var(--primary); }
.btn--outline:hover:not(:disabled) { background: var(--primary-light); }

/* Success */
.btn--success { background: var(--success); color: var(--white); border-color: var(--success); }
.btn--success:hover:not(:disabled) { background: #059669; border-color: #059669; }

/* Danger */
.btn--danger { background: var(--danger); color: var(--white); border-color: var(--danger); }
.btn--danger:hover:not(:disabled) { background: #dc2626; border-color: #dc2626; }

/* Disabled */
.btn--disabled, .btn:disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
</style>