# n8n hosting — Oracle Cloud Always Free

Self-hosted n8n behind Caddy (automatic HTTPS), sized to also leave room for
running the video clipper (SamurAIGPT) on the same free VM later.

## Steps only you can do (account/DNS/browser)

1. Create an Oracle Cloud account at cloud.oracle.com (free; card required for
   identity verification, but Always Free resources never charge).
2. Create a compute instance:
   - Shape: `VM.Standard.A1.Flex` (Ampere, Always Free eligible)
   - Size: start with 2 OCPU / 12GB RAM — leaves the other 2 OCPU / 12GB of
     your Always Free allowance available for a second instance (e.g. the
     video clipper) later, or resize this one up to 4/24 if you'd rather run
     everything on one box.
   - Image: Ubuntu 22.04
   - Attach a public IPv4 address.
3. Open ports in the instance's Virtual Cloud Network security list (or a
   Network Security Group attached to the instance): ingress TCP 80 and 443
   from 0.0.0.0/0. Oracle blocks these by default.
4. Oracle's Ubuntu image also ships with its own iptables rules blocking
   inbound traffic. SSH in and run:
   ```
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
   sudo netfilter-persistent save
   ```
5. DNS: add an A record `n8n.56vicelane.com` → the instance's public IP,
   wherever 56vicelane.com's DNS is managed (Cloudflare, given the existing
   `_worker.js` in this repo).

## Steps to run on the VM (copy/paste)

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Pull this config onto the box (or scp the two files over)
mkdir -p ~/n8n && cd ~/n8n
# copy docker-compose.yml and Caddyfile from this folder here

# Generate an encryption key once, keep it — losing it invalidates
# any stored credentials inside n8n if you ever rebuild the container
echo "N8N_ENCRYPTION_KEY=$(openssl rand -hex 24)" > .env

docker compose up -d
```

Visit `https://n8n.56vicelane.com` — n8n's first-run setup creates the owner
account (email/password) directly in the browser, nothing to configure in
code for that part.

## Connecting Claude to it

1. In n8n's UI: Settings → n8n API → create an API key.
2. In claude.ai (not this session): Settings → Connectors → find "n8n" →
   connect it, using `https://n8n.56vicelane.com` as the instance URL and the
   API key from step 1.
3. Back in a Claude Code session with that connector enabled, workflows can
   be listed/run/edited directly.

## Notes

- n8n itself is lightweight (workflow glue, HTTP calls) — 2 OCPU/12GB is
  overkill for it alone. The headroom is intentional for the video pipeline.
- Don't expose port 5678 publicly — Caddy terminates TLS and proxies to it
  over the docker-compose network, so only 80/443 need to be open.
