function high(x) {
  return x
    .split(" ")
    .sort()
    .reduce(
      function(acc, word) {
        let sum = 0;
        for (let letter of word) {
          sum += letter.charCodeAt();
        }
        return sum > acc.sum ? { sum, word } : acc;
      },
      { sum: 97, word: "a" }
    ).word;
}

console.log(high("volcano climbing"));
