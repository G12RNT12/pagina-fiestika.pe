<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Static store with no backend: all catalog/config/coupon/content data lives in `src/data/*.ts` so the owner can edit it by hand; orders go out via WhatsApp/mailto links and the cart persists in localStorage.
- Product/site images live under `public/images/<categoria>/` (owner uploads them); components must fall back to a pastel placeholder when a file is missing.
- Single-page store at `/` with hash-anchor sections (explicitly requested one-page); modals instead of extra routes.
