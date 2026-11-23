# Verified target: LPU UMS (reference implementation)

This is the portal the skill was built against. Keep it as a known-good example of the
pattern — every mechanic here generalises, and knowing one working configuration makes the
next portal much faster to map.

Treat the selectors below as **observed facts about this site**, not as universal rules.

## Login

- URL: `https://ums.lpu.in/lpuums/LoginNew.aspx`
- Form: `#form1`, posts to itself
- User field: `#txtU` (stable id) — carries `onchange="setTimeout('__doPostBack(\'txtU\',\'\')',0)"`
- Password field: **random name each load** (`bNjOkGW6Kg4V`, `LpK4P6B2QRua`, `QQgra2Iw53fL`, …)
  → select by `input[type=password]`
- Submit: **random name** (`…+"0awgfe"`), value `Login`
- Bot check: Turnstile, sitekey `0x4AAAAAABqizXa69CuLKKuQ`, field `cf-turnstile-response`
- Success: redirect to `StudentDashboard.aspx`
- Failure strings: `Invalid User ID`, `Invalid Password`, `Captcha verification failed`,
  `Please complete the verification.`

Use `targets/aspnet-turnstile.json` verbatim.

## Session lifetime

Cookies are session-scoped (`ASP.NET_SessionId`), so an idle browser stays logged in but a
cold HTTP client cannot resume without them. If the Chrome process dies, relaunch and rely on
`portal_fetch.py --fresh` handing it the saved cookies; expect to re-login if the server-side
session has timed out.

## Useful authenticated URLs

| Purpose | Path |
|---|---|
| Dashboard (nav + current courses + attendance %) | `/lpuums/StudentDashboard.aspx` |
| Student profile | `/lpuums/frmStudentProfile.aspx` |
| Results, grades + term-by-term CGPA/TGPA | `/lpuums/frmStudentResult.aspx` |
| Fee statement (payer, balance, every voucher) | `/lpuums/Reports/frmStatementofAccounts.aspx` |
| Hostel + residential slip | `/lpuums/frmResidentailReportingSlip.aspx` |
| Timetable | `/lpuums/Reports/frmStudentTimeTable.aspx` |
| Course-wise attendance | `/lpuums/Reports/rptCourseWiseStudentAttendance.aspx` |
| Scholarship letter | `/lpuums/frmStudentScholarshipLetter.aspx` |
| Messages | `/lpuums/frmStudentsMyMessages.aspx` |

## Report pages need parameters posted

`rptCourseWiseStudentAttendance.aspx` renders an empty viewer until it receives
`TextBox1` (VID), `TextBox2` (term id), `DropDownList1` (`Summary`/`Detail`), then `BtnShow`.
Drive it in the browser:

```python
await page.fill("#TextBox1", vid)
await page.fill("#TextBox2", term_id)
await page.select_option("#DropDownList1", "Summary")
await page.click("#BtnShow")
```

The report body takes several seconds to paint. The term id `26271` is the current one for
academic year 2026-27; `225262`/`225261`/`124252`/`124251` are the earlier ones.

## Student dashboard is a separate SPA

`StudentDashboard.aspx` links out to `studentums.lpu.in` through
`openapp.aspx?from=ums&toApp=nextproject&pagename=…`. Those pages are Next.js: deep-link
them, then wait for content. Their data is fetched over `/api/*` on that origin, authenticated
by the cookie the wrapper sets — so a captured browser context can read them without extra
credentials.

Charts inside are canvas-rendered; their numbers are not in `innerText`.

## Two dead ends worth recording

- The `studentums` "My Profile → Personal Information" card renders placeholders
  (`xxxx@lpu.in`, `xxxxxxxxxx`, `Batch: NA`) server-side. Real identity data lives on the
  classic pages listed above.
- `scrapling`'s `session_fetch` times out against this host at the default 30 s MCP timeout,
  and its Cloudflare solver does not produce a token for this sitekey. The CDP approach in
  `scripts/portal_login.py` succeeds reliably; don't spend time on the MCP path here.
