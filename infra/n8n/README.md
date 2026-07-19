# n8n hosting — Google Cloud Always Free

Self-hosted n8n behind Caddy (automatic HTTPS), running on GCP's perpetual
free `e2-micro` instance.

(Originally scoped for Oracle Cloud's free Ampere tier, which would have
also had room to run the video clipper on the same box — but Oracle's free
Ampere capacity is notoriously oversubscribed and unavailable in most
regions/tenancies for days at a time. Moved to GCP instead. GCP's free
`e2-micro` only has 1GB RAM, enough for n8n alone — hosting for the video
clipper is a separate decision for later.)

## Steps only you can do (account/DNS/browser)

1. Create a Google Cloud account at cloud.google.com (free; card required
   for verification, but the Always Free resources below never charge on
   their own — just don't attach anything outside the free allotment).
2. Create a new project (or use an existing one), then enable the
   "Compute Engine API" for it (console prompts you to enable it the first
   time you visit Compute Engine).
3. Create a VM instance:
   - Machine type: `e2-micro` (2 shared vCPU, 1GB memory) — Always Free
     eligible ONLY in these regions: `us-west1`, `us-central1`, or
     `us-east1`. Pick one of those three or you lose free eligibility.
   - Boot disk: Ubuntu 22.04 LTS, up to 30GB **standard persistent disk**
     (not SSD — SSD persistent disk isn't covered by Always Free).
   - Under "Firewall", check both "Allow HTTP traffic" and "Allow HTTPS
     traffic" — this is the whole firewall step, no separate security list
     or iptables wrangling like Oracle required.
4. (Recommended) Reserve a static external IP for the instance under
   VPC Network → IP addresses, so DNS doesn't break if the VM ever
   restarts. Free while attached to a running instance.
5. DNS: add an A record `n8n.56vicelane.com` → the instance's external IP,
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
