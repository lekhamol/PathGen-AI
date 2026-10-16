package com.career.copilot.repository;

import com.career.copilot.model.RoadmapTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapTaskRepository extends JpaRepository<RoadmapTask, Long> {
    List<RoadmapTask> findAllByOrderByWeekNumberAscIdAsc();
    List<RoadmapTask> findByCompleted(Boolean completed);
    long countByCompleted(Boolean completed);
}
