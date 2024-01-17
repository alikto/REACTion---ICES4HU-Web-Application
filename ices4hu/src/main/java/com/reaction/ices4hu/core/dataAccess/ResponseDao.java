package com.reaction.ices4hu.core.dataAccess;

import com.reaction.ices4hu.core.entities.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseDao extends JpaRepository<Response, Long> {
    List<Response> getResponsesByQuestionId(Long questionId);

    List<Response> getResponsesBySurveyIdAndStudentId(Long surveyId, Long studentId);

    Response getResponseBySurveyIdAndStudentId(Long surveyId, Long studentId);

    List<Response> getResponsesBySurveyId(Long surveyId);
}
