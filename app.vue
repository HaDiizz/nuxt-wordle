<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
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
  });
});
</script>
