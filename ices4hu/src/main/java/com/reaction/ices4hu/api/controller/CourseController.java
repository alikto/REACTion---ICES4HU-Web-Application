package com.reaction.ices4hu.api.controller;

import com.reaction.ices4hu.business.abstracts.CourseService;
import com.reaction.ices4hu.business.abstracts.UserService;
import com.reaction.ices4hu.core.dtos.CourseDTO;
import com.reaction.ices4hu.core.entities.Course;
import com.reaction.ices4hu.core.entities.users.DepartmentManager;
import com.reaction.ices4hu.core.entities.users.Instructor;
import com.reaction.ices4hu.core.entities.users.Student;
import com.reaction.ices4hu.core.entities.users.User;
import com.reaction.ices4hu.core.requests.AssignCourseRequest;
import com.reaction.ices4hu.core.requests.DeleteCourseRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/api/courses")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class CourseController {

    private CourseService courseService;
    private UserService userService;

    @Autowired
    public CourseController(CourseService courseService, UserService userService) {
        super();
        this.courseService = courseService;
        this.userService = userService;
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        if (course != null) {
            CourseDTO courseDTO = new CourseDTO(
                    course.getCourseId(),
                    course.getCourseCode(),
                    course.getCourseTitle(),
                    course.getSemester(),
                    course.getInstructor().getUserId());

            return ResponseEntity.ok(courseDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add/")
    public ResponseEntity<?> add(@RequestBody String str) throws JSONException {
        Course course1 = new Course();
        JSONObject jsonObject = new JSONObject(str);
        course1.setCourseCode(jsonObject.get("courseCode").toString());
        course1.setCourseTitle(jsonObject.get("courseTitle").toString());
        course1.setDepartmentName(jsonObject.get("departmentName").toString());
        course1.setCredit(Double.parseDouble(jsonObject.get("credit").toString()));
        course1.setIsMandatory(Boolean.parseBoolean(jsonObject.get("isMandatory").toString()));
        course1.setSemester(jsonObject.get("semester").toString());

        try {
            // check if the course already exists in the database
            if (this.courseService.findCourse(course1) != null) {
                return ResponseEntity.badRequest().body("Course Already Exists");
            } else {
                // if the course does not exist, save it to the database
                return ResponseEntity.ok(courseService.add(course1));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding course: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/")
    public ResponseEntity<?> deleteCourse(@RequestBody DeleteCourseRequest deleteCourseRequest) {
        Course deleteCourse = new Course();
        deleteCourse.setCourseCode(deleteCourseRequest.getCourseCode());
        deleteCourse.setSemester(deleteCourseRequest.getSemester());
        Course courseToDelete = courseService.findCourse(deleteCourse);
        System.out.println("course:" + courseToDelete);
        if (courseToDelete == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found.");
        }
        courseService.delete(courseToDelete.getCourseId());
        return ResponseEntity.ok("Course " + deleteCourseRequest.getCourseCode() + " has been successfully deleted.");
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        if (!courses.isEmpty()) {
            return ResponseEntity.ok(courses);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping(value = "/assign-instructor/")
    public ResponseEntity<?> assignInstructorToCourse(@RequestBody AssignCourseRequest assignCourseRequest) {
        try {
            Course findCourse = new Course();
            findCourse.setCourseCode(assignCourseRequest.getCourseCode());
            findCourse.setSemester(assignCourseRequest.getSemester());
            Course course = courseService.findCourse(findCourse);
            if (course == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found.");
            }

            User instructor = userService.getUserById(assignCourseRequest.getUserId());
            if (instructor == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Instructor not found.");
            } else if (!(instructor instanceof Instructor)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is not an instructor.");
            }

            // Assign the instructor to the course
            course.setInstructor((Instructor) instructor);
            courseService.save(course);
            List<Course> courses = ((Instructor) instructor).getCourses();

            return ResponseEntity.ok("Instructor assigned to the course successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error assigning instructor to the course: " + e.getMessage());
        }
    }


    @PostMapping(value = "/assign-student/")
    public ResponseEntity<?> assignStudentToCourse(@RequestBody AssignCourseRequest assignCourseRequest) {
        try {
            Course findCourse = new Course();
            findCourse.setCourseCode(assignCourseRequest.getCourseCode());
            findCourse.setSemester(assignCourseRequest.getSemester());
            Course course = courseService.findCourse(findCourse);
            if (course == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found.");
            }

            User student = userService.getUserById(assignCourseRequest.getUserId());
            if (student == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found.");
            } else if (!(student instanceof Student)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is not a student.");
            }

            // Assign the student to the course
            course.getStudents().add((Student) student);
            courseService.save(course);
            List<Student> students = course.getStudents();

            return ResponseEntity.ok("Student assigned to the course successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error assigning student to the course: " + e.getMessage());
        }
    }

    @GetMapping("/department-managers-courses/{userId}")
    public ResponseEntity<?> getCoursesByDepartmentManager(@PathVariable Long userId) {
        // Retrieve the DepartmentManager entity based on the user_id
        User user = userService.getUserById(userId);
        if (user != null) {

            if (!(user instanceof DepartmentManager departmentManager)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not Department Manager");
            }

            String departmentName = departmentManager.getDepartmentName();


            List<CourseDTO> courseDTOS = convertToDTO(courseService.getCoursesByDepartmentName(departmentName));
            return ResponseEntity.ok(courseDTOS);

        } else {
            // Handle the case when DepartmentManager is not found
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Department Manager not found");
        }

    }


    @GetMapping("/students-courses/{userId}")
    public ResponseEntity<?> getCoursesByStudent(@PathVariable Long userId) {
        // Retrieve the Student entity based on the user_id
        User user = userService.getUserById(userId);
        if (user != null) {

            if (!(user instanceof Student student)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not Student");
            }

            List<CourseDTO> courseDTOS = convertToDTO(courseService.getCoursesByStudent(student));
            return ResponseEntity.ok(courseDTOS);

        } else {
            // Handle the case when Student is not found
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Student not found");
        }

    }

    @GetMapping("/instructors-courses/{userId}")
    public ResponseEntity<?> getCoursesByInstructor(@PathVariable Long userId) {
        // Retrieve the Student entity based on the user_id
        User user = userService.getUserById(userId);
        if (user != null) {

            if (!(user instanceof Instructor instructor)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not Instructor");
            }

            List<CourseDTO> courseDTOS = convertToDTO(courseService.getCoursesByInstructor(instructor));
            return ResponseEntity.ok(courseDTOS);

        } else {
            // Handle the case when Student is not found
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Instructor not found");
        }

    }

    public static List<CourseDTO> convertToDTO(List<Course> courses) {
        List<CourseDTO> courseDTOS = new ArrayList<>();
        for (Course c : courses) {
            CourseDTO courseDTO = new CourseDTO(
                    c.getCourseId(), c.getCourseCode(), c.getCourseTitle(), c.getSemester(),
                    c.getInstructor().getUserId());
            courseDTOS.add(courseDTO);
        }
        return courseDTOS;
    }

}
