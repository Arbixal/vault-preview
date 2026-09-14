# Vault Preview

Vault Preview is a Next.js static-export application for viewing World of Warcraft Great Vault progress. Character progress is loaded from the configured `vault-progress` API at runtime in the browser.

## Requirements

- Node.js `22.23.1` or another Node 22 release satisfying the project engine range.
- npm `10.9.8` or another npm 10 release satisfying the project engine range.
- A browser for local development.

The repository includes `.nvmrc` and declares the supported Node/npm ranges in `package.json`.

## Local Development

Install the lockfile dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Development builds use `.env.development` and load data from:

```text
https://devapi.bixnpieces.com
```

The `NEXT_PUBLIC_API_ENDPOINT` value is embedded into the client bundle at build time. Do not put credentials or private values in a `NEXT_PUBLIC_` variable.

## Validation Commands

Run linting:

```bash
npm run lint
```

Run TypeScript checking:

```bash
npm run typecheck
```

Run unit and data tests:

```bash
npm test
```

Create the production static export:

```bash
npm run build
```

The build writes the deployable site to `out/`. The project uses `output: 'export'`, so `npm run start` is not the appropriate local preview command.

Preview the static export locally:

```bash
npx serve out --listen 3000
```

Run browser smoke tests against the static export:

```bash
npx playwright install chromium
npm run test:e2e
```

The Playwright configuration starts a static server, builds the site when needed, and routes the API request to the checked-in Season 2 fixture. The tests do not depend on production character data.

## Production Environment

Production builds use `.env.production` and load data from:

```text
https://api.bixnpieces.com
```

The production API must allow requests from:

```text
https://vault-preview.bixnpieces.com
```

The development API must allow requests from:

```text
http://localhost:3000
```

## Midnight Season 2 Data

Midnight Season 2 is represented by API season `18`.

Season mappings are maintained in `src/app/seasonData.ts`. The current data includes:

- Midnight Season 2 Great Vault item-level mappings.
- Venomous Abyss raid encounters.
- Tidebound Grotto and Nymrissa Wavecaller.
- Season 2 Mythic+ breakpoints.
- Season 2 Delve breakpoints.
- Separate gear-track rarity thresholds.

The live API contract is represented by `src/app/season2Character.fixture.json` and covered by `src/app/season2Api.test.ts`.

Primary data references:

- [Blizzard: Midnight Season 2 is Now Live](https://news.blizzard.com/en-us/article/24294369/midnight-season-2-is-now-live)
- [Blizzard: The Venomous Abyss](https://worldofwarcraft.blizzard.com/news/24294062/curse-of-ulatek-the-venomous-abyss-raid-finder-wing-3-now-live)
- [Icy Veins: Great Vault](https://www.icy-veins.com/wow/great-vault-guide)
- [Icy Veins: Midnight Mythic+ Season 2](https://www.icy-veins.com/wow/midnight-mythic-season-2-guide)
- [Icy Veins: Venomous Abyss](https://www.icy-veins.com/wow/venomous-abyss-raid-guide)
- [Icy Veins: Midnight Delves](https://www.icy-veins.com/wow/delves-guide)

## CI and Deployment

The workflow is `.github/workflows/publish.yml`.

Pull requests targeting `master` run:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Playwright browser installation and `npm run test:e2e`

Pushes to `master` run the same validation and then deploy the generated `out/` artifact to:

- S3 bucket: `vault-preview-files`
- AWS region: `ap-southeast-2`
- CloudFront alias: `vault-preview.bixnpieces.com`

Deployment uses GitHub Actions OIDC through the repository secret `AWS_DEPLOY_ROLE_ARN`. The deploy job has `id-token: write` permission and does not use the legacy AWS access-key secrets. Pull requests never run the deployment job.

The deployment keeps existing S3 objects and invalidates `index.html`, `404.html`, and the non-hashed public assets. Hashed Next.js assets remain cacheable.

## Rollback

The deployment currently retains existing S3 objects but does not provide versioned release prefixes or S3 versioning. The supported rollback procedure is:

1. Identify the last known-good commit on `master`.
2. Revert or restore that commit through the normal review process.
3. Push the rollback commit to `master`.
4. Confirm the validation workflow passes.
5. Confirm the deployment job completes and the public site serves the restored version.

Do not remove old S3 objects manually as part of a rollback. The AWS deployment strategy and rollback mechanism are tracked in [issue #69](https://github.com/Arbixal/vault-preview/issues/69).

## Project Structure

- `src/app/page.tsx`: character entry and saved-character UI.
- `src/app/_components/`: raid, Mythic+, Delve, and shared UI components.
- `src/app/seasonData.ts`: season mappings and encounter metadata.
- `src/app/season2Character.fixture.json`: sanitized Season 2 API fixture.
- `src/app/seasonData.test.ts`: seasonal mapping tests.
- `src/app/season2Api.test.ts`: Season 2 API-shape tests.
- `tests/home.spec.ts`: static-site browser smoke tests.
- `public/`: static assets copied into the export.
- `out/`: generated static deployment artifact; ignored by Git.
