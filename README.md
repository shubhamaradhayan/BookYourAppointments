# BookYourAppointments Frontend

Clean, human-readable React + Vite frontend for the BookYourAppointments SaaS.

## Requirements

- Node.js 18+
- npm
- BookYourAppointments Core PHP backend running through XAMPP/Apache

## Install

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

If port 5173 is busy, Vite will automatically use another port.

## XAMPP API

The Vite development server proxies:

```text
/bookflow-api
```

to:

```text
http://localhost/bookflow/api
```

Therefore the PHP project should be available at:

```text
http://localhost/bookflow/
```

## Folder structure

```text
src/
├── api/
│   └── client.js
├── components/
│   ├── auth/
│   ├── layout/
│   └── ui/
├── context/
├── pages/
│   ├── auth/
│   ├── availability/
│   ├── dashboard/
│   ├── profile/
│   ├── public/
│   └── services/
├── App.jsx
├── main.jsx
└── styles.css
```

The code is intentionally split by responsibility and uses normal formatting instead of minified/generated one-line JSX.

## Build for production

```bash
npm run build
```

The output is generated in:

```text
dist/
```

Copy the contents of `dist/` to the location where your PHP application serves the React frontend.

## Important

This frontend expects the API routes from the BookFlow Core PHP backend:

- auth/register
- auth/login
- auth/me
- auth/logout
- profile
- profile/photo
- services
- availability
- appointments
- calendar/status
- public/{slug}
- public/{slug}/slots
- public/{slug}/book


## Public booking UI

The public booking page has a professional profile layout with:

- Cover/header area
- Prominent profile photo
- Professional name as the primary heading
- Profession and business name
- About section
- Contact information
- Clear appointment booking hierarchy
- Responsive mobile layout
- Subtle motion and hover effects


## Authentication

This version is compatible with the JWT backend.

- Access token: short-lived JWT
- Refresh token: rotated by the API
- Access token: kept in `sessionStorage`
- API requests: `Authorization: Bearer <access_token>`
- Automatic access-token refresh on HTTP 401
- Google Calendar connect/disconnect controls are available on Profile


## Sign in with Google

Create/use a Google OAuth Web Client ID and put it in:

```env
VITE_GOOGLE_CLIENT_ID=your-web-client-id
```

The browser uses Google Identity Services to obtain an ID token. The token
is sent to the Core PHP backend. The backend verifies the token with Google's
PHP client and then issues the normal BookFlow JWT access/refresh tokens.

Google Calendar authorization remains a separate, explicit connection from
the Profile page. This avoids requesting Calendar permissions merely to sign
in.

For an existing email/password account, Google is not silently linked by
email. The user should first sign in normally and use an authenticated account
linking flow.
