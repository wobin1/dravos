# Deployment Guide

## Issues Fixed

### 1. SSL Warning Resolution
- ✅ Updated Prisma configuration to handle SSL modes properly
- ✅ Added libpq compatibility for production databases
- ✅ Fixed SSL configuration warnings

### 2. Database Schema Issues
- ✅ Fixed Prisma 7.x configuration
- ✅ Removed deprecated `url` property from schema
- ✅ Added proper database setup scripts

## Vercel Deployment Steps

### 1. Environment Variables
Set these in your Vercel dashboard:

```bash
DATABASE_URL="postgresql://username:password@host:port/database?uselibpqcompat=true&sslmode=require"
NODE_ENV="production"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### 2. Database Setup
After deployment, run this command to set up your database schema:

```bash
# Option 1: Using Vercel CLI
vercel env pull .env.local
npm run db:setup

# Option 2: Direct connection
DATABASE_URL="your-production-url" npm run db:push
```

### 3. Seed Database (Optional)
If you want to add initial data:

```bash
npm run db:setup:seed
```

## SSL Configuration Options

### For Maximum Security (Recommended)
```
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=verify-full"
```

### For Compatibility (Avoids warnings)
```
DATABASE_URL="postgresql://user:pass@host:port/db?uselibpqcompat=true&sslmode=require"
```

### For Local Development
```
DATABASE_URL="postgresql://postgres:@localhost:5432/epeetec_db?sslmode=disable"
```

## Troubleshooting

### "Table does not exist" Error
This means your database schema hasn't been applied. Run:
```bash
npm run db:setup
```

### SSL Connection Warnings
Update your DATABASE_URL to include `uselibpqcompat=true&sslmode=require`

### Build Failures
The build process no longer tries to connect to the database during build time, preventing deployment failures.

## Scripts Available

- `npm run build` - Build the application
- `npm run db:push` - Push schema to database
- `npm run db:setup` - Set up database schema in production
- `npm run db:setup:seed` - Set up database with seed data
- `npm run vercel-build` - Vercel-specific build command
