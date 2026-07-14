# VOYAGR — React + TypeScript Travel Platform

A flagship front-end portfolio project for travel discovery and demo booking.

## Features

- React + TypeScript
- Destination search
- Region filters
- Favorites
- Hotel selection
- Date and guest inputs
- Demo booking flow
- My Trips panel
- Booking cancellation
- Local Storage persistence
- Dark/light theme
- Responsive mobile navigation
- Netlify-ready build configuration

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Import the GitHub repository into Netlify.

- Build command: `npm run build`
- Publish directory: `dist`

## Note

This is a front-end portfolio demonstration. No real hotel reservation or payment is processed.


## Validation and discovery upgrades

- City and country autocomplete
- Expanded worldwide destination catalog
- Visible inline validation messages
- Past-date blocking
- Two-year maximum booking window
- Check-out after check-in enforcement
- Native calendar opening from the complete date field
- Improved no-results state
- Detailed booking summary and calculated stay total

- Punctuation-safe search matching for values such as `Delhi, India`
- Accent-insensitive and whitespace-normalized destination search


## Multi-step reservation checkout

- Room and rate selection
- Guest details with inline validation
- Payment method selection
- Card formatting and future-expiry validation
- Taxes and service-fee breakdown
- Cancellation policy review
- Terms acceptance
- Confirmation screen with booking number
- Saved itinerary in My Trips
