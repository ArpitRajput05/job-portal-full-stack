package com.jobportal.entity;

import jakarta.persistence.*;

@Entity
@Table(name="jobs")
public class Job {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length=3000) private String description;
    private String location;
    private String salary;
    private String skills;

    @ManyToOne(fetch=FetchType.EAGER)
    private User recruiter;

    public Job(){}
    public Long getId(){return id;}
    public String getTitle(){return title;}
    public void setTitle(String v){title=v;}
    public String getDescription(){return description;}
    public void setDescription(String v){description=v;}
    public String getLocation(){return location;}
    public void setLocation(String v){location=v;}
    public String getSalary(){return salary;}
    public void setSalary(String v){salary=v;}
    public String getSkills(){return skills;}
    public void setSkills(String v){skills=v;}
    public User getRecruiter(){return recruiter;}
    public void setRecruiter(User v){recruiter=v;}
}
