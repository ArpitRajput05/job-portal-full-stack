# HirJob — Job Portal & Recruitment System

HirJob is a focused full-stack job portal where candidates can discover roles and track applications, while recruiters can publish openings and review applicants. It is intentionally scoped as a junior developer portfolio project: clear workflows, role-based access, and a simple responsive interface.

## Features
- Candidate and Recruiter registration/login
- JWT authentication
- Role-based access
- Recruiters can create jobs
- Candidates can browse/search jobs
- Candidates can apply for jobs
- Candidates can track applications
- Recruiters can view applicants and update application status

## Stack
Backend: Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA, MySQL
Frontend: React + Vite
Tools: Maven, Git, Postman

## Run backend
1. Create a MySQL database: `CREATE DATABASE hirjob;`
2. Set `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, and `APP_JWT_SECRET` as environment variables if your local setup differs.
3. From backend:
   mvn spring-boot:run

Backend runs on http://localhost:8080

## Run frontend
From frontend:
   npm install
   npm run dev

Frontend runs on http://localhost:5173

Demo flow:
1. Register a RECRUITER.
2. Login and create a job.
3. Register a CANDIDATE in another account.
4. Login as candidate and apply.
5. Login as recruiter and update the application status.

## Deployment

Deploy the frontend to Vercel and the Spring Boot API to Render or Railway. The database must be a hosted MySQL-compatible database.

1. Deploy `backend` as a Java service. Set `PORT`, `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `APP_JWT_SECRET`, and `APP_CORS_ALLOWED_ORIGIN` (your Vercel URL).
2. Deploy `frontend` to Vercel with `npm run build` and `dist` as the output directory. Set `VITE_API_URL` to `https://your-api-url/api`.
3. Redeploy the backend after the final Vercel URL is available, so its CORS setting matches exactly.

Vercel is for the React frontend only; this Java/Spring Boot API needs a Java hosting service.

## Interview talking points

- Login returns a JWT; the React app stores it and sends it as a Bearer token for protected API calls.
- Spring Security checks the token and role. The API also verifies that a recruiter can only manage applications for their own jobs.
- The frontend uses one small API helper and environment variables, so its API URL changes between local development and deployment without changing the source code.
