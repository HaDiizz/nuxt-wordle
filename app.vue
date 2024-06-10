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
