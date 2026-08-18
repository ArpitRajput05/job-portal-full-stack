package com.jobportal.controller;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/api/applications")
public class ApplicationController {
    private final JobApplicationRepository apps; private final JobRepository jobs; private final UserRepository users;
    public ApplicationController(JobApplicationRepository a,JobRepository j,UserRepository u){apps=a;jobs=j;users=u;}

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> apply(@PathVariable Long jobId,Authentication auth){
        User candidate=users.findByEmail(auth.getName()).orElseThrow();
        if(candidate.getRole()!=Role.CANDIDATE)return ResponseEntity.status(403).body("Candidate only");
        if(apps.existsByJobIdAndCandidateId(jobId,candidate.getId()))return ResponseEntity.badRequest().body("Already applied");
        Job job=jobs.findById(jobId).orElseThrow();
        JobApplication a=new JobApplication(); a.setJob(job); a.setCandidate(candidate);
        return ResponseEntity.ok(apps.save(a));
    }

    @GetMapping("/my") public List<JobApplication> mine(Authentication auth){
        User u=users.findByEmail(auth.getName()).orElseThrow(); return apps.findByCandidateId(u.getId());
    }

    @GetMapping("/recruiter") public List<JobApplication> recruiter(Authentication auth){
        User u=users.findByEmail(auth.getName()).orElseThrow(); return apps.findByJobRecruiterId(u.getId());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> status(@PathVariable Long id,@RequestBody Map<String,String> body,Authentication auth){
        User recruiter=users.findByEmail(auth.getName()).orElseThrow();
        JobApplication a=apps.findById(id).orElseThrow();
        if(a.getJob().getRecruiter().getId().longValue()!=recruiter.getId().longValue())return ResponseEntity.status(403).body("Not your application");
        a.setStatus(ApplicationStatus.valueOf(body.get("status").toUpperCase()));
        return ResponseEntity.ok(apps.save(a));
    }
}
