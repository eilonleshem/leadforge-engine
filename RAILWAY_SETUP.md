# 🚂 Railway Deployment Guide

Railway מאפשר הגדרת Environment Variables אוטומטית דרך CLI או GitHub Actions!

## ✅ יתרונות Railway

- ✅ **Environment Variables אוטומטיים** - דרך CLI/API
- ✅ **Database מובנה** - PostgreSQL בחינם
- ✅ **Deploy אוטומטי** - מ-GitHub
- ✅ **פשוט יותר** - פחות הגדרות

---

## 🚀 Setup מהיר

### שלב 1: צור Railway Project

1. לך ל: **[railway.app](https://railway.app)**
2. הירשם/התחבר
3. לחץ **"New Project"** → **"Deploy from GitHub repo"**
4. בחר את `eilonleshem/leadforge-engine`

### שלב 2: הוסף Database

1. ב-Railway Dashboard → לחץ **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway יוצר database אוטומטית
3. העתק את ה-**Connection URL** (זה ה-`DATABASE_URL`)

### שלב 3: הגדר Environment Variables (אוטומטי!)

**אופציה A - דרך Railway Dashboard:**
1. לך ל-**Variables** tab
2. הוסף את כל ה-variables (ראו רשימה למטה)

**אופציה B - דרך CLI (אוטומטי!):**
```bash
# התקן Railway CLI
npm install -g @railway/cli

# התחבר
railway login

# חבר לפרויקט
railway link

# הגדר variables (מקובץ .env.local שלך)
railway variables set DATABASE_URL="$DATABASE_URL"
railway variables set NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
# ... וכו'
```

**אופציה C - דרך GitHub Actions (אוטומטי לחלוטין!):**
1. ב-GitHub → **Settings** → **Secrets and variables** → **Actions**
2. הוסף את כל ה-secrets (ראו רשימה למטה)
3. ה-workflow `.github/workflows/railway-deploy.yml` יעשה את זה אוטומטית!

---

## 📋 Environment Variables ל-Railway

### חובה:
```
DATABASE_URL=postgresql://... (מ-Railway Database)
NEXTAUTH_SECRET=... (openssl rand -base64 32)
ADMIN_EMAIL=admin@leadforge.com
ADMIN_PASSWORD=...
UPSTASH_REDIS_REST_URL=... (מ-Upstash)
UPSTASH_REDIS_REST_TOKEN=... (מ-Upstash)
APP_BASE_URL=https://your-app.railway.app
```

### אופציונלי (Twilio):
```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=...
TWILIO_TRACKING_NUMBER=...
```

---

## 🔄 GitHub Actions עם Railway

אם תרצה deploy אוטומטי דרך GitHub Actions:

1. **צור Railway Token:**
   - Railway Dashboard → **Account Settings** → **Tokens** → **New Token**
   - העתק את ה-token

2. **הוסף ל-GitHub Secrets:**
   - GitHub → **Settings** → **Secrets and variables** → **Actions**
   - הוסף `RAILWAY_TOKEN` עם הערך שהעתקת
   - הוסף גם את כל ה-Environment Variables כ-Secrets

3. **ה-workflow יעבוד אוטומטית!**

---

## 🆚 Railway vs Vercel

| תכונה | Railway | Vercel |
|---|---|---|
| Environment Variables אוטומטיים | ✅ כן (CLI/API) | ❌ לא (רק Dashboard) |
| Database מובנה | ✅ כן (PostgreSQL) | ❌ לא |
| Deploy אוטומטי | ✅ כן | ✅ כן |
| חינמי | ✅ כן (500 שעות/חודש) | ✅ כן |
| קל להגדרה | ✅ מאוד | ⚠️ בינוני |

---

## 💡 המלצה

**Railway יותר קל** אם אתה רוצה:
- Environment Variables אוטומטיים
- Database מובנה
- פחות הגדרות

**Vercel יותר טוב** אם אתה רוצה:
- Edge Functions
- CDN גלובלי
- אופטימיזציות מתקדמות

---

## 📝 Next Steps

1. צור Railway project
2. הוסף Database
3. הגדר Environment Variables (דרך Dashboard או CLI)
4. Deploy!

**הכל מוכן ב-`.github/workflows/railway-deploy.yml`** 🚀
