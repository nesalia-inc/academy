---
name: auth-package-rebuild
description: packages/auth requires explicit rebuild after config.ts changes
type: feedback
---

## packages/auth : toujours rebuild après modification de config.ts

**Why:** Dans ce monorepo Turborepo, `packages/auth` compile son `src/` en `dist/`. `apps/web` importe le dist, pas le source. Une modification de `config.ts` sans rebuild laisse le dist outdated → crash au runtime (ZodError sur deviceAuthorization) même si le source est correct. Le workaround `schema: {}` dans `config.ts` résout le bug better-auth, mais ne fonctionne que si le dist est à jour.

**How to apply:** Après tout edit dans `packages/auth/src/`, toujours lancer :
```bash
pnpm --filter @complete-web-template/auth build
```
Avant de rafraîchir le browser ou de relancer le dev server.