import {
  Redis,
  type UpstashRequest,
  type UpstashResponse,
} from "@upstash/redis"
import { mkdtemp, rm, stat } from "node:fs/promises"
import { join } from "node:path"

/** Real Redis, isolated to a temporary Unix socket with persistence disabled.
 * The requester speaks Upstash's command/result shape, so the production SDK's
 * serialization, Lua and MULTI/EXEC run unchanged without a hosted database.
 */
export async function startTestRedis() {
  const directory = await mkdtemp("/tmp/meterbar-redis-")
  const socket = join(directory, "redis.sock")
  const process = Bun.spawn(
    [
      "redis-server",
      "--port",
      "0",
      "--unixsocket",
      socket,
      "--unixsocketperm",
      "700",
      "--save",
      "",
      "--appendonly",
      "no",
    ],
    { stdout: "ignore", stderr: "pipe" }
  )

  async function execute(commands: unknown[][]) {
    const cli = Bun.spawn(["redis-cli", "--json", "-s", socket], {
      stdin: new Blob([
        commands
          .map((command) =>
            command
              .map((argument) => JSON.stringify(String(argument)))
              .join(" ")
          )
          .join("\n") + "\n",
      ]),
      stdout: "pipe",
      stderr: "pipe",
    })
    const output = await new Response(cli.stdout).text()
    const error = await new Response(cli.stderr).text()
    if ((await cli.exited) !== 0)
      throw new Error(`Local Redis command failed: ${error}`)
    const lines = output.trim().split("\n")
    return JSON.parse(lines[lines.length - 1]!) as unknown
  }

  try {
    let ready = false
    for (let attempt = 0; attempt < 100; attempt++) {
      if (
        await stat(socket).then(
          () => true,
          () => false
        )
      ) {
        await execute([["PING"]])
        ready = true
        break
      }
      if (process.exitCode !== null)
        throw new Error("Local Redis exited before startup")
      await Bun.sleep(10)
    }
    if (!ready) throw new Error("Local Redis did not start")
  } catch (error) {
    process.kill()
    await process.exited
    await rm(directory, { recursive: true, force: true })
    throw error
  }

  const redis = new Redis({
    async request<T>(request: UpstashRequest): Promise<UpstashResponse<T>> {
      if (request.path?.[0] === "multi-exec") {
        const commands = request.body as unknown[][]
        const result = (await execute([
          ["MULTI"],
          ...commands,
          ["EXEC"],
        ])) as unknown[]
        // The SDK's transaction endpoint returns an array of result envelopes.
        return result.map((value) => ({
          result: value,
        })) as unknown as UpstashResponse<T>
      }
      if (request.path?.[0] === "pipeline")
        throw new Error("Unexpected non-atomic pipeline")
      return { result: (await execute([request.body as unknown[]])) as T }
    },
  })

  return {
    redis,
    execute,
    async stop() {
      process.kill()
      await process.exited
      await rm(directory, { recursive: true, force: true })
    },
  }
}
