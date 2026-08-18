package com.jobportal.repository;
import com.jobportal.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface JobApplicationRepository extends JpaRepository<JobApplication,Long> {
    List<JobApplication> findByCandidateId(Long id);
    List<JobApplication> findByJobRecruiterId(Long id);
    boolean existsByJobIdAndCandidateId(Long jobId,Long candidateId);
}
