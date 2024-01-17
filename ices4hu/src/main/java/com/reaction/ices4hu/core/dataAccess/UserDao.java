package com.reaction.ices4hu.core.dataAccess;

import com.reaction.ices4hu.core.entities.users.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDao extends JpaRepository<User, Long> {
    User findByEmail(String email);

}
