<script setup>
import { toast } from "vue3-toastify";

const { data: session } = useAuth();
const isGameStarted = ref(false);
const wordStore = useWordStore();
const startTime = ref(new Date());

onMounted(() => {
  wordStore.getWords();
});

function handleOpenConfirm() {
  document.getElementById("confirmModal").showModal();
}

async function handleStartGame() {
  try {
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
      toast.success(data.message);
    }
    startTime.value = new Date();
    isGameStarted.value = true;
  } catch (err) {
    toast.error("Something went wrong");
  }
}
</script>

<template>
  <div>
    <dialog id="confirmModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirmation</h3>
        <div class="py-4 pt-10 flex flex-col gap-y-5" v-if="session?.user">
          <div>Do you want to start the game ?</div>
          <div class="text-sm text-neutral-500">
            When you press start, the game will immediately begin recording the
            number of times you play. Currently, you have played
            <span class="text-indigo-500 font-semibold"
              >{{ session.user.gamesPlayed }} times</span
            >. If you press start again, it will count as the
            <span class="text-indigo-500 font-semibold">
              {{ session.user.gamesPlayed + 1 }}th</span
            >
            time.
          </div>
        </div>
        <div class="py-4 pt-10 flex flex-col gap-y-5" v-else>
          <div>Do you want to start the game ?</div>
          <div class="text-sm text-neutral-500">
            Please log in to access your statistics and gameplay details.
            <NuxtLink to="/sign-in" class="text-indigo-500 font-semibold"
              >Login</NuxtLink
            >
          </div>
        </div>

        <div class="modal-action">
          <form method="dialog" class="flex gap-x-4">
            <button class="btn">Close</button>
            <button
              class="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              @click="handleStartGame"
            >
              Start the game
            </button>
          </form>
        </div>
      </div>
    </dialog>
    <div class="flex flex-col justify-center items-center gap-y-10">
      <div v-if="isGameStarted">
        <Wordle
          v-if="wordStore.solution"
          :solution="wordStore.solution"
          :startTime="startTime"
        />
      </div>
      <div v-else class="pt-[15rem]">
        <button class="start-btn bg-ground-100" @click="handleOpenConfirm">
          <svg
            viewBox="0 0 24 24"
            class="arr-2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            ></path>
          </svg>
          <span class="text">Let's start the game</span>
          <svg
            viewBox="0 0 24 24"
            class="arr-1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
