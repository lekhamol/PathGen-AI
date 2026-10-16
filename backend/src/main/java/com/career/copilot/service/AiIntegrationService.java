package com.career.copilot.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Service
public class AiIntegrationService {

    private final RestTemplate restTemplate;

    @Value("${ai-service.url}")
    private String aiServiceUrl;

    public AiIntegrationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Object analyzeResume(Map<String, Object> payload) {
        String url = aiServiceUrl + "/api/resume/analyze";
        return postToAiService(url, payload);
    }

    public Object matchJob(Map<String, Object> payload) {
        String url = aiServiceUrl + "/api/job/match";
        return postToAiService(url, payload);
    }

    public Object generateRoadmap(Map<String, Object> payload) {
        String url = aiServiceUrl + "/api/roadmap/generate";
        return postToAiService(url, payload);
    }

    public Object startInterview(Map<String, Object> payload) {
        String url = aiServiceUrl + "/api/interview/start";
        return postToAiService(url, payload);
    }

    public Object evaluateInterview(Map<String, Object> payload) {
        String url = aiServiceUrl + "/api/interview/evaluate";
        return postToAiService(url, payload);
    }

    private Object postToAiService(String url, Map<String, Object> payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<Object> response = restTemplate.postForEntity(url, request, Object.class);
            return response.getBody();
        } catch (Exception e) {
            log.warn("Could not reach Python AI service at {}: {}", url, e.getMessage());
            // Return informative fallback error payload
            return Map.of(
                "error", true,
                "message", "AI service connection error. Please ensure the Python AI service is running on port 8000.",
                "details", e.getMessage()
            );
        }
    }
}
