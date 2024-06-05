<template>
  <div>
    <NuxtLayout>
      <div class="px-[8rem] py-8">
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
  });
});
</script>
