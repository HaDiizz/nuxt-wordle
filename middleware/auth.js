import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, from) => {
  const { status } = useAuth();

  if (status.value === "authenticated") {
    return navigateTo({
      name: "index",
    });
  }
});
