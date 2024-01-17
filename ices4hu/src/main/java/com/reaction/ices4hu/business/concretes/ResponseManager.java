package com.reaction.ices4hu.business.concretes;

import com.reaction.ices4hu.business.abstracts.ResponseService;
import com.reaction.ices4hu.core.dataAccess.ResponseDao;
import com.reaction.ices4hu.core.entities.Response;
import com.reaction.ices4hu.core.entities.Survey;
import com.reaction.ices4hu.core.entities.users.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResponseManager implements ResponseService {

    private final ResponseDao responseDao;

    @Autowired
    public ResponseManager(ResponseDao responseDao) {
        this.responseDao = responseDao;
    }

    @Override
    public Response createResponse(Response response) {
        return responseDao.save(response);
    }

    @Override
    public Response getResponseById(Long responseId) {
        return responseDao.findById(responseId).orElse(null);
    }

    @Override
    public Response updateResponse(Response response) {
        return responseDao.save(response);
    }

    @Override
    public void deleteResponse(Long responseId) {
        responseDao.deleteById(responseId);
    }

    @Override
    public Double calculateAverageRatingByQuestionId(Long questionId) {
        List<Response> responses = responseDao.getResponsesByQuestionId(questionId);

        if (responses.isEmpty()) {
            return 0.0;
        }

        double sum = responses.stream()
                .mapToInt(Response::getRate)
                .sum();

        return sum / responses.size();
    }

    @Override
    public List<Response> getResponsesBySurveyAndStudent(Survey survey, Student student) {
        return responseDao.getResponsesBySurveyIdAndStudentId(survey.getSurveyId(), student.getStudentId());
    }

    @Override
    public Iterable<Response> getAllResponses() {
        return responseDao.findAll();
    }

    @Override
    public List<Response> getResponsesBySurveyIdAndStudentId(Long surveyId, Long studentId) {
        return responseDao.getResponsesBySurveyIdAndStudentId(surveyId, studentId);
    }

    @Override
    public List<Response> getResponsesBySurveyId(Long surveyId) {
        return responseDao.getResponsesBySurveyId(surveyId);
    }


}
