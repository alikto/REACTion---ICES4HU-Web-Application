package com.reaction.ices4hu.core.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "Responses")
@AllArgsConstructor
@NoArgsConstructor
public class Response {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "responseId")
    private Long responseId;

    @Column(name = "questionId")
    private Long questionId;

    @Column(name = "studentId")
    private Long studentId;

    @Column(name = "surveyId")
    private Long surveyId;

    @Column(name = "rate")
    private int rate;
}
