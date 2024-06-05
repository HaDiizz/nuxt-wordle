<script setup>
const props = defineProps({
  guess: {
    type: Array,
  },
  currentGuess: {
    type: String,
  },
});
const reactiveProps = ref({ ...props });
watch(
  props,
  (newProps) => {
    reactiveProps.value = { ...newProps };
  },
  { deep: true }
);
</script>
<template>
  <div>
    <div v-if="reactiveProps.guess" class="row past">
      <div
        v-for="(el, index) in reactiveProps.guess"
        :key="index"
        :class="{ 'text-white': true, [el?.status]: true }"
      >
        {{ el?.key }}
      </div>
    </div>
    <div v-else-if="reactiveProps.currentGuess" class="row current">
      <div
        v-for="(letter, index) in reactiveProps.currentGuess.split('')"
        :key="index"
        className="filled"
      >
        {{ letter }}
      </div>
      <div
        v-for="index in 5 - reactiveProps.currentGuess.split('').length"
        :key="index"
      ></div>
    </div>
    <div v-else className="row">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
