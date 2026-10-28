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

## Storefront architecture
- Use the shared StoreProvider in the root layout for navigation, search, and in-memory cart state so all storefront pages share one shopping session without pretending to persist orders.
- Keep the typed demo catalog and cart calculations in src/lib/catalog.ts so pricing and cart behavior use a single source of truth.
- Use separate TanStack file routes for collections, product details, checkout, and brand content so navigation remains addressable and page metadata stays specific.
- Keep all storefront visual tokens in src/styles.css and use the Forge Button variant for store actions so the design stays consistent.
- Contact, membership, newsletter, and checkout are frontend previews and must disclose that submissions and payments are not connected.
