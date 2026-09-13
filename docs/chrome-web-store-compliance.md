# Chrome Web Store Compliance

Checklist to run through before every Chrome Web Store submission. It exists
because version 9.1.3 was rejected under
**"Ensuring Responsible Marketing and Monetization → Impersonation and
Intellectual Property → Red Nickel"** (rating/media content mimicking ranking,
rating, performance, current status, or promotional information).

Root cause of that rejection: the promotional cover image
(`screenshots/cover_new.png`) reproduced a Chrome Web Store-style listing card
with a five-star row, a review count and a "1,000+ users" figure. It has been
replaced with an image that only shows the popup UI and a feature list.

## Promotional content

- [ ] No fabricated or copied ratings (stars, "4.9/5", review counts)
- [ ] No user/download counts in promotional images or text
- [ ] No "#1" claims
- [ ] No "Best" claims
- [ ] No "Recommended" claims
- [ ] No "Featured" claims
- [ ] No "Top Rated" claims
- [ ] No "New" / "Now supports" promotional badges
- [ ] No Chrome Web Store-style ranking/status badges or listing-card mock-ups
- [ ] No "Official", "Verified", or "endorsed by IIT Kharagpur" claims

## Media

- [ ] Screenshots demonstrate actual functionality only
- [ ] Promotional images do not contain ratings
- [ ] Promotional images do not contain ranking claims
- [ ] Promotional images do not contain user/download statistics
- [ ] Promotional images do not reproduce Chrome Web Store UI (category chips, star rows, install counts)
- [ ] Every image uploaded to the Store comes from `screenshots/` (never `screenshots/old/`)

## Metadata

- [ ] Name accurately describes the extension (`ERP Auto Login - IITKGP`)
- [ ] Manifest description contains factual functionality only
- [ ] Store description (see `docs/chrome-web-store-listing.md`) contains factual functionality only
- [ ] No unsupported affiliation/endorsement claims (not official, not endorsed by IIT Kharagpur or Google)
- [ ] Privacy statement matches behaviour: credentials stay in `storage.local`, nothing is sent to an external server

## In-extension UI

- [ ] "Rate this addon" in the popup is a plain link to the Store listing with no star score, count, or badge next to it (acceptable feedback mechanism)
- [ ] No status/ranking text in the popup that could be read as Store performance data

## Repository

- [ ] README has no user-count, download-count, rating, or star badges
- [ ] README cover image is the same Store-safe `screenshots/cover_new.png`

## Pre-submission grep

Run from the repository root and review every hit in context:

```bash
grep -rniE "rating|stars|★|users|downloads|recommended|premium|#1|featured|\bbest\b|popular|top rated|official|verified" \
  README.md docs src/manifest.json src/pages/Popup/index.html
```

Expected hits are only technical/functional (e.g. `new Error(...)`, the
"Rate this addon" link text). Anything else must be removed before upload.
