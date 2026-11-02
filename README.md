# OnlyFranz Basketball - Official Page

Preserves the original OnlyFranz HTML page. Adds a **private ESPN sync** for roster, win-loss record and ESPN ranking. Existing static content stays visible when ESPN access is not configured.

## Deployment

1. Create a **private** GitHub repository and upload the files in this folder (not just the zip).
2. In Vercel, use **Add New > Project > Import Git Repository**. Select the repository. Framework: **Other**. Root: repository root. Deploy.
3. On Vercel, visit **Settings > Environment Variables** and create `ESPN_S2` and `ESPN_SWID` for the server (do NOT put them in GitHub, the HTML, chat, or public client settings). These are sensitive session cookies and grant account access. Retrieve them only from your own logged-in browser if you are comfortable, or use another supported authorization mechanism. Set production environment and redeploy.
4. Open `https://YOUR-SITE.vercel.app/api/espn` to see if the backend can access the private league. If successful, the homepage dashboard and roster update on page load and via Refresh.

## Technical caveats

- This uses ESPN's **unofficial** fantasy API. Access and field formats may change. It may refuse requests from Vercel; no automatic refresh is guaranteed.
- Credentials are **never** sent from this web page. The server returns only franchise data. However, this endpoint is publicly accessible, so **your roster, record and standings returned by the endpoint become public** if you deploy publicly. If you want these private, add server-side access control before deploying.
- Data updates each time someone opens the site or presses Refresh, not on a timed schedule. The original schedule and news remain editorial/static for now.
- NBA headshots still load from NBA.com over the internet; they are **not** embedded.
- If your ESPN cookies expire, update the Vercel environment variables and redeploy.
- You can launch the visual site without cookies; it displays the manual roster and a sync-not-connected message.
- Never share ESPN account passwords, cookies, or private tokens in ChatGPT.
