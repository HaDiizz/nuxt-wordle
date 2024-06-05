<script setup>
const wordStore = useWordStore();
onMounted(() => {
  wordStore.getWords();
});
</script>

<template>
  <div>
    <div class="flex flex-col justify-center items-center gap-y-10">
      <Wordle v-if="wordStore.solution" :solution="wordStore.solution" />
    </div>
  </div>
</template>
