package com.jobportal.controller;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/jobs")
public class JobController {
    private final JobRepository jobs; private final UserRepository users;
    public JobController(JobRepository j,UserRepository u){jobs=j;users=u;}

    @GetMapping public List<Job> all(){return jobs.findAll();}
    @GetMapping("/search") public List<Job> search(@RequestParam(defaultValue="") String q){
        return jobs.findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(q,q);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Job job,Authentication auth){
        User u=users.findByEmail(auth.getName()).orElseThrow();
        if(u.getRole()!=Role.RECRUITER)return ResponseEntity.status(403).body("Recruiter only");
        job.setRecruiter(u); return ResponseEntity.ok(jobs.save(job));
    }

    @GetMapping("/mine") public List<Job> mine(Authentication auth){
        User u=users.findByEmail(auth.getName()).orElseThrow(); return jobs.findByRecruiterId(u.getId());
    }
}
