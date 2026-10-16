package com.career.copilot.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String targetRole;

    private Double yearsOfExperience;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String resumeText;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String skillsJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String latestAnalysisJson;

    private Integer readinessScore;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
