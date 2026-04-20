import { readFile, searchCode } from './github'
import { getCustomerContext } from './scopedReader'

export type ToolResult = { content: string; is_error?: boolean }

export async function handleTool(
  name: string,
  input: unknown,
  ctx: { orgId: string },
): Promise<ToolResult> {
  try {
    switch (name) {
      case 'search_code': {
        const query = extractString(input, 'query')
        const hits = await searchCode(query)
        return { content: JSON.stringify(hits) }
      }
      case 'read_file': {
        const path = extractString(input, 'path')
        const file = await readFile(path)
        return { content: `# ${file.path}\n\n${file.content}` }
      }
      case 'get_customer_context': {
        const ctxData = await getCustomerContext(ctx.orgId)
        return { content: JSON.stringify(ctxData) }
      }
      default:
        return { content: `Unknown tool: ${name}`, is_error: true }
    }
  } catch (err) {
    return {
      content: err instanceof Error ? err.message : String(err),
      is_error: true,
    }
  }
}

function extractString(input: unknown, key: string): string {
  if (!input || typeof input !== 'object') throw new Error(`Expected object input for ${key}`)
  const v = (input as Record<string, unknown>)[key]
  if (typeof v !== 'string') throw new Error(`Expected string for ${key}`)
  return v
}
