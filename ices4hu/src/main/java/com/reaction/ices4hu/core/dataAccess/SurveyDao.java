package com.reaction.ices4hu.core.dataAccess;

import com.reaction.ices4hu.core.entities.Survey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyDao extends JpaRepository<Survey, Long> {
    List<Survey> getSurveyByInstructorId(Long instructorId);

    Survey getSurveyBySurveyId(Long surveyId);

    List<Survey> getSurveyByCourseId(Long courseId);
}
