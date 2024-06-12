<template>
  <div>
    <NuxtLayout>
      <div class="px-5 md:px-[8rem] py-5">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Nuxt Wordles",
  ogTitle: "Nuxt Wordles",
  description:
    "Nuxt Wordle is the ultimate word puzzle game where players test their vocabulary skills to guess the hidden word in six tries. With features like secure login, competitive top rank leaderboard, and daily word challenges, Nuxt Wordle offers a fun and engaging experience for all word game enthusiasts.",
  ogDescription:
    "Nuxt Wordle is the ultimate word puzzle game where players test their vocabulary skills to guess the hidden word in six tries. With features like secure login, competitive top rank leaderboard, and daily word challenges, Nuxt Wordle offers a fun and engaging experience for all word game enthusiasts.",
  ogImage: "/logo.png",
  twitterCard: "/logo.png",
  keywords:
    "Wordle, word game, puzzle, vocabulary, login, top rank, leaderboard, daily challenge, word puzzle, competitive gaming, word guessing, social sharing",
});
const colorMode = useColorMode();

onMounted(() => {
  watchEffect(() => {
    document
      .querySelector("html")
      .setAttribute(
        "data-theme",
        colorMode.value === "light" ? "winter" : "night"
      );
    document
      .querySelector("html")
      .setAttribute(
        "class",
        colorMode.value === "light" ? "light light-mode" : "dark dark-mode"
      );
  });
});
</script>
