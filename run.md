# Onevoo Platform — Development Guide

## Prerequisites
1. Copy `.env.example` to `.env` in the root folder:
   ```bash
   cp .env.example .env
   ```
2. Fill in your Neon PostgreSQL connection string and Cloudinary API credentials in `.env`.

---

## Running the Application

### 1. Backend Server
From the root directory:
```bash
npm install
npm run server
```
Or directly from the backend folder:
```bash
cd backend
npm install
npm start
```
The server runs on `http://localhost:3001` (or the port specified in `.env`).

### 2. Frontend Development Server
From the root directory:
```bash
npm run frontend:dev
```
Or directly from the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
The Vite development server runs on `http://localhost:5173`.

---

## Production Build
```bash
# Build frontend
npm run frontend:build
```