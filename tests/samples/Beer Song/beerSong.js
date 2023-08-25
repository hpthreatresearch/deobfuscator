function beerCount(n) {
  return n > 0 ? n : "no more";
}

function beerSong() {
  let n = 99;
  let count = beerCount(n);
  while (n > 0) {
    console.log(
      `${count} bottles of beer on the wall. ${count} bottles of beer.`
    );
    count = beerCount(--n);
    console.log(
      `Take one down, pass it around, ${count} bottles of beer on the wall.`
    );
  }
  console.log(
    `No more bottles of beer on the wall, no more bottles of beer.\nGo to the store and buy some more, 99 bottles of beer on the wall...`
  );
}

beerSong();
