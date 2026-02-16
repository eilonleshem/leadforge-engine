#!/usr/bin/env node
/**
 * Vercel Environment Variables Setup Script
 * 
 * Note: Vercel doesn't have a public API for setting env vars easily.
 * This script uses Vercel CLI which requires manual authentication.
 * 
 * Alternative: Use Vercel Dashboard or this script with VERCEL_TOKEN
 */

const { execSync } = require('child_process');

const envVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@leadforge.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  APP_BASE_URL: process.env.APP_BASE_URL,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER: process.env.TWILIO_FROM_NUMBER,
  TWILIO_TRACKING_NUMBER: process.env.TWILIO_TRACKING_NUMBER,
};

console.log('🚀 Setting Vercel Environment Variables...\n');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch {
  console.error('❌ Vercel CLI not found. Install it with: npm install -g vercel');
  process.exit(1);
}

// Note: Vercel CLI requires project to be linked first
// Run: vercel link

console.log('⚠️  Vercel CLI requires manual project linking.');
console.log('   1. Run: vercel link');
console.log('   2. Then set variables manually in Dashboard or use Vercel API\n');

console.log('📋 Variables to set:');
Object.entries(envVars).forEach(([key, value]) => {
  if (value) {
    console.log(`   ${key}=${value.substring(0, 20)}...`);
  }
});

console.log('\n💡 Tip: Use Railway for easier automated env var setup!');
