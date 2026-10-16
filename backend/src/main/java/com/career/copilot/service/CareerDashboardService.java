package com.career.copilot.service;

import com.career.copilot.model.JobApplication;
import com.career.copilot.model.UserProfile;
import com.career.copilot.repository.JobApplicationRepository;
import com.career.copilot.repository.RoadmapTaskRepository;
import com.career.copilot.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CareerDashboardService {

    private final JobApplicationRepository jobApplicationRepository;
    private final RoadmapTaskRepository roadmapTaskRepository;
    private final UserProfileRepository userProfileRepository;

    public CareerDashboardService(JobApplicationRepository jobApplicationRepository,
                                  RoadmapTaskRepository roadmapTaskRepository,
                                  UserProfileRepository userProfileRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.roadmapTaskRepository = roadmapTaskRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public Map<String, Object> getDashboardSummary() {
        List<JobApplication> applications = jobApplicationRepository.findAll();
        long totalTasks = roadmapTaskRepository.count();
        long completedTasks = roadmapTaskRepository.countByCompleted(true);
        Optional<UserProfile> latestProfile = userProfileRepository.findFirstByOrderByIdDesc();

        long wishlistCount = applications.stream().filter(a -> a.getStatus() == JobApplication.ApplicationStatus.WISHLIST).count();
        long appliedCount = applications.stream().filter(a -> a.getStatus() == JobApplication.ApplicationStatus.APPLIED).count();
        long interviewCount = applications.stream().filter(a -> a.getStatus() == JobApplication.ApplicationStatus.INTERVIEW).count();
        long offerCount = applications.stream().filter(a -> a.getStatus() == JobApplication.ApplicationStatus.OFFER).count();

        double averageMatchScore = applications.stream()
                .filter(a -> a.getMatchPercentage() != null)
                .mapToInt(JobApplication::getMatchPercentage)
                .average()
                .orElse(0.0);

        Map<String, Object> response = new HashMap<>();
        response.put("totalApplications", applications.size());
        response.put("appliedCount", appliedCount);
        response.put("interviewCount", interviewCount);
        response.put("offerCount", offerCount);
        response.put("wishlistCount", wishlistCount);
        response.put("averageMatchScore", Math.round(averageMatchScore));
        response.put("totalRoadmapTasks", totalTasks);
        response.put("completedRoadmapTasks", completedTasks);
        response.put("roadmapProgressPercent", totalTasks > 0 ? Math.round((double) completedTasks / totalTasks * 100) : 0);
        response.put("latestProfile", latestProfile.orElse(null));

        return response;
    }
}
