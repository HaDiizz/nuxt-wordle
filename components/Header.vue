<script setup>
const { data, signOut } = useAuth();
const colorMode = useColorMode();
const changeColor = () =>
  (colorMode.preference = colorMode.value === "light" ? "dark" : "light");

function handleSignOut() {
  signOut();
}

function handleOpenHowToPlay() {
  document.getElementById("how-to-play").showModal();
}
</script>

<template>
  <div>
    <dialog id="how-to-play" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-center">How to Play?</h3>
        <div class="flex flex-col gap-y-5 pt-5">
          <div>
            <span class="text-md font-bold">Basic Rules</span>
            <ul class="text-sm text-neutral-500 gap-y-2 list-disc p-2">
              <li class="py-1">
                Start the Game: Open Wordle in your web browser. Each day there
                is a new word to guess.
              </li>
              <li class="py-1">
                Guess the Word: Enter a five-letter word in the provided input
                box. Click "Enter" to submit your guess.
              </li>
            </ul>
          </div>
          <div>
            <span class="text-md font-bold">Color Feedback</span>
            <ul class="text-sm text-neutral-500 gap-y-2 list-disc p-2">
              <li class="py-1">
                <span class="text-green-500">Green</span>: The letter is in the
                word and in the correct position.
              </li>
              <li class="py-1">
                <span class="text-yellow-500">Yellow</span>: The letter is in
                the word but in the wrong position.
              </li>
              <li class="py-1">
                <span class="text-neutral-600">Gray</span>: The letter is not in
                the word at all.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <div class="navbar bg-base-100">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 bg-slate-50 dark:bg-slate-950"
          >
            <li><NuxtLink to="/top-rank">Top Ranking</NuxtLink></li>
            <li>
              <button @click="handleOpenHowToPlay">How to play ?</button>
            </li>
          </ul>
        </div>
      </div>
      <div class="navbar-center">
        <NuxtLink to="/" class="btn btn-ghost text-xl">WORDLES</NuxtLink>
      </div>
      <div class="navbar-end gap-x-5">
        <button
          aria-label="Color Mode"
          class="btn btn-ghost btn-circle"
          @click="changeColor"
        >
          <ColorScheme placeholder="...">
            <svg
              v-if="colorMode.value === 'dark'"
              class="w-6 h-6 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z"
                clip-rule="evenodd"
              />
            </svg>
          </ColorScheme>
        </button>
        <div v-if="data" class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost btn-circle avatar"
          >
            <div class="w-10 rounded-full">
              <img
                alt="User Profile"
                :src="`https://api.dicebear.com/8.x/thumbs/svg?scale=85&shapeColor=5D00FF&backgroundColor=D7C0FF&seed=${data.user.username}`"
              />
            </div>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 bg-slate-50 dark:bg-slate-950"
          >
            <div class="px-3 py-1 flex flex-col rounded-lg">
              <span class="text-sm font-bold uppercase">
                {{ data.user.username }}</span
              >
              <span class="text-xs text-neutral-500">
                {{ data.user.email }}</span
              >
            </div>
            <li class="py-1">
              <button
                @click="handleSignOut"
                class="text-red-500 hover:text-white hover:bg-red-500"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
        <NuxtLink
          v-else
          to="/sign-in"
          class="btn text-white bg-indigo-500 hover:bg-indigo-600"
        >
          Sign in
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
