```
npm install
npm run dev
```

```
open http://localhost:3000

```



┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   User      │   │  Session    │   │ Verification│   │  Account    │
│ (Profile)   │◄─►│ (Login)     │◄─►│ (Security)  │◄─►│ (Provider)  │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘

User: Main profile.

Session: Who is logged in and from where.

Verification: Confirms actions (email, reset).

Account: How the user logged in (email, social).

[User] --sign up--> [Better Auth] --save--> [Database]
[User] --sign in--> [Better Auth] --check--> [Database]
[User] --forgot password--> [Better Auth] --send email--> [User]