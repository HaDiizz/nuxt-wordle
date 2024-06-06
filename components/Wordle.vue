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
const hint = ref(new Array(5).fill("_"));
const hintCount = ref(3);
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
    }, 1000);
    // window.removeEventListener("keyup", handleKeyup);
  }
});

function randomWord() {
  return Math.floor(Math.random() * wordStore.solution.length);
}

function hintSolution() {
  console.log("แหน่ะ! แอบดูเฉลยเหรอจ๊ะ 👻", wordStore.solution);
  if (hintCount.value <= 0) return;
  if (!hint.value.some((char) => char === "_")) return;
  let index = randomWord();
  while (hint.value[index] !== "_") {
    index = randomWord();
    if (hint.value[index] === "_") {
      break;
    }
  }
  hint.value[index] = wordStore.solution[index];
  hintCount.value--;
}

function resetAll() {
  resetGame();
  hint.value = new Array(5).fill("_");
  hintCount.value = 3;
}
</script>
<template>
  <div>
    <dialog id="my_modal_1" class="modal">
      <div class="modal-box">
        <h3 v-if="isCorrect" class="font-bold text-lg">Congratulation ! 🎉</h3>
        <h3 v-if="!isCorrect" class="font-bold text-lg">Oops, try again 👻</h3>
        <div class="py-4 pt-10" v-if="isCorrect">
          Do you want to play more ? Press
          <span class="text-indigo-500 font-bold">Play again</span>
        </div>
        <div class="py-5 pt-10" v-if="!isCorrect">
          The solution is
          <span class="text-indigo-500 font-bold">{{
            wordStore.solution.toUpperCase()
          }}</span>
        </div>
        <div class="modal-action">
          <form method="dialog" class="flex gap-x-4">
            <button class="btn">Close</button>
            <button
              class="btn bg-indigo-500 hover:bg-indigo-600"
              @click="resetAll"
            >
              Play again
            </button>
          </form>
        </div>
      </div>
    </dialog>
    <div
      class="flex flex-col md:flex-row items-center justify-between gap-y-5 pb-5"
    >
      <span class="flex gap-x-2"
        >Solution:
        <p class="tracking-widest">{{ hint.join("") }}</p></span
      >
      <button :disabled="hintCount <= 0" class="btn" @click="hintSolution">
        Hint ({{ hintCount }})
      </button>
      <button
        class="btn btn-sm bg-indigo-500 text-white hover:text-slate-100 flex justify-center items-center"
        :class="{
          'animate-bounce hover:animate-none cursor-pointer':
            isCorrect || attempt > 5,
          'animate-none cursor-pointer': !(isCorrect || attempt > 5),
        }"
        @click="resetAll"
      >
        Reset Game
        <svg
          class="w-[18px] h-[18px] text-white"
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
      </button>
    </div>

    <GridContent
      :guesses="guesses"
      :currentGuess="currentGuess"
      :attempt="attempt"
    />
    <div class="pt-5 text-[13px] md:text-lg">
      <KeyBoard :usedKeys="usedKeys" :handleKeyup="handleKeyup" />
    </div>
  </div>
</template>
