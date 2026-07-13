# Clerk setup for SendKit

The SendKit repo protects the `remote-mcp` Hono app with Clerk MCP OAuth via `@clerk/backend` and `@clerk/mcp-tools`.
Complete the CLI steps below in your own terminal (the Clerk CLI requires interactive login).

## Prerequisites

- Clerk dashboard app: **SendKit**
- [Clerk CLI](https://clerk.com/docs/guides/development/cli) installed (`clerk --version`)
- Node.js 20.9+

## One-time CLI setup (Scenario B)

From the project root:

```bash
cd C:/Users/jpilk/Documents/Projects/sendkit

# 1. Log in (skip if already authenticated)
clerk auth login

# 2. Find your SendKit application ID
clerk apps list --json

# 3. Link this repo to SendKit
clerk link --app app_3GRs9tGnPPtUrPU2G2bk35BMP1q

# 4. Pull development keys into .env
clerk env pull

# 5. Verify integration health
clerk doctor --json
```

## Expected environment variables

After `clerk env pull`, your gitignored `.env` should include:

| Variable | Purpose |
|---|---|
| `CLERK_PUBLISHABLE_KEY` | Public key (`pk_test_...` or `pk_live_...`) |
| `CLERK_SECRET_KEY` | Server secret (`sk_test_...` or `sk_live_...`) |

See `.env.example` for the full list including Telegram settings.

## Verify locally

```bash
# Typecheck
bun run typecheck

# Start remote MCP (loads .env automatically in Bun when present)
bun run dev:remote-mcp
```

Then check:

- `GET http://localhost:3000/.well-known/oauth-protected-resource/<botToken>/mcp` → OAuth resource metadata
- `POST http://localhost:3000/<botToken>/mcp` → `401` without a valid Clerk OAuth Bearer token

The Telegram MCP route requires Clerk OAuth authentication.

## Troubleshooting

- **CLI hangs on Windows**: Run commands in PowerShell or Windows Terminal outside Cursor's sandbox.
- **`clerk link` in agent mode**: Pass `--app app_3GRs9tGnPPtUrPU2G2bk35BMP1q` explicitly; autolink only works when a publishable key is already in `.env`.
- **MCP Logs / server errors**: Ensure both `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set before starting the server.
