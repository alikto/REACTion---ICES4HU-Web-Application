package com.reaction.ices4hu.business.concretes;

import com.reaction.ices4hu.business.abstracts.SurveyService;
import com.reaction.ices4hu.core.dataAccess.SurveyDao;
import com.reaction.ices4hu.core.entities.Survey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class SurveyManager implements SurveyService {

    private final SurveyDao surveyDao;

    @Autowired
    public SurveyManager(SurveyDao surveyDao) {
        super();
        this.surveyDao = surveyDao;
    }

    @Override
    public Survey createSurvey(Survey survey){
        this.surveyDao.save(survey);
        return survey;
    }

    @Override
    public List<Survey> getAllSurveys() {
        return this.surveyDao.findAll();
    }

    @Override
    public Survey editSurvey(Survey survey) {
        return this.surveyDao.save(survey);
    }

    @Override
    public List<Survey> getSurveyByInstructorId(Long instructorId) {
        return this.surveyDao.getSurveyByInstructorId(instructorId);
    }

    @Override
    public Survey getSurveyBySurveyId(Long surveyId) {
        return this.surveyDao.getSurveyBySurveyId(surveyId);
    }

    @Override
    public List<Survey> getSurveyWithCourseId(Long courseId) {
        return this.surveyDao.getSurveyByCourseId(courseId);

    }

    @Override
    public void deleteSurvey(Survey survey) {
        this.surveyDao.delete(survey);
    }
}
