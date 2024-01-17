package com.reaction.ices4hu.api.controller;

import com.reaction.ices4hu.business.abstracts.QuestionService;
import com.reaction.ices4hu.business.abstracts.ResponseService;
import com.reaction.ices4hu.business.abstracts.UserService;
import com.reaction.ices4hu.core.entities.Question;
import com.reaction.ices4hu.core.entities.Response;
import com.reaction.ices4hu.core.entities.users.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/api/responses")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class ResponseController {

    private ResponseService responseService;

    private QuestionService questionService;


    @Autowired
    public ResponseController(ResponseService responseService, QuestionService questionService) {
        this.responseService = responseService;
        this.questionService = questionService;
    }

    @PostMapping("/createResponse")
    public ResponseEntity<Response> createResponse(@RequestBody Response response) {
        Response createdResponse = responseService.createResponse(response);
        return ResponseEntity.ok(createdResponse);
    }

    @GetMapping("/getResponse/{responseId}")
    public ResponseEntity<Response> getResponseById(@PathVariable Long responseId) {
        Response response = responseService.getResponseById(responseId);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getAllResponses")
    public ResponseEntity<Iterable<Response>> getAllResponses() {
        Iterable<Response> responses = responseService.getAllResponses();
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/editResponse")
    public ResponseEntity<Response> editResponse(@RequestBody Response response) {
        Response existingResponse = responseService.getResponseById(response.getResponseId());
        if (existingResponse == null) {
            return ResponseEntity.notFound().build();
        }
        Response updatedResponse = responseService.updateResponse(response);
        return ResponseEntity.ok(updatedResponse);
    }


    @DeleteMapping("/deleteResponse/{responseId}")
    public ResponseEntity<?> deleteResponse(@PathVariable Long responseId) {
        Response existingResponse = responseService.getResponseById(responseId);
        if (existingResponse == null) {
            return ResponseEntity.notFound().build();
        }
        responseService.deleteResponse(responseId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/averageRating/{questionId}")
    public ResponseEntity<Double> calculateAverageRatingByQuestionId(@PathVariable Long questionId) {

        double averageRating = responseService.calculateAverageRatingByQuestionId(questionId);
        return ResponseEntity.ok(averageRating);
    }

    @GetMapping("/getResponsesBySurveyIdAndStudentId/{surveyId}/{studentId}")
    public ResponseEntity<List<List<String>>> getResponseListBySurveyIdAndStudentId(@PathVariable Long surveyId, @PathVariable Long studentId) {
        List<Response> responseList = responseService.getResponsesBySurveyIdAndStudentId(surveyId, studentId);


        if (responseList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<List<String>> questionAndRateList = new ArrayList<>();

        for (Response response : responseList) {
            Question question = questionService.getQuestionById(response.getQuestionId());
            String questionDescription = question.getDescription();
            int rate = response.getRate();
            List<String> newList = new ArrayList<>();
            newList.add(questionDescription);
            newList.add(String.valueOf(rate));
            questionAndRateList.add(newList);

        }

        return ResponseEntity.ok(questionAndRateList);

    }

    @GetMapping("/getStudentsIdBySurveyId/{surveyId}")
    public ResponseEntity<List<Long>> getStudentsIdBySurveyId(@PathVariable Long surveyId) {
        List<Response> responseList = responseService.getResponsesBySurveyId(surveyId);

        if (responseList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Long> studentIds = new ArrayList<>();
        for (Response response : responseList) {
            if (!studentIds.contains(response.getStudentId())){
                studentIds.add(response.getStudentId());
            }

        }

        return ResponseEntity.ok(studentIds);
    }


}
