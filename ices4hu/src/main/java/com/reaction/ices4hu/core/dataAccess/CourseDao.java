package com.reaction.ices4hu.core.dataAccess;

import com.reaction.ices4hu.core.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CourseDao extends JpaRepository<Course, Long> {
    Course findByCourseCode(String courseCode);

}
