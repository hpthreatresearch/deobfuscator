// © Copyright 2023 HP Development Company, L.P.
import { assertDeobfuscation } from "./assertDeobfuscation";

test(
  "obfuscator.io recipe",
  async () => {
    const deobfuscated = await assertDeobfuscation(
      "/Hello World/helloWorld.JSFuck.js",
      "JSFuck"
    );

    expect(deobfuscated.indexOf("Hello, World!") >= 0).toBe(true);
  },
  2 * 60000
);
