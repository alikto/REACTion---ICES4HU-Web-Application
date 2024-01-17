package com.reaction.ices4hu.core.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.reaction.ices4hu.core.entities.users.Instructor;
import com.reaction.ices4hu.core.entities.users.Student;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Table(name = "Courses")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@AllArgsConstructor
@NoArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "courseId")
    private Long courseId;

    @NotBlank
    @Column(name = "courseCode")
    private String courseCode;

    @Column(name = "courseTitle")
    private String courseTitle;

    @Column(name = "departmentName")
    private String departmentName;

    @Column(name = "credit")
    private Double credit;

    @Column(name = "isMandatory")
    private Boolean isMandatory;

    @NotBlank
    @Column(name = "semester")
    private String semester;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private Instructor instructor;

    @ManyToMany
    @JoinTable(
            name = "course_student",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id"))
    private List<Student> students;

}
