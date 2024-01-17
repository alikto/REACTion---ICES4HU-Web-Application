package com.reaction.ices4hu.business.concretes;

import com.reaction.ices4hu.business.abstracts.UserService;
import com.reaction.ices4hu.core.dataAccess.UserDao;
import com.reaction.ices4hu.core.entities.users.Instructor;
import com.reaction.ices4hu.core.entities.users.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserManager implements UserService {

    private final UserDao userDao;

    @Autowired
    public UserManager(UserDao userDao) {
        super();
        this.userDao = userDao;
    }

    @Override
    public User add(User user) {
        this.userDao.save(user);
        return user;
    }

    @Override
    public User getUserById(Long id) {
        return userDao.findById(id).orElse(null);
    }

    @Override
    public List<User> getAllUsers() {
        return userDao.findAll();
    }

    @Override
    public User login(String email, String password) {
        User user = userDao.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {

            return user;
        } else {
            return null;
        }
    }

    @Override
    public User findByEmail(String email) {
        User user = userDao.findByEmail(email);
        return user;

    }

    @Override
    public User updateUser(User user) {
        User existingUser = userDao.findById(user.getUserId()).orElse(null);
        if (existingUser == null) {
            return null;
        }
        existingUser.setName(user.getName());
        existingUser.setSurname(user.getSurname());
        existingUser.setPassword(user.getPassword());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhoneNumber(user.getPhoneNumber());
        existingUser.setAddress(user.getAddress());
        return userDao.save(existingUser);
    }

    @Override
    public void delete(Long id) {
        userDao.deleteById(id);
    }

    @Override
    public List<Instructor> getInstructorsByDepartmentManager(String departmentName) {
        List<User> users = userDao.findAll();
        List<Instructor> instructorsByDepartmentName = new ArrayList<>();
        for (User user : users) {
            if (user instanceof Instructor instructor && instructor.getDepartmentName().equals(departmentName)) {
                instructorsByDepartmentName.add(instructor);
            }

        }
        return instructorsByDepartmentName;
    }

}
