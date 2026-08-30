Immediately commit & push all changes, following Conventional Commits format.

Prefer inline styles, do not use CSS.

Decompose things into reusable components and files. Look for opportunities to
split things proactively which seem like they will become too large in the
future.

When handing off UI work, provide a screenshot and a verified Cloudflare tunnel
link.

## Cloudflare tunnel handoff

Run the development server and `cloudflared` in separate retained terminal
sessions. Do not launch the tunnel with `nohup`, `&`, or another detached shell
command: child processes started that way may be cleaned up as soon as the tool
call or turn ends, leaving the shared URL with Cloudflare error 1033.

1. Start the development server in a retained PTY and note its exact port.
2. Ensure Vite accepts quick-tunnel hosts with
   `server.allowedHosts: [".trycloudflare.com"]`.
3. Start the tunnel in a second retained PTY with:

   ```sh
   cloudflared tunnel --url http://localhost:<port> \
     --http-host-header localhost:<port> --no-autoupdate
   ```

4. Keep both retained sessions running through the final handoff. Never stop or
   replace an existing project tunnel unless its exact process and URL have
   first been identified.
5. Immediately before responding, request the printed `trycloudflare.com` URL
   and require HTTP 200. If it fails, inspect the retained tunnel output and
   repair or restart it before sharing a link.

Quick-tunnel URLs are temporary and work only while their matching `cloudflared`
process remains alive. Label a deployed Sites URL separately when one is also
available.
