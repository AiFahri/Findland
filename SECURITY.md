# Security Policy

FindLand handles account data, identity documents, property records, and payment state. Security reports should therefore be handled privately and with enough detail for the maintainers to reproduce the issue safely.

## Supported Development Line

| Branch | Security updates |
| --- | --- |
| `dev` | Supported |
| Historical branches | Not supported |

FindLand is under active development and has not completed an independent production security assessment.

## Reporting A Vulnerability

Do not open a public issue containing credentials, personal data, payment identifiers, exploit code, or a reproducible attack path.

Contact the repository maintainers privately through their GitHub profiles:

- [AiFahri](https://github.com/AiFahri)
- [ibamzjr](https://github.com/ibamzjr)

Include the affected route or component, expected and observed behavior, reproduction steps, impact, and any proposed mitigation. Redact all real customer and provider data.

The maintainers will acknowledge a report, assess its scope, coordinate a fix, and publish an appropriate advisory or release note when remediation is available.

## Sensitive Data Boundaries

- Never commit `.env` files, provider credentials, database exports, identity scans, or production logs.
- Keep Midtrans server keys and webhook verification entirely on the server.
- Store identity documents on a private disk with explicit administrative authorization.
- Use synthetic identities and sandbox provider credentials in tests and demonstrations.
- Rotate any credential immediately if it appears in a commit, log, screenshot, or issue.

## Deployment Responsibility

Repository access does not make the application production-ready. Deployers are responsible for HTTPS, secure cookies, trusted proxies, rate limiting, backups, retention policies, dependency review, monitoring, and applicable legal requirements.
