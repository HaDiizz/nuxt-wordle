import { defineStore } from "pinia";

export const useWordStore = defineStore("word", {
  state: () => ({
    wordSet: new Set(),
    solution: "",
  }),
  actions: {
    async getWords() {
      try {
        const response = await generateWordSet();
        this.solution = response.word;
        this.wordSet = response.wordSet;
      } catch (err) {
        console.log(err);
      }
    },
  },
});
