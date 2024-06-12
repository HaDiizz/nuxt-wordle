<script setup>
definePageMeta({
  middleware: ["auth"],
});

useSeoMeta({
  titleTemplate: "%s - Sign in",
  ogTitle: "%s - Sign in",
});
</script>
<template>
  <div>
    <div class="flex justify-center items-center pt-8 md:pt-[3rem]">
      <SignInForm />
    </div>
  </div>
</template>
