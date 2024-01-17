package com.reaction.ices4hu.core.dataAccess;

import com.reaction.ices4hu.core.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionDao extends JpaRepository<Question, Long> {

    List<Question> findByIsCommonTrue();

    Question findByQuestionId(Long questionId);
}
