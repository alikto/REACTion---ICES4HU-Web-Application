package com.reaction.ices4hu.core.entities.users;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
@DiscriminatorValue("DepartmentManager")
public class DepartmentManager extends User {

    @Column(name = "departmentName")
    private String departmentName;

    @Override
    public String toString() {
        return "Department Manager";
    }
}
