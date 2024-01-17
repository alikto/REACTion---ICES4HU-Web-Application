package com.reaction.ices4hu.business.concretes;

import com.reaction.ices4hu.business.abstracts.CourseService;
import com.reaction.ices4hu.core.dataAccess.CourseDao;
import com.reaction.ices4hu.core.entities.Course;
import com.reaction.ices4hu.core.entities.users.Instructor;
import com.reaction.ices4hu.core.entities.users.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseManager implements CourseService {

    private final CourseDao courseDao;

    @Autowired
    public CourseManager(CourseDao courseDao) {
        super();
        this.courseDao = courseDao;
    }

    @Override
    public Course findByCourseCode(String courseId) {
        return courseDao.findByCourseCode(courseId);

    }


    @Override
    public Course add(Course course) {
        this.courseDao.save(course);
        return course;
    }

    @Override
    public void delete(Long courseId) {
        courseDao.deleteById(courseId);
    }

    public Course findCourse(Course course) {
        // Retrieve all courses from the database
        List<Course> courses = courseDao.findAll();

        // Iterate over each course and check if it matches the given course
        for (Course c : courses) {
            if (c.getCourseCode().equals(course.getCourseCode()) &&
                    c.getSemester().equals(course.getSemester())) {
                return c;
            }
        }
        // If no matching course was found, return null
        return null;
    }

    @Override
    public Course save(Course course) {
        this.courseDao.save(course);
        return course;
    }

    @Override
    public List<Course> getAllCourses() {
        return this.courseDao.findAll();
    }

    @Override
    public List<Course> getCoursesByDepartmentName(String departmentName) {
        List<Course> courses = courseDao.findAll();
        List<Course> coursesByDepartmentName = new ArrayList<>();
        for (Course c : courses) {
            if (c.getDepartmentName().equals(departmentName)) {
                coursesByDepartmentName.add(c);
            }
        }
        return coursesByDepartmentName;
    }

    @Override
    public List<Course> getCoursesByStudent(Student student) {
        List<Course> courses = courseDao.findAll();
        List<Course> coursesByStudent = new ArrayList<>();
        for (Course c : courses) {
            if (c.getStudents().contains(student)) {
                coursesByStudent.add(c);
            }
        }
        return coursesByStudent;
    }

    @Override
    public List<Course> getCoursesByInstructor(Instructor instructor) {
        List<Course> courses = courseDao.findAll();
        List<Course> coursesByInstructor = new ArrayList<>();
        for (Course c : courses) {
            if (c.getInstructor().equals(instructor)) {
                coursesByInstructor.add(c);
            }
        }
        if (coursesByInstructor.size()==0){
            return null;
        }
        return coursesByInstructor;
    }

    @Override
    public Course getCourseById(Long courseId) {
        return courseDao.findById(courseId).orElse(null);
    }


}
