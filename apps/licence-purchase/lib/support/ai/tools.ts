import type Anthropic from '@anthropic-ai/sdk'

export const supportTools: Anthropic.Tool[] = [
  {
    name: 'search_code',
    description:
      'Find candidate files in the Infrawatch GitHub repository by matching ' +
      'the query against FILE PATHS (not file contents). Works best with ' +
      'concrete nouns that appear in paths, e.g. "agent register", "licence ' +
      'sign", "alert rule". Returns up to 20 most-matching paths. Follow up ' +
      'with read_file on the ones that look relevant.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Space- or phrase-separated keywords. Each alphanumeric token of length >=2 is matched as a case-insensitive substring against each file path; paths matching more tokens rank higher.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'read_file',
    description:
      'Read a single file from the Infrawatch GitHub repository. Use after ' +
      '`search_code` to inspect a specific file. Paths are repo-relative.',
    input_schema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Repo-relative path, e.g. "apps/web/lib/features.ts".',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'get_customer_context',
    description:
      'Get the licence tier, expiry and feature flags for the customer who ' +
      'opened this ticket. Call once before giving any tier-dependent answer.',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
]
