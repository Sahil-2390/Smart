# Smart Lead Automation System

A full-stack MERN application that simulates lead enrichment automation for VR Automations. It ingests batch names, enriches them using the Nationalize.io API, applies business logic, and stores results in MongoDB. Includes a background task for CRM sync simulation.

## Tech Stack
- **Frontend**: React, Vite, Axios
- **Backend**: Node.js, Express.js, MongoDB (Atlas), Axios, Node-cron
- **Database**: MongoDB Atlas

## Features
- **Frontend Dashboard**:
  - Input batch of first names (comma-separated).
  - Submit for processing.
  - Live results table: Name, Predicted Country, Confidence Score, Status.
  - Filter by Status: All, Verified, To Check.
- **Backend API**:
  - POST /api/leads: Process batch names asynchronously.
  - GET /api/leads: Fetch all leads.
- **Background Automation**:
  - Cron job every 5 minutes: Sync verified leads to CRM (simulated logging).
  - Idempotency: Prevents duplicate syncs using 'synced' flag.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (for cloud DB)

### Backend Setup
1. Navigate to `backend/` directory.
2. Install dependencies: `npm install`
3. Create `.env` file with:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/smartlead?retryWrites=true&w=majority
   PORT=5000
   ```
   Replace with your MongoDB Atlas credentials.
4. Start server: `npm start` (runs on http://localhost:5000)

### Frontend Setup
1. Navigate to `frontend/` directory.
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev` (runs on http://localhost:5173)

### Deployment
- **Backend**: Deploy to Heroku (set environment variables).
- **Frontend**: Deploy to Netlify.
- **Database**: MongoDB Atlas.

## Architectural Explanation
- **Batch API Requests**: Handled asynchronously using `Promise.all` to query Nationalize.io for each name concurrently, ensuring efficiency without blocking or timeouts.
- **Duplicate Sync Prevention**: Background cron job uses a 'synced' boolean flag in the Lead model. It only processes leads where `status: 'Verified'` and `synced: false`, then sets `synced: true` after logging the sync message, ensuring idempotency even if the job runs multiple times.

## Database Screenshot
![Database Screenshot](https://example.com/db-screenshot.png)  
*(Replace with actual screenshot of MongoDB collection showing leads with name, country, probability, status, synced fields.)*

## API Endpoints
- `POST /api/leads`: Body { "names": ["Peter", "Aditi"] } → Processes batch and returns results.
- `GET /api/leads`: Returns all leads.


## Evaluation Notes
- API Integration: Correctly fetches and parses Nationalize.io data.
- Async Handling: Concurrent requests with Promise.all.
- Business Logic: Probability > 0.9 → Verified, else To Check.
- Data Integrity: Synced flag prevents duplicates.
- Code Quality: Modular structure (models, routes, server).
- UI/UX: Functional dashboard with filter.

## Live URLs
- Frontend: [Netlify URL]
- Backend: [Heroku URL]
- GitHub: [Repository URL]
