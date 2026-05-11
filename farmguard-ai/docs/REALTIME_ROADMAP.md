# FarmGuard AI Realtime Roadmap

This document describes the practical steps required to move FarmGuard AI from a strong prototype into a real, always-on farmer support platform.

## 1. Core live modules

### AI assistant

- Use `OPENAI_API_KEY` or `GROQ_API_KEY` for live agricultural Q&A.
- Keep LangGraph as the routing layer so queries can still be classified into weather, disease, market, irrigation, and advisory.
- Store each user question and each response in Supabase for future analytics, personalization, and escalation.

### Disease scan

- Let the farmer provide:
  - crop name
  - image
  - short description
  - location
- Analyze the image with a multimodal model.
- Save the result into `disease_reports`.
- Trigger an n8n follow-up workflow:
  - send email
  - send WhatsApp or SMS
  - schedule reminder
  - attach local helpline details

### Weather

- Use OpenWeatherMap live weather and 5-day forecast APIs.
- Start with `Phaltan`, `Satara`, and `Pune`.
- Later add village-level coordinates saved per farmer profile.

### Market

- Use Agmarknet or `data.gov.in` market price records for Maharashtra mandis.
- Start with tomato, onion, wheat, sugarcane, and pomegranate if these align with the target farmers.
- Store snapshots daily in `market_prices` for trend charts.

### Analytics

- Do not show analytics built only from placeholders.
- Generate charts from:
  - disease report counts by day
  - crop-wise disease counts
  - forecast severity
  - mandi price snapshots
  - user logins and AI chats
  - notification delivery counts

## 2. Authentication and notifications

### Recommended auth path

- Move login/register to Supabase Auth.
- Enable:
  - Email/password auth
  - Email confirmation
  - Google OAuth
  - Password reset

### Recommended notification path

- Email: Resend, SendGrid, or Supabase Edge Functions plus SMTP
- SMS/WhatsApp: Twilio or Gupshup
- Workflow engine: n8n

## 3. n8n disease workflow

### Trigger sources

- FarmGuard disease scan API
- Google Form submission
- Google Sheets row added from a linked Google Form

### Workflow steps

1. Receive submission payload.
2. Validate farmer identity using email or phone.
3. Categorize crop and disease severity.
4. Generate advisory using FarmGuard backend or direct AI call.
5. Look up nearby agriculture officer, hospital, helpline, or KVK contact.
6. Send response through:
   - email
   - SMS
   - WhatsApp
7. Wait 24 to 48 hours.
8. Send follow-up asking whether the crop improved.
9. If marked severe, escalate to local expert support.

## 4. What to store in Supabase

- `users`
- `disease_reports`
- `weather_logs`
- `market_prices`
- `notifications`
- `chat_messages`
- `farmer_profiles`
- `field_locations`
- `workflow_events`

## 5. Production priorities

### Phase 1

- Live AI assistant
- Live weather
- Disease scan with image + text
- Working dashboard navigation
- Live notifications
- Basic analytics from actual stored events

### Phase 2

- Google login
- email verification
- WhatsApp automation
- Google Form ingestion
- disease follow-up reminders

### Phase 3

- multilingual voice assistant
- farmer history timeline
- yield prediction
- soil sensor integration
- satellite monitoring
- government scheme recommender

## 6. Strong suggestions

- Add a confidence disclaimer for disease prediction and always encourage severe cases to contact experts.
- Keep a helpline block in every disease response.
- Track every API failure and fallback mode so you know when the system is not truly live.
- Add human review paths for uncertain disease cases.
- Add offline-first caching for low-connectivity areas.

