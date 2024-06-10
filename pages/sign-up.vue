<script setup>
definePageMeta({
  middleware: ["auth"],
});
</script>
<template>
  <div>
    <div class="flex justify-center items-center pt-8 md:pt-[3rem]">
      <SignUpForm />
    </div>
  </div>
</template>
