# Chat With Me 💬

A real-time portfolio support chat application built with Expo, React Native, Supabase, and TypeScript. Visitors can instantly chat with an AI assistant, and whenever they request to speak with me, the conversation is transferred to human support. I receive a live push notification on my mobile, allowing me to join the chat instantly from anywhere.
---

## ✨ Features

- 🚀 Real-time messaging with Supabase Realtime
- 🤖 AI Assistant support
- 👨‍💻 Admin Take Over functionality
- 🔄 Switch conversation between AI and Human
- 💬 Live conversation updates
- 📩 Unread message counter
- 🔔 Push Notifications (Expo + FCM)
- 👤 Visitor information
- 📱 Beautiful modern UI
- 🌙 Dark Theme
- ⚡ Built with Expo Router
- 🔥 Supabase Backend

---

## Screenshots

> Will Add Later.

```
assets/screenshots/
```

---

# Tech Stack

### Frontend

- Expo SDK 54
- React Native
- Expo Router
- TypeScript
- NativeWind (Tailwind CSS)

### Backend

- Supabase
- PostgreSQL
- Realtime Database
- Edge Functions

### Notifications

- Expo Notifications
- Firebase Cloud Messaging (FCM)

---

# Project Structure

```
app/
│
├── (tabs)/
│   ├── index.tsx
│   └── explore.tsx
│
├── chat/
│   └── [id].tsx
│
components/
│   ├── ConversationItem.tsx
│   ├── MessageBubble.tsx
│   └── ReplyBox.tsx
│
lib/
│   ├── supabase.ts
│   ├── chat.ts
│   └── notifications.ts
│
assets/
hooks/
constants/
types/
```

---

# Features Overview

## Visitor

- Start conversation
- Chat with AI
- Receive AI replies
- Continue chatting

---

## Admin

- View all conversations
- Real-time updates
- Reply instantly
- Take Over AI conversation
- End Chat
- Resume AI Assistant
- Live unread counter

---

## Conversation Status

| Status | Description |
|----------|-------------|
| waiting | Waiting for admin |
| human | Admin is handling chat |
| bot | AI Assistant is handling chat |

---

## Message Types

| Sender | Bubble |
|----------|---------|
| user | Visitor |
| admin | Human Agent |
| bot | AI Assistant |
| system | System Messages |

---

# Push Notifications

Notifications are sent only when:

- Visitor sends a message
- Conversation status is **waiting**
- Admin is not already chatting

Notification Title

```
Visitor Name
```

Notification Body

```
Latest Visitor Message
```

Powered by

- Expo Push Notifications
- Firebase Cloud Messaging
- Supabase Edge Functions

---

# Installation

Clone repository

```bash
git clone https://github.com/arslan433/chat-with-me.git
```

Go to project

```bash
cd chat-with-me
```

Install dependencies

```bash
npm install
```

Run Expo

```bash
npx expo start
```

---

# Environment Variables

Create a `.env` file.

```env
EXPO_PUBLIC_SUPABASE_URL=

EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

---

# Supabase Setup

Create the following tables.

## conversations

| Column |
|----------|
| id |
| visitor_name |
| visitor_email |
| status |
| last_message |
| unread_count |
| updated_at |

---

## messages

| Column |
|----------|
| id |
| conversation_id |
| sender |
| message |
| created_at |

---

## admin_devices

| Column |
|----------|
| id |
| push_token |
| device_name |

---

# Firebase Setup

1. Create Firebase Project
2. Enable Firebase Cloud Messaging
3. Register Android App
4. Download

```
google-services.json
```

5. Place it in project root.

---

# Build APK

Login

```bash
eas login
```

Configure

```bash
eas build:configure
```

Preview APK

```bash
eas build --platform android --profile preview
```

Production

```bash
eas build --platform android
```

---

# Realtime

Realtime subscriptions

- conversations
- messages

Used for

- New conversations
- New messages
- Status updates
- Live unread count

---

# Admin Controls

## Take Over

Changes status

```
waiting
```

↓

```
human
```

---

## End Chat

Changes status

```
human
```

↓

```
bot
```

Also inserts

```
Chat ended.
AI Assistant has resumed the conversation.
```

---

# Notifications Flow

```
Visitor Message

        │

        ▼

Supabase INSERT

        │

        ▼

Database Webhook

        │

        ▼

Edge Function

        │

        ▼

Check Status

(waiting)

        │

        ▼

Expo Push API

        │

        ▼

Admin Device
```

---

# Dependencies

- expo
- expo-router
- expo-notifications
- expo-device
- expo-constants
- react-native
- nativewind
- @supabase/supabase-js

---

# Future Improvements

- Typing Indicator
- Read Receipts
- File Sharing
- Image Messages
- Voice Messages
- Multiple Admin Support
- Chat Search
- Visitor Online Status
- AI Conversation History
- Chat Analytics
- Dashboard
- User Authentication

---

# Author

**Arslan Muhammad**

Full Stack Developer

GitHub

https://github.com/arslan433

---

# License

MIT License

Copyright (c) 2026 Arslan Muhammad

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction.
