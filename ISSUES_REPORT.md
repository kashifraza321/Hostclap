# Hostclap — Code Review: UI & Logic Issues

Scope: Angular 18 admin app (`src/`) + Node/Express CMS (`cms-admin/`).

---

## Critical

### 1. Route guards are disabled — no auth protection
`src/app/app.routes.ts`: `canActivate: [AuthGuard]` on the main container and `[ProtectGuard]` on `/login` are both commented out. Any unauthenticated user can reach `/in/insight`, `user-management`, `subadmin`, etc. directly. Logged-in users can also re-open `/login`.

### 2. 401 handling broken in HTTP interceptor
`src/app/interceptors/authentication.interceptor.ts`: on a 401/410 the token removal and `router.navigate(['/login'])` are commented out, and instead it shows `window.alert("Backend APi server down, please try again later")` on **every** auth failure. So expired sessions never log the user out, and a normal "invalid credentials"/expired-token response shows a misleading "server down" popup. Also `error.error.details` will throw if `error.error` is a string/null.

### 3. Secrets committed to the repo
`cms-admin/.env` is tracked and contains a real MongoDB Atlas credential in comments (`kashifraza91 / u4BQR0IS6ZsALhb6`) plus placeholder secrets (`JWT_SECRET=your_secret_key`, `SESSION_SECRET=yourSuperSecretKey`). Rotate the DB password immediately, move `.env` to `.gitignore`, and use strong secrets. `environment.ts` also ships a Google API key in source.

---

## High

### 4. `logout.guard.ts` doesn't actually guard
```ts
const accessToken = localStorage.setItem('token', "");
return true;
```
It sets the token to an empty string (instead of removing it) and always returns `true`. An empty-string token still passes `AuthGuard`'s `if (accessToken)` check is... actually `""` is falsy, but other code does `getItem('token') != null`, and `""` is not null — so `ProtectGuard` would treat the user as still logged in. Use `localStorage.removeItem('token')`.

### 5. Login state stored in `localStorage` but read from `sessionStorage`
`login.component.ts`, `sign-up.component.ts`, `login.service.ts`, `container.component.ts` all write/read `isLoggedIn` in **localStorage**, but `auth.service.ts` `isLoggedIn()` reads from **sessionStorage**. Result: the inactivity auto-logout timer's constructor check never fires on reload, because `sessionStorage.getItem('isLoggedIn')` is always null. Pick one storage.

### 6. `ContainerComponent` overrides `ActivatedRoute` with `{}`
`container.component.ts` providers: `{ provide: ActivatedRoute, useValue: {} }`. This replaces the real ActivatedRoute for the component and all its routed children, breaking any child that reads route params/data/snapshot. Remove this provider.

### 7. Backend: passport strategy calls a non-existent method
`cms-admin/config/passportConfig.js` and `app.js` call `User.findByUsername(username)`, but the User model (`models/user.js`) defines no such static. Any passport-based login throws `User.findByUsername is not a function`.

### 8. Backend: dead/duplicated server with two entry points on port 3000
- `server.js` defines `router.post('/auth/login')` / `/auth/register` using `User`, `bcrypt`, `jwt` that are **never imported in server.js**, and the `router` is **never mounted** (`app.use(router)` missing) — so that code is dead and would `ReferenceError` if reached. The working auth lives in `routes/auth.js`.
- `app.js` and `server.js` both `listen(3000)` and `package.json` `start` runs `server.js` plus `cms-admin/dist/bundle.js` — port conflicts / unclear single source of truth.
- In `app.js`, `app.use(session(...))` uses a hard-coded `'yourSecretKey'`, and `app.use(flash())` + `require('dotenv').config()` are placed **after** `app.listen()`, so they never take effect.

---

## Medium

### 9. CORS whitelist only allows localhost
`server.js` `corsOptions.origin` is `['http://localhost:4201','http://localhost:4200']`. The deployed frontend (`hostclab-service-app.onrender.com`) is not whitelisted, so production browser calls would be blocked.

### 10. `imageBaseUrl` has a leading space
`environment.ts`: `imageBaseUrl: ' https://hostclap.s3.eu-north-1.amazonaws.com/'` — the leading space produces malformed image URLs anywhere this is concatenated.

### 11. Signup logs user in even without a token
`sign-up.component.ts` `onSubmit()` sets `isLoggedIn=true` and navigates to the dashboard on `status===200` even if no `token` is returned (`if (response.data?.token)` is optional). Mixed `alert()` and toastr are used for the same events (inconsistent UX).

### 12. `UserListComponent` datasource race / messy imports
`user-list.component.ts`: `ngOnInit` calls async `getAllUsers(...)` then immediately builds `new MatTableDataSource(this.allUserList)` while `allUserList` is still undefined; data only appears via the later callback. Also `MaterialModule` is imported at the **bottom of the file** (after the class) and listed **twice** in the `imports` array.

### 13. India-only validation on a multi-country app
`sign-up.component.ts` enforces `phoneNumber` = exactly 10 digits and `pincode` = exactly 6 digits. The app has US/UK/CA sections; these patterns reject valid foreign phone numbers and postal codes.

---

## Low / cleanup
- `app.config.ts` calls `provideAnimationsAsync()` twice.
- ~333 `console.log` statements left in production code (incl. logging tokens/user IDs in `login.component.ts`).
- `package.json` has a stray dependency `"18": "^0.0.0"`.
- Leftover large commented-out code blocks across components (login, signup, interceptor) and committed `dist.zip` (~28 MB) + `.DS_Store` files in the repo.
- `formSubmission.js` registers the model as `'requestSubmission'` (name/intent mismatch — easy to confuse).
