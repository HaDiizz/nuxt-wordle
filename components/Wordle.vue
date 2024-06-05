<script setup>
import { useWordle } from "../composables/useWordle.js";
import { onMounted, onBeforeUnmount, watch } from "vue";
import GridContent from "./Board/GridContent";
const props = defineProps({
  solution: {
    type: String,
    required: true,
  },
});
const wordStore = useWordStore();
const solution = ref(props.solution);
const {
  attempt,
  currentGuess,
  guesses,
  isCorrect,
  usedKeys,
  handleKeyup,
  resetGame,
} = useWordle(solution.value);

onMounted(() => {
  window.addEventListener("keyup", handleKeyup);

  onBeforeUnmount(() => {
    window.removeEventListener("keyup", handleKeyup);
  });
});

watch([isCorrect, attempt], ([newIsCorrect, newAttempt]) => {
  if (newIsCorrect || newAttempt > 5) {
    setTimeout(() => {
      document.getElementById("my_modal_1").showModal();
    }, 2000);
    // window.removeEventListener("keyup", handleKeyup);
  }
});
</script>
<template>
  <div>
    <dialog id="my_modal_1" class="modal">
      <div class="modal-box">
        <p class="py-4" v-if="isCorrect">Congratulation ! 🎉</p>
        <p class="py-4" v-if="!isCorrect">Oops, try again 👻</p>
        <div class="modal-action">
          <form method="dialog" class="flex gap-x-4">
            <button class="btn">Close</button>
            <button
              class="btn bg-indigo-500 hover:bg-indigo-600"
              @click="resetGame()"
            >
              Reset
            </button>
          </form>
        </div>
      </div>
    </dialog>
    <div class="flex flex-col gap-y-5 pb-5">
      <span>Solution: {{ wordStore.solution }}</span>
    </div>

    <GridContent
      :guesses="guesses"
      :currentGuess="currentGuess"
      :attempt="attempt"
    />
    <div class="pt-5">
      <KeyBoard :usedKeys="usedKeys" :handleKeyup="handleKeyup" />
    </div>

    <div
      class="absolute bottom-5 right-5 bg-indigo-500 rounded-full w-10 h-10 flex justify-center items-center"
      :class="{
        'animate-bounce hover:animate-none cursor-pointer':
          isCorrect || attempt > 5,
        'animate-none cursor-pointer': !(isCorrect || attempt > 5),
      }"
      @click="resetGame"
    >
      <svg
        class="w-[26px] h-[26px] text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
        />
      </svg>
    </div>
  </div>
</template>
