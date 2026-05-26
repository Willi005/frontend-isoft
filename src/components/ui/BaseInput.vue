<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'number' | 'password' | 'email' | 'search'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  id?: string
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
})
const emit = defineEmits<{ (e: 'update:modelValue', value: string | number): void }>()
const inputId = props.id ?? `input-${Math.random().toString(36).slice(2, 7)}`
</script>

<template>
  <div class="field" :class="{ 'field--error': !!error, 'field--disabled': disabled }">
    <label v-if="label" :for="inputId" class="field__label">{{ label }}</label>
    <div class="field__wrapper">
      <slot name="prefix" />
      <input
        :id="inputId"
        class="field__input"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <slot name="suffix" />
    </div>
    <p v-if="error" class="field__error">{{ error }}</p>
    <p v-else-if="hint" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: var(--space-1); width: 100%; }
.field__label { font-size: var(--font-size-sm); font-weight: 500; color: var(--gray-700); }
.field__wrapper {
  display: flex;
  align-items: center;
  background: var(--white);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  overflow: hidden;
}
.field__wrapper:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(26, 77, 143, 0.15);
}
.field--error .field__wrapper { border-color: var(--danger); }
.field--error .field__wrapper:focus-within { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15); }
.field--disabled .field__wrapper { background: var(--gray-100); opacity: 0.6; cursor: not-allowed; }
.field__input {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  border: none;
  background: transparent;
  color: var(--black);
  font-size: var(--font-size-md);
  outline: none;
  min-width: 0;
}
.field__input::placeholder { color: var(--gray-400); }
.field__input:disabled { cursor: not-allowed; }
.field__error { font-size: var(--font-size-xs); color: var(--danger); }
.field__hint  { font-size: var(--font-size-xs); color: var(--gray-500); }
</style>