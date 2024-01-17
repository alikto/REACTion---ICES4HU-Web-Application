package com.reaction.ices4hu.core.dtos;


public class QuestionDTO {

    private Long questionId;


    private String description;

    public QuestionDTO(Long questionId, String description) {
        this.questionId = questionId;
        this.description = description;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}