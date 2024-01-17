package com.reaction.ices4hu.business.abstracts;

import com.reaction.ices4hu.core.entities.users.Instructor;
import com.reaction.ices4hu.core.entities.users.User;

import java.util.List;

public interface UserService {
    User add(User user);

    User getUserById(Long id);

    List<User> getAllUsers();

    User login(String email, String password);

    User findByEmail(String email);

    User updateUser(User user);

    void delete(Long id);

    List<Instructor> getInstructorsByDepartmentManager(String departmentName);
}
