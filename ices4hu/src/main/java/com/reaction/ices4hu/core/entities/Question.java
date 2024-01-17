package com.reaction.ices4hu.core.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Table(name = "Questions")
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "questionId")
    private Long questionId;

    @Column(name = "description")
    private String description;

    @Column(name = "isCommon")
    private boolean isCommon;

    @ManyToMany(mappedBy = "questions")
    @JsonBackReference
    private List<Survey> surveys;

}
