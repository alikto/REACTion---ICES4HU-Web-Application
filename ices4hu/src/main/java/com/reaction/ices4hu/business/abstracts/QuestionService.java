package com.reaction.ices4hu.business.abstracts;

import com.reaction.ices4hu.core.entities.Question;

import java.util.List;
import java.util.Optional;

public interface QuestionService {


    void add(Question question);

    List<Question> getCommonQuestions();

    Question getQuestionById(Long questionId);

    void delete(Question question);

    void update(Question question);
}
