# HR Management System Setup Guide

This guide will help you set up your HR Management System with all necessary external services.

## Table of Contents
1. [Clerk Authentication](#clerk-authentication)
2. [NeonDB Setup](#neondb-setup)
3. [Database Migration](#database-migration)
4. [Google API Setup (Optional)](#google-api-setup-optional)
5. [Running the Application](#running-the-application)

## Clerk Authentication

The project uses Clerk for authentication. You've already set up the required environment variables in your Vercel project:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## NeonDB Setup

1. Create a NeonDB account at [https://neon.tech](https://neon.tech) if you don't have one already.
2. Create a new project in the NeonDB dashboard.
3. Once your project is created, go to the "Connection Details" section.
4. Copy the connection string provided by NeonDB. It should look like this:

