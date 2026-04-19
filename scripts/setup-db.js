#!/usr/bin/env node

/**
 * Database Setup Script for Production
 * 
 * This script helps set up the database schema in production environments.
 * Run this after deploying to ensure your database has the correct tables.
 */

const { execSync } = require('child_process');

async function setupDatabase() {
  console.log('🚀 Setting up database schema...');
  
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('📊 Pushing schema to database...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('✅ Database schema setup complete!');
    
    // Optionally run seed
    if (process.argv.includes('--seed')) {
      console.log('🌱 Seeding database...');
      execSync('npx prisma db seed', { stdio: 'inherit' });
      console.log('✅ Database seeding complete!');
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
