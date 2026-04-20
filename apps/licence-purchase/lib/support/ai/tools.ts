import type Anthropic from '@anthropic-ai/sdk'

export const supportTools: Anthropic.Tool[] = [
  {
    name: 'search_code',
    description:
      'Search the Infrawatch GitHub repository for files matching a query. ' +
      'Use when the customer asks about how something works or references a ' +
      'feature by name. Returns up to 10 file paths.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keyword or phrase to search for. GitHub code-search syntax is supported.',
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
