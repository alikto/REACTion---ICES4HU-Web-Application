package com.reaction.ices4hu.business.concretes;

import com.reaction.ices4hu.business.abstracts.QuestionService;
import com.reaction.ices4hu.core.dataAccess.QuestionDao;
import com.reaction.ices4hu.core.entities.Question;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionManager implements QuestionService {

    private final QuestionDao questionDao;

    @Autowired
    public QuestionManager(QuestionDao questionDao) {
        super();
        this.questionDao = questionDao;
    }

    @Override
    public void add(Question question) {
        this.questionDao.save(question);
    }

    @Override
    public List<Question> getCommonQuestions() {
        return questionDao.findByIsCommonTrue();
    }
    @Override
    public Question getQuestionById(Long questionId){
        return questionDao.findByQuestionId(questionId);
    }

    @Override
    public void delete(Question question) {
        questionDao.delete(question);
    }

    @Override
    public void update(Question question) {
        Question existingQuestion = questionDao.findById(question.getQuestionId()).orElse(null);
        existingQuestion.setDescription(question.getDescription());
        questionDao.save(existingQuestion);
    }

}
