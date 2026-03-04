# SubSpy — Subscription Tracker API

SubSpy is a RESTful API built to help users keep track of their recurring subscriptions. It handles everything from creating and categorising subscriptions to automatically reminding users before a renewal hits — all secured behind proper authentication and protected from abuse out of the box.

---

## Features

### User Authentication
Authentication is handled with **JWT (JSON Web Tokens)**. Users can sign up and sign in, and passwords are hashed using **bcrypt** before ever touching the database — so plaintext passwords are never stored. Protected routes require a valid Bearer token in the `Authorization` header, which is verified on every request through a dedicated auth middleware.

### Subscription Management
Once authenticated, users can create and manage their subscriptions. Each subscription tracks:

- **Name** — what the service is called
- **Price & Currency** — supports USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, SEK, and NZD
- **Billing Frequency** — daily, weekly, monthly, or yearly
- **Category** — entertainment, education, productivity, health, finance, or other
- **Payment Method** — however you're paying for it
- **Status** — active, cancelled, or expired
- **Start Date & Renewal Date** — with validation to make sure dates actually make sense

If a renewal date isn't provided when creating a subscription, the API calculates it automatically based on the billing frequency. And if the renewal date has already passed, the subscription is automatically marked as expired — no manual cleanup needed.

Users can only access their own subscriptions. There's a check in place to make sure that even if someone knows another user's ID, they can't pull that user's data.

### Automated Renewal Reminders
This is probably the most interesting part of the app. When a new subscription is created, it immediately triggers a **background workflow** using Upstash Workflow (via QStash). The workflow watches the subscription's renewal date and sends out email reminders at **7 days, 5 days, 2 days, and 1 day** before renewal. The workflow sleeps between reminders rather than polling constantly, which keeps things efficient. If a subscription is cancelled or expired, the workflow exits cleanly without sending anything.

### Rate Limiting & Bot Protection
Every incoming request passes through **Arcjet** before it does anything else. Arcjet handles three things:
- **Shield** — catches common web attack patterns
- **Bot Detection** — blocks automated traffic (search engine crawlers are allowed through)
- **Token Bucket Rate Limiting** — buckets refill at 5 tokens every 10 seconds, with a max capacity of 10, so no single IP can hammer the API

If a request gets denied, it gets a proper 429 or 403 response with a clear reason.

### Structured Error Handling
Errors are handled consistently across the whole API through a centralised error middleware. There's a custom `ErrorResponse` class that makes it easy to throw meaningful errors with the right status codes from anywhere in the codebase, and the middleware catches them all before they bubble up as unhandled crashes.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js |
| Database | MongoDB via Mongoose |
| Authentication | JSON Web Tokens (jsonwebtoken) |
| Password Hashing | bcrypt / bcryptjs |
| Scheduled Workflows | Upstash Workflow + QStash |
| Security & Rate Limiting | Arcjet (Shield, Bot Detection, Token Bucket) |
| Date Handling | Day.js |
| Cookie Parsing | cookie-parser |
| HTTP Logging | morgan |
| Environment Config | dotenv |
| Development | nodemon, ESLint |

---

## API Routes

### Auth — `/api/v1/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/sign-up` | Register a new user |
| POST | `/sign-in` | Log in and receive a token |
| POST | `/sign-out` | Sign out |

### Users — `/api/v1/users`
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/` | Yes | Get all users |
| GET | `/:id` | Yes | Get a single user by ID |

### Subscriptions — `/api/v1/subscriptions`
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/` | No | Get all subscriptions |
| GET | `/:id` | No | Get a single subscription |
| POST | `/` | Yes | Create a new subscription |
| PUT | `/:id` | Yes | Update a subscription |
| DELETE | `/:id` | Yes | Delete a subscription |
| GET | `/user/:id` | Yes | Get all subscriptions for a user |
| PUT | `/:id/cancel` | Yes | Cancel a subscription |
| GET | `/upcoming-renewals` | No | View upcoming renewals |

### Workflows — `/api/v1/workflows`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/subscription/reminder` | Internal endpoint triggered by Upstash to send renewal reminders |
