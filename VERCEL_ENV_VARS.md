# Vercel Environment Variables - הוסף את אלה ב-Vercel Dashboard

## 📋 הוראות הוספה

1. לך ל-**Vercel Dashboard** → **Project Settings** → **Environment Variables**
2. הוסף כל משתנה בנפרד
3. סמן **Production**, **Preview**, ו-**Development** (או רק Production אם תרצה)

---

## 🔐 Environment Variables (חובה)

### Database (PostgreSQL)
```
DATABASE_URL=postgresql://user:password@host:5432/leadforge?sslmode=require
```
**איפה להשיג:** Neon/Supabase/Railway → Connection String

```
DIRECT_DATABASE_URL=postgresql://user:password@host:5432/leadforge?sslmode=require
```
**איפה להשיג:** Neon/Supabase → Direct Connection (לא pooler)

---

### NextAuth (Authentication)
```
NEXTAUTH_SECRET=your-random-secret-here-min-32-chars
```
**איך ליצור:** הרץ `openssl rand -base64 32` בטרמינל

```
NEXTAUTH_URL=https://your-app.vercel.app
```
**הערה:** ב-Production זה אוטומטי, הוסף רק ל-Preview

---

### Admin Credentials
```
ADMIN_EMAIL=admin@leadforge.com
```

```
ADMIN_PASSWORD=your-strong-password-here
```

---

### Upstash Redis (OTP + Rate Limiting)
```
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
```
**איפה להשיג:** Upstash Dashboard → Redis Database → REST URL

```
UPSTASH_REDIS_REST_TOKEN=your-redis-token-here
```
**איפה להשיג:** Upstash Dashboard → Redis Database → REST Token

---

### App Configuration
```
APP_BASE_URL=https://your-app.vercel.app
```
**הערה:** החלף `your-app` בשם האמיתי של הפרויקט ב-Vercel

---

## 📱 Twilio (אופציונלי - SMS לא יעבוד בלעדיו)

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

```
TWILIO_AUTH_TOKEN=your-twilio-auth-token
```

```
TWILIO_FROM_NUMBER=+1234567890
```

```
TWILIO_TRACKING_NUMBER=+1234567890
```

---

## ✅ Checklist

לפני Deploy, ודא שהוספת:
- [ ] `DATABASE_URL`
- [ ] `DIRECT_DATABASE_URL` (אם משתמש ב-pooler)
- [ ] `NEXTAUTH_SECRET`
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`
- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `APP_BASE_URL`
- [ ] `TWILIO_*` (אופציונלי)

---

## 🚀 אחרי שהוספת את כל ה-Variables

1. לחץ **"Save"**
2. לך ל-**Deployments** → לחץ **"Redeploy"** (או Deploy חדש)
3. חכה שהדיפלוי יסתיים
4. בדוק: `https://your-app.vercel.app/api/health`

---

## 📝 הערות חשובות

- **אל תעלה את הקובץ הזה ל-GitHub עם ערכים אמיתיים!**
- כל הערכים כאן הם דוגמאות בלבד
- הוסף את הערכים האמיתיים רק דרך Vercel Dashboard
- `NEXTAUTH_SECRET` חייב להיות מחרוזת אקראית חזקה (32+ תווים)
