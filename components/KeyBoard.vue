<script setup>
const props = defineProps({
  usedKeys: {
    type: Object,
  },
  handleKeyup: {
    type: Function,
  },
});
const wordStore = useWordStore();
const reactiveProps = ref({ ...props });
const keyboardLayout = ref([
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["Backspace", "z", "x", "c", "v", "b", "n", "m", "Enter"],
]);
watch(
  props,
  (newProps) => {
    reactiveProps.value = { ...newProps };
  },
  { deep: true }
);
</script>

<template>
  <div v-for="row in keyboardLayout" :key="row">
    <div class="flex justify-center gap-1 my-1 w-full keypad">
      <kbd
        @click="handleKeyup({ key })"
        v-for="key in row"
        :key="key"
        :class="{
          'kbd cursor-pointer': true,
          [reactiveProps.usedKeys[key]]: true,
        }"
        >{{ key }}</kbd
      >
    </div>
  </div>
</template>
