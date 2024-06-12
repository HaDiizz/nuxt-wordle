<script setup>
import { LoginFormSchema } from "~/schemas/LoginForm";
import { useField, useForm } from "vee-validate";
import { toast } from "vue3-toastify";

const isLoading = ref(false);
const { handleSubmit, errors } = useForm({
  validationSchema: LoginFormSchema,
});
const { value: username } = useField("username");
const { value: password } = useField("password");

const { signIn } = useAuth();

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    const response = await signIn("credentials", {
      callbackUrl: "/",
      redirect: false,
      username: values.username,
      password: values.password,
    });

    if (response.error) {
      toast.error("Username or Password incorrect");
      return;
    }
    if (!response?.error) {
      toast.success("Logged in successful");
    }
    return useRouter().push({
      path: "/",
    });
  } catch (err) {
    toast.error("Something went wrong");
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="card w-full md:w-3/4 p-8 bg-ground-100">
    <h1 class="text-left py-8 font-extrabold text-lg md:text-xl">
      Sign in to WORDLES
    </h1>
    <form @submit="onSubmit" class="flex flex-col gap-y-7 pt-8 pb-8">
      <label
        :class="{
          'input input-bordered flex items-center gap-2': true,
          'input-error': errors.username,
        }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-4 h-4 opacity-70"
        >
          <path
            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
          />
        </svg>
        <input
          type="text"
          name="username"
          id="username"
          v-model="username"
          class="grow"
          placeholder="Username"
        />
        <div class="label flex-col">
          <span class="label-text-alt text-red-500">{{ errors.username }}</span>
        </div>
      </label>
      <label
        :class="{
          'input input-bordered flex items-center gap-2': true,
          'input-error': errors.password,
        }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-4 h-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          autocomplete
          type="password"
          name="password"
          id="password"
          v-model="password"
          class="grow"
          placeholder="Password"
        />
        <div class="label flex-col">
          <span class="label-text-alt text-red-500">{{ errors.password }}</span>
        </div>
      </label>
      <div class="flex justify-between items-center">
        <button
          :disabled="isLoading"
          class="btn bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          Sign In <span class="loading loading-spinner" v-if="isLoading"></span>
        </button>
        <span
          >Don't have an account yet ?
          <NuxtLink class="text-indigo-500" to="/sign-up"
            >Sign Up</NuxtLink
          ></span
        >
      </div>
    </form>
  </div>
</template>
