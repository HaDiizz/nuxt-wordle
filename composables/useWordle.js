import { ref, computed } from "vue";
import { useWordStore } from "../stores/wordle";
import { toast } from "vue3-toastify";

export const useWordle = (solution) => {
  const wordStore = useWordStore();
  const currentSolution = ref(solution);
  const attempt = ref(0);
  const currentGuess = ref("");
  const guesses = ref([...Array(6)]);
  const previous = ref([]);
  const isCorrect = ref(false);
  const usedKeys = ref({});

  const formatGuess = () => {
    let solutionArray = [...currentSolution.value];
    let formattedGuess = [...currentGuess.value].map((l) => {
      return { key: l, status: "incorrect" };
    });

    formattedGuess.forEach((l, i) => {
      if (currentSolution.value[i] === l.key) {
        formattedGuess[i].status = "correct";
        solutionArray[i] = null;
      }
    });

    formattedGuess.forEach((l, i) => {
      if (solutionArray.includes(l.key) && l.status !== "correct") {
        formattedGuess[i].status = "almost";
        solutionArray[solutionArray.indexOf(l.key)] = null;
      }
    });
    return formattedGuess;
  };

  const addNewGuess = (formattedGuess) => {
    if (currentGuess.value === currentSolution.value) {
      isCorrect.value = true;
    }

    guesses.value = [...guesses.value];
    guesses.value[attempt.value] = formattedGuess;

    previous.value = [...previous.value, currentGuess.value];

    attempt.value += 1;

    formattedGuess.forEach((l) => {
      const currentStatus = usedKeys.value[l.key];

      if (l.status === "correct") {
        usedKeys.value[l.key] = "correct";
        return;
      }
      if (l.status === "almost" && currentStatus !== "correct") {
        usedKeys.value[l.key] = "almost";
        return;
      }
      if (
        l.status === "incorrect" &&
        currentStatus !== ("correct" || "almost")
      ) {
        usedKeys.value[l.key] = "incorrect";
        return;
      }
    });

    currentGuess.value = "";
  };

  const handleKeyup = ({ key }) => {
    if (isCorrect.value) {
      return;
    }
    if (key === "Enter") {
      if (attempt.value > 5) {
        toast.error("You have been used all your guess.");
        return;
      }
      if (previous.value.includes(currentGuess.value)) {
        toast.error("You already have tried this word.");
        return;
      }
      if (currentGuess.value.length !== 5) {
        toast.error("Word must be 5 characters.");
        return;
      }
      if (!wordStore.wordSet.has(currentGuess.value.toLowerCase())) {
        toast.error(
          `"${currentGuess?.value?.toUpperCase()}" not found in word list.`
        );
        return;
      }
      const formatted = formatGuess();
      addNewGuess(formatted);
    }
    if (key === "Backspace") {
      currentGuess.value = currentGuess.value.slice(0, -1);
      return;
    }
    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.value.length < 5) {
        currentGuess.value += key;
      }
    }
  };

  const resetGame = () => {
    attempt.value = 0;
    currentGuess.value = "";
    guesses.value = [...Array(6)];
    previous.value = [];
    isCorrect.value = false;
    usedKeys.value = {};
    wordStore.getWords().then((_) => {
      currentSolution.value = wordStore.solution;
    });
  };

  return {
    attempt: computed(() => attempt.value),
    currentGuess: computed(() => currentGuess.value),
    guesses: computed(() => guesses.value),
    isCorrect: computed(() => isCorrect.value),
    usedKeys: computed(() => usedKeys.value),
    handleKeyup,
    resetGame,
  };
};
