package com.career.copilot.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String jobTitle;

    private String location;

    private String salaryRange;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    private Integer matchPercentage;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String jobUrl;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDate appliedDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum ApplicationStatus {
        WISHLIST,
        APPLIED,
        SCREENING,
        INTERVIEW,
        OFFER,
        REJECTED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = ApplicationStatus.WISHLIST;
        }
        if (appliedDate == null && status != ApplicationStatus.WISHLIST) {
            appliedDate = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
