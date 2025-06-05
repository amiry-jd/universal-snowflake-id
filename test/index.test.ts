import { expect, test } from "bun:test";
import { Snowflake } from "../src/index";

const snowflake = new Snowflake({ datacenterId: 1, machineId: 2 });

test("Generates unique base62 IDs", () => {
  const id1 = snowflake.generateBase62();
  const id2 = snowflake.generateBase62();
  expect(id1).not.toBe(id2);
});

test("Decodes base62 ID to bigint", () => {
  const original = snowflake.generate();
  const encoded = snowflake.generateBase62();
  const decoded = Snowflake.parseBase62(encoded);
  expect(decoded).toBeGreaterThan(0n);
});
