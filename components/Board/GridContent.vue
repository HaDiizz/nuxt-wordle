<script setup>
const props = defineProps({
  guesses: {
    type: Array,
    required: true,
  },
  currentGuess: {
    type: String,
    required: true,
  },
  attempt: {
    type: Number,
    required: true,
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
    <div v-for="(guess, index) in reactiveProps.guesses" :key="index">
      <Row
        v-if="reactiveProps.attempt === index"
        :currentGuess="reactiveProps.currentGuess"
      />
      <Row v-else :guess="guess" />
    </div>
  </div>
</template>
