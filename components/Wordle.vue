<script setup>
import { toast } from "vue3-toastify";
import { useWordle } from "../composables/useWordle.js";
import { onMounted, onBeforeUnmount, watch } from "vue";
import GridContent from "./Board/GridContent";
const props = defineProps({
  solution: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
});
const { data: session } = useAuth();
const TOTAL_SCORE = 6;
const currentScore = ref(6);
const totalStat = reactive({
  scores: session?.user?.scores || 0,
  winRate: session?.user?.winRate || 0,
  gamesPlayed: session?.user?.gamesPlayed || 0,
});
const wordStore = useWordStore();
const solution = ref(props.solution);
const startTime = ref(props.startTime);
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

watch([isCorrect, attempt], async ([newIsCorrect, newAttempt]) => {
  if (newIsCorrect || newAttempt > 5) {
    if (newIsCorrect && session?.value?.user) {
      currentScore.value =
        TOTAL_SCORE -
        (guesses?.value?.filter((value) => value !== undefined).length - 1) -
        hint.value.filter((value) => value !== "_").length;
      const data = await $fetch("/api/game", {
        method: "PUT",
        body: {
          gamesWon: true,
          scores: currentScore.value <= 0 ? 1 : currentScore.value,
        },
      });
      if (data?.error) {
        toast.error(data.message);
        return;
      }
      totalStat.gamesPlayed = data.user.gamesPlayed;
      totalStat.scores = data.user.scores;
      totalStat.winRate = (data.user.gamesWon / data.user.gamesPlayed) * 100;
      toast.success(data.message);
    } else if (newAttempt > 5 && session?.value?.user && !newIsCorrect) {
      const data = await $fetch("/api/game", {
        method: "PUT",
        body: {
          gamesLost: true,
        },
      });
      if (data?.error) {
        toast.error(data.message);
        return;
      }
      totalStat.gamesPlayed = data.user.gamesPlayed;
      totalStat.scores = data.user.scores;
      totalStat.winRate = (data.user.gamesWon / data.user.gamesPlayed) * 100;
      toast.success(data.message);
    }
    setTimeout(() => {
      document.getElementById("statModal").showModal();
    }, 1000);
    // window.removeEventListener("keyup", handleKeyup);
  }
});

function randomWord() {
  return Math.floor(Math.random() * wordStore.solution.length);
}

function hintSolution() {
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

async function resetAll() {
  if (session?.value?.user) {
    const data = await $fetch("/api/game", {
      method: "PUT",
      body: {
        gamesPlayed: true,
      },
    });
    if (data?.error) {
      toast.error(data.message);
      return;
    }
    totalStat.gamesPlayed = data.user.gamesPlayed;
    totalStat.scores = data.user.scores;
    totalStat.winRate = (data.user.gamesWon / data.user.gamesPlayed) * 100;
    toast.success(data.message);
  }
  resetGame();
  hint.value = new Array(5).fill("_");
  hintCount.value = 3;
  startTime.value = new Date();
}
</script>
<template>
  <div>
    <dialog id="statModal" class="modal">
      <div class="modal-box">
        <h3 v-if="isCorrect" class="font-bold text-lg">Congratulation ! 🎉</h3>
        <h3 v-if="!isCorrect" class="font-bold text-lg">Oops, try again 👻</h3>
        <div class="py-4 pt-10" v-if="isCorrect">
          <div class="flex flex-col gap-y-3 text-lg">
            <table
              className="table-auto text-small border-separate border-spacing-y-3 border-spacing-x-3"
            >
              <tbody>
                <tr>
                  <td>Time used</td>
                  <td>
                    {{ ((new Date() - startTime) / 60000).toFixed(2) }}
                    minutes
                  </td>
                </tr>
                <tr>
                  <td>Score</td>
                  <td>+{{ currentScore <= 0 ? 1 : currentScore }} points</td>
                </tr>
                <tr v-if="session?.user">
                  <td>Total Score</td>
                  <td>{{ totalStat.scores }} points</td>
                </tr>
                <tr v-if="session?.user">
                  <td>Win Rate</td>
                  <td>
                    {{ totalStat.winRate.toFixed(2) }}
                    %
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
