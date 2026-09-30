import { MAX_BODY_BYTES } from "./schema"

/** Enforce the wire limit in bytes, including chunked bodies and unknown keys. */
export async function readProfileBody(
  request: Request
): Promise<
  { body: unknown; status?: never } | { status: 400 | 413; body?: never }
> {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return { status: 413 }
  }
  const reader = request.body?.getReader()
  if (!reader) return { status: 400 }
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_BODY_BYTES) {
        await reader.cancel()
        return { status: 413 }
      }
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) {
      bytes.set(chunk, offset)
      offset += chunk.byteLength
    }
    return {
      body: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)),
    }
  } catch {
    return { status: 400 }
  } finally {
    reader.releaseLock()
  }
}
