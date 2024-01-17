package com.reaction.ices4hu.business.abstracts;

import com.reaction.ices4hu.core.entities.Survey;

import java.util.List;

public interface SurveyService {
    Survey createSurvey(Survey survey);

    List<Survey> getAllSurveys();

    Survey editSurvey(Survey survey);

    List<Survey> getSurveyByInstructorId(Long instructorId);

    Survey getSurveyBySurveyId(Long surveyId);

    List<Survey> getSurveyWithCourseId(Long courseId);

    void deleteSurvey(Survey survey);
}
