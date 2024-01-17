package com.reaction.ices4hu.core.entities;

import com.reaction.ices4hu.core.entities.users.Instructor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Table(name = "Surveys")
@AllArgsConstructor
@NoArgsConstructor
public class Survey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "surveyId")
    private Long surveyId;

    @Column(name = "surveyType")
    private String surveyType;

    @Column(name = "courseId")
    private Long courseId;

    @Column(name = "instructorId")
    private Long instructorId;

    @Column(name = "isPublished")
    private Boolean isPublished;

    @ManyToMany
    @JoinTable(
            name = "survey_instructor",
            joinColumns = @JoinColumn(name = "survey_id"),
            inverseJoinColumns = @JoinColumn(name = "instructor_id")
    )
    private List<Instructor> instructors;

    @ManyToMany
    @JoinTable(
            name = "survey_question",
            joinColumns = @JoinColumn(name = "survey_id"),
            inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions;

}
