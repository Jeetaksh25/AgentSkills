# Providers

A worker is a headless Claude Code session (`claude -p --bare`) whose requests go to a different API. So a provider must speak the **Anthropic Messages API**: Claude Code posts to `<base_url>/v1/messages`. The presets are in `assets/providers.json`; `status` there says how far each one has been checked:

- `verified`: a full worker run (build, test and review) succeeded on it.
- `endpoint-checked`: the URL and the auth shape were confirmed with an invalid key plus the provider's own docs. No worker run yet, because no key was available.
- `documented`: provider docs only.

`scripts/check-provider.ps1` is the way to move any provider to "works for you": it sends a plain request, a request with a tool definition, and one real round trip through the CLI.

## Presets (checked 2026-11-25)

| Id | Base URL | Key variable | Default model | Status |
|---|---|---|---|---|
| `ollama-cloud` | `https://ollama.com` (or `OLLAMA_HOST`) | `OLLAMA_API_KEY` | `deepseek-v4.1-flash:1017` | verified |
| `ollama-local` | `http://localhost:11434` (or `OLLAMA_HOST`) | none | set `model` yourself | documented |
| `openrouter` | `https://openrouter.ai/api` (no `/v1`) | `OPENROUTER_API_KEY` | `deepseek/deepseek-v4.1-flash-1017` | endpoint-checked |
| `deepseek` | `https://api.deepseek.com/anthropic` | `DEEPSEEK_API_KEY` | `deepseek-flash` | endpoint-checked |
| `zai` | `https://api.z.ai/api/anthropic` | `ZAI_API_KEY` | set `model` yourself | endpoint-checked |
| `moonshot` | `https://api.moonshot.ai/anthropic` | `MOONSHOT_API_KEY` | set `model` yourself | endpoint-checked |
| `custom` | your `base_url` | your `key_env` | your `model` | n/a |

"Endpoint-checked" on 2026-11-25 meant: a POST to `/v1/messages` with an invalid key came back as a clean 401 in the Anthropic error format. For OpenRouter a well-formed fake key (`sk-or-v1-` followed by zeros) answered `User not found` in all three header styles (x-api-key, Authorization, both), so the key is read from either header.

## How the key is sent

`worker.ps1` gives the CLI an `apiKeyHelper`, which Claude Code sends as **both** `x-api-key` and `Authorization: Bearer`. Every preset above accepts that. The key lives in an environment variable and is never written to a file. In `--bare` mode the CLI reads auth only from `ANTHROPIC_API_KEY` or an `apiKeyHelper`; `ANTHROPIC_AUTH_TOKEN` is ignored there ("Not logged in").

Where the key comes from, in order: the process environment, then the project's `.env`. Put it in `.env` (git-ignored by `init.ps1`) or export it in the shell:

```powershell
$env:OPENROUTER_API_KEY = '<your key>'      # this shell only
```

## Choosing a model

A worker needs **tool calling** and a long enough context for a unit. Cheap candidates from OpenRouter's public catalog on 2026-11-25 (prices are per million tokens, they change, re-check before you commit to a budget):

| Model id | Context | In / out (USD) |
|---|---|---|
| `deepseek/deepseek-v4.1-flash-1017` | 1,048,576 | 0.15 / 0.60 |
| `deepseek/deepseek-v4-flash` | 1,048,576 | 0.09 / 0.18 |
| `deepseek/deepseek-v4.1-flash` | 1,048,576 | 0.14 / 0.42 |
| `z-ai/glm-5.3-flash` | 1,048,576 | 0.12 / 0.38 |
| `minimax/minimax-m3.1-flash` | 1,048,576 | 0.15 / 0.60 |
| `qwen/qwen3-coder-flash` | 1,000,000 | 0.195 / 0.975 |
| `qwen/qwen3-coder-next` | 262,144 | 0.12 / 0.80 |

The default on Ollama Cloud (`deepseek-v4.1-flash:1017`) is the same model as `deepseek/deepseek-v4.1-flash-1017` on OpenRouter. The catalog is public and needs no key: `https://openrouter.ai/api/v1/models`; a model is usable when `supported_parameters` contains `tools`.

DeepSeek direct accepts only its own names (`deepseek-flash`, `deepseek-v4-pro`, optionally with a `[1m]` suffix); an unknown name that does not start with `claude` returns 400.

## Any other provider

Anything that speaks the Anthropic Messages API works as `custom`:

```json
{ "provider": "custom", "base_url": "https://gateway.example.com", "key_env": "MY_GATEWAY_KEY", "model": "the-model-id" }
```

A provider that offers only an OpenAI-style API needs a translator in front of it (LiteLLM or claude-code-router). Run it locally, set `base_url` to `http://127.0.0.1:<port>`, and run `check-provider.ps1`.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `check-provider` basic call: HTTP 401 | wrong key, key in the wrong variable, wrong provider | check `key_env`; the preflight prints the variable name it read, never the value |
| OpenRouter: 404 or an HTML page | base URL ends in `/v1` | use `https://openrouter.ai/api` |
| DeepSeek: 400 | unknown model name | use `deepseek-flash` or `deepseek-v4-pro` |
| Direct API calls pass but `cli trip` fails, or workers say `Invalid API key` after minutes | a settings `env` block (usually `~/.claude/settings.json`) redirects `ANTHROPIC_BASE_URL`, for example to a local proxy | the worker already overrides it in its own `--settings`; if it still fails, run `claude -p hi --bare --settings <file> --debug-file <log>` and look at where `/v1/messages` goes |
| `tool call: not observed` | the model answered in text instead of calling the tool | pick a model that supports tools; workers on it will stall |
| A worker ends with `turns=1 tokens_in=0` | auth or base URL problem, not a model problem | read `.crew/runs/<unit>/<mode>-*.json` |
| 429 from the provider | too many parallel workers | lower `max_parallel_workers`, or batch in waves |
| Ollama local: connection refused | the server is not running | start Ollama and pull a tool-capable model |

## Sources

- OpenRouter, Claude Code integration: https://openrouter.ai/docs/cookbook/coding-agents/claude-code-integration
- DeepSeek, Anthropic API: https://api-docs.deepseek.com/guides/anthropic_api and Claude Code integration: https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code
- Ollama, Anthropic compatibility: https://docs.ollama.com/api/anthropic-compatibility and Claude Code: https://docs.ollama.com/integrations/claude-code
- Claude Code, connecting to an LLM gateway: https://code.claude.com/docs/en/llm-gateway-connect and headless mode: https://code.claude.com/docs/en/headless