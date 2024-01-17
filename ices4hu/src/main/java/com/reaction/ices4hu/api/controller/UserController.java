package com.reaction.ices4hu.api.controller;

import com.reaction.ices4hu.business.abstracts.UserService;
import com.reaction.ices4hu.core.entities.users.*;
import com.reaction.ices4hu.core.requests.LoginRequest;
import jakarta.persistence.DiscriminatorValue;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        super();
        this.userService = userService;
    }


    @PostMapping(value = "/add/{userType}")
    public ResponseEntity<?> add(@Valid @RequestBody String str, @PathVariable String userType) throws JSONException {
        //TO-DO
        JSONObject jsonObject = new JSONObject(str);

        String userEmail = jsonObject.get("email").toString();
        User user = userService.findByEmail(userEmail);
        if (user != null) return ResponseEntity.status(HttpStatus.CONFLICT).body("User Already Exists");


        switch (userType) {
            case "Student":
                Student student = new Student();
                student.setEmail(jsonObject.get("email").toString());
                student.setPassword(jsonObject.get("password").toString());
                student.setName(jsonObject.get("name").toString());
                student.setSurname(jsonObject.get("surname").toString());
                student.setDepartmentName(jsonObject.get("departmentName").toString());
                student.setStudentId(Long.parseLong(jsonObject.get("studentId").toString()));
                return ResponseEntity.ok(this.userService.add(student));
            case "Instructor":
                Instructor instructor = new Instructor();
                instructor.setEmail(jsonObject.get("email").toString());
                instructor.setPassword(jsonObject.get("password").toString());
                instructor.setName(jsonObject.get("name").toString());
                instructor.setSurname(jsonObject.get("surname").toString());
                instructor.setDepartmentName(jsonObject.get("departmentName").toString());
                return ResponseEntity.ok(this.userService.add(instructor));
            case "DepartmentManager":
                DepartmentManager departmentManager = new DepartmentManager();
                departmentManager.setEmail(jsonObject.get("email").toString());
                departmentManager.setPassword(jsonObject.get("password").toString());
                departmentManager.setName(jsonObject.get("name").toString());
                departmentManager.setSurname(jsonObject.get("surname").toString());
                departmentManager.setDepartmentName(jsonObject.get("departmentName").toString());
                return ResponseEntity.ok(this.userService.add(departmentManager));
            case "Administrator":
                Administrator administrator = new Administrator();
                administrator.setEmail(jsonObject.get("email").toString());
                administrator.setPassword(jsonObject.get("password").toString());
                administrator.setName(jsonObject.get("name").toString());
                administrator.setSurname(jsonObject.get("surname").toString());
                //administrator.setAdminId(Long.parseLong(jsonObject.get("adminId").toString()));
                return ResponseEntity.ok(this.userService.add(administrator));
            default:
                return ResponseEntity.ok("Invalid user type");
        }


    }

    @GetMapping("/getAll")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (!users.isEmpty()) {
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/login")

    /**
     * Handles a login request from a client
     *
     * @param loginRequest The login request object containing the email, password, and user type
     * @return A response entity containing the user object if the login is successful, or an error message if the login is unsuccessful
     */
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Find a user with the given email
        User user = userService.findByEmail(loginRequest.getEmail());

        // If the user is not found, return an unauthorized response with a message
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User Not Found");
        } else { //If the User found
            // Check if the given password matches the user's password
            user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

            // If the password is invalid, return an unauthorized response with a message
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect Password");
            }

            // Get the user's discriminator value and compare it with the user type provided in the login request
            String userType = user.getClass().getAnnotation(DiscriminatorValue.class).value();
            if (loginRequest.getUserType().equals(userType)) {
                // If the user types match, return a response entity with a 200 OK status and the user object
                return ResponseEntity.ok(user);
            } else {
                // If the user types do not match, return an unauthorized response with a message
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong Type of Login");
            }
        }
    }

    @PatchMapping(value = "/update")
    public ResponseEntity<?> updateUser(@Valid @RequestBody User user) {
        User existingUser = userService.getUserById(user.getUserId());
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }
        existingUser = userService.updateUser(user);
        return ResponseEntity.ok(existingUser);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            userService.delete(id);
            return ResponseEntity.ok("User deleted");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/department-managers-instructors/{userId}")
    public ResponseEntity<?> getInstructorsByDepartmentManager(@PathVariable Long userId) {

        User user = userService.getUserById(userId);
        if (user != null) {

            if (!(user instanceof DepartmentManager departmentManager)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not Department Manager");
            }

            String departmentName = departmentManager.getDepartmentName();

            List<Instructor> instructors = userService.getInstructorsByDepartmentManager(departmentName);
            return ResponseEntity.ok(instructors);

        } else {
            // Handle the case when DepartmentManager is not found
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Department Manager not found");
        }

    }

    @PatchMapping(value = "/newPasswordRequest/{userId}")
    public ResponseEntity<?> newPasswordRequest(@PathVariable Long userId) {
        User existingUser = userService.getUserById(userId);
        if (existingUser == null) {
            return ResponseEntity.notFound().build();
        }
        existingUser.setPassword("newPassword123");
        return ResponseEntity.ok(userService.updateUser(existingUser));
    }

    @GetMapping("/test")
    public String test() {
        return "test";
    }

}
