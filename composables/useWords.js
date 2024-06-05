import words from "../data/words.txt";

export const generateWordSet = async () => {
  let wordSet;
  let word;
  await fetch(words)
    .then((response) => response.text())
    .then((result) => {
      const wordArr = result.split("\n").map((word) => word.trim());
      word = wordArr[Math.floor(Math.random() * wordArr.length)];
      wordSet = new Set(wordArr);
    });
  return { wordSet, word };
};
