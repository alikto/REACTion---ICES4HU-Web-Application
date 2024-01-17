package com.reaction.ices4hu.business.abstracts;

import com.reaction.ices4hu.core.entities.Response;
import com.reaction.ices4hu.core.entities.Survey;
import com.reaction.ices4hu.core.entities.users.Student;

import java.util.List;

public interface ResponseService {
    Response createResponse(Response response);

    Response getResponseById(Long responseId);

    Response updateResponse(Response response);

    void deleteResponse(Long responseId);

    Double calculateAverageRatingByQuestionId(Long questionId);

    List<Response> getResponsesBySurveyAndStudent(Survey survey, Student student);

    Iterable<Response> getAllResponses();

    List<Response> getResponsesBySurveyIdAndStudentId(Long surveyId, Long studentId);

    List<Response> getResponsesBySurveyId(Long surveyId);
}
