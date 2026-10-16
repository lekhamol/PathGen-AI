package com.career.copilot.controller;

import com.career.copilot.model.JobApplication;
import com.career.copilot.model.RoadmapTask;
import com.career.copilot.repository.JobApplicationRepository;
import com.career.copilot.repository.RoadmapTaskRepository;
import com.career.copilot.service.AiIntegrationService;
import com.career.copilot.service.CareerDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/career")
public class CareerController {

    private final AiIntegrationService aiService;
    private final CareerDashboardService dashboardService;
    private final JobApplicationRepository jobApplicationRepository;
    private final RoadmapTaskRepository roadmapTaskRepository;

    public CareerController(AiIntegrationService aiService,
                            CareerDashboardService dashboardService,
                            JobApplicationRepository jobApplicationRepository,
                            RoadmapTaskRepository roadmapTaskRepository) {
        this.aiService = aiService;
        this.dashboardService = dashboardService;
        this.jobApplicationRepository = jobApplicationRepository;
        this.roadmapTaskRepository = roadmapTaskRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }

    @PostMapping("/resume/analyze")
    public ResponseEntity<?> analyzeResume(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(aiService.analyzeResume(payload));
    }

    @PostMapping("/job/match")
    public ResponseEntity<?> matchJob(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(aiService.matchJob(payload));
    }

    @PostMapping("/roadmap/generate")
    public ResponseEntity<?> generateRoadmap(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(aiService.generateRoadmap(payload));
    }

    @GetMapping("/roadmap/tasks")
    public ResponseEntity<List<RoadmapTask>> getRoadmapTasks() {
        return ResponseEntity.ok(roadmapTaskRepository.findAllByOrderByWeekNumberAscIdAsc());
    }

    @PostMapping("/roadmap/tasks/batch")
    public ResponseEntity<List<RoadmapTask>> saveRoadmapTasks(@RequestBody List<RoadmapTask> tasks) {
        return ResponseEntity.ok(roadmapTaskRepository.saveAll(tasks));
    }

    @PutMapping("/roadmap/tasks/{id}/toggle")
    public ResponseEntity<?> toggleRoadmapTask(@PathVariable Long id) {
        return roadmapTaskRepository.findById(id).map(task -> {
            boolean nextState = !Boolean.TRUE.equals(task.getCompleted());
            task.setCompleted(nextState);
            task.setCompletedAt(nextState ? LocalDateTime.now() : null);
            return ResponseEntity.ok(roadmapTaskRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/interview/start")
    public ResponseEntity<?> startInterview(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(aiService.startInterview(payload));
    }

    @PostMapping("/interview/evaluate")
    public ResponseEntity<?> evaluateInterview(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(aiService.evaluateInterview(payload));
    }

    // --- Job Application Tracker CRUD ---
    @GetMapping("/applications")
    public ResponseEntity<List<JobApplication>> getApplications() {
        return ResponseEntity.ok(jobApplicationRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/applications")
    public ResponseEntity<JobApplication> createApplication(@RequestBody JobApplication application) {
        return ResponseEntity.ok(jobApplicationRepository.save(application));
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        return jobApplicationRepository.findById(id).map(app -> {
            String newStatus = statusUpdate.get("status");
            if (newStatus != null) {
                app.setStatus(JobApplication.ApplicationStatus.valueOf(newStatus.toUpperCase()));
            }
            return ResponseEntity.ok(jobApplicationRepository.save(app));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/applications/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id) {
        if (jobApplicationRepository.existsById(id)) {
            jobApplicationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
