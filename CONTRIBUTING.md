# Contributing To FindLand

FindLand accepts focused contributions that preserve the seller, payment, moderation, and publication boundaries described in the README.

## Before You Start

1. Search existing issues and pull requests for related work.
2. Discuss changes that alter data models, payment state, identity documents, or public routes before implementation.
3. Create a branch from the latest `dev` branch.
4. Use synthetic data and sandbox provider credentials throughout development.

## Local Setup

```bash
composer install
npm ci
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

Configure only the external integrations required for the behavior you are testing.

## Change Standards

- Keep each commit centered on one coherent behavior.
- Follow the existing Laravel, Inertia, React, and Tailwind conventions.
- Validate input at the server boundary and authorize access to user-owned records.
- Never send server credentials, identity documents, internal paths, or exception traces to the browser.
- Add or update regression coverage for changed behavior.
- Avoid unrelated formatting or dependency churn in focused pull requests.

## Verification

Run the project checks before pushing:

```bash
php artisan test --compact
./vendor/bin/pint --test
npm run build
```

Document any existing warning or check that cannot be run in the pull request description.

## Pull Requests

A reviewable pull request includes:

- a concise statement of the problem and outcome;
- the user-facing and operational impact;
- verification commands and their results;
- screenshots for visible interface changes;
- migration, configuration, or rollback notes when applicable;
- no real credentials, personal records, or payment data.

By contributing, you confirm that you have the right to submit the work and that it can be maintained within this repository's collaboration terms.
