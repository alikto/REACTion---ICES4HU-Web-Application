package com.reaction.ices4hu.business.abstracts;

import com.reaction.ices4hu.core.entities.Course;
import com.reaction.ices4hu.core.entities.users.Instructor;
import com.reaction.ices4hu.core.entities.users.Student;

import java.util.List;

public interface CourseService {

    Course findByCourseCode(String courseCode);

    Course add(Course course);

    void delete(Long courseId);

    Course findCourse(Course course);


    Course save(Course course);

    List<Course> getAllCourses();

    List<Course> getCoursesByDepartmentName(String departmentName);

    List<Course> getCoursesByStudent(Student student);

    List<Course> getCoursesByInstructor(Instructor instructor);

    Course getCourseById(Long courseId);
}
