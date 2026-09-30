import { expect, test } from "bun:test"

import { readProfileBody } from "./body"
import { MAX_BODY_BYTES } from "./schema"

const request = (body: string) =>
  new Request("http://localhost/api/profile/abcdefghjk", {
    method: "PUT",
    body,
  })

test("rejects a multibyte body over 16KB even if its character count fits", async () => {
  const body = JSON.stringify({ unknown: "é".repeat(9000) })
  expect(body.length).toBeLessThan(MAX_BODY_BYTES)
  expect(await readProfileBody(request(body))).toEqual({ status: 413 })
})

test("accepts exactly the byte cap and rejects one byte more", async () => {
  const body = JSON.stringify("a".repeat(MAX_BODY_BYTES - 2))
  expect(await readProfileBody(request(body))).toEqual({
    body: "a".repeat(MAX_BODY_BYTES - 2),
  })
  expect(await readProfileBody(request(body + " "))).toEqual({ status: 413 })
})

test("stops consuming a chunked request when it crosses the byte cap", async () => {
  let cancelled = false
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(MAX_BODY_BYTES))
      controller.enqueue(new Uint8Array(1))
    },
    cancel() {
      cancelled = true
    },
  })
  const input = new Request("http://localhost", { method: "PUT", body: stream })
  expect(await readProfileBody(input)).toEqual({ status: 413 })
  expect(cancelled).toBe(true)
})

test("rejects invalid JSON and malformed UTF-8 without echoing input", async () => {
  expect(await readProfileBody(request("not json"))).toEqual({ status: 400 })
  const malformed = new Request("http://localhost", {
    method: "PUT",
    body: new Uint8Array([34, 255, 34]),
  })
  expect(await readProfileBody(malformed)).toEqual({ status: 400 })
})
