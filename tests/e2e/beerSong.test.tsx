// © Copyright 2023 HP Development Company, L.P.
import { assertDeobfuscation } from "./assertDeobfuscation";

test(
  "obfuscator.io recipe",
  async () => {
    const deobfuscated = await assertDeobfuscation(
      "/Beer Song/BeerSong_obfuscator.io.js",
      "obfuscator.io"
    );

    expect(
      deobfuscated.indexOf(
        "No more bottles of beer on the wall, no more bottles of beer.\\nGo to the store and buy some more, 99 bottles of beer on the wall..."
      ) >= 0
    ).toBe(true);
  },
  5 * 60000
);
