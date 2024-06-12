<script setup>
definePageMeta({
  middleware: ["auth"],
});

useSeoMeta({
  titleTemplate: "%s - Sign up",
  ogTitle: "%s - Sign up",
});
</script>
<template>
  <div>
    <div class="flex justify-center items-center pt-8 md:pt-[3rem]">
      <SignUpForm />
    </div>
  </div>
</template>
