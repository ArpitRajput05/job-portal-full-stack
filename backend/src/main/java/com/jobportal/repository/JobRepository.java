package com.jobportal.repository;
import com.jobportal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface JobRepository extends JpaRepository<Job,Long> {
    List<Job> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title,String location);
    List<Job> findByRecruiterId(Long recruiterId);
}
