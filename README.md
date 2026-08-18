# Job Portal & Recruitment System

A beginner-friendly Java + Spring Boot + React + MySQL full-stack project.

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
1. Create MySQL database:
   CREATE DATABASE jobportal;
2. Edit backend/src/main/resources/application.properties if your MySQL username/password differs.
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
