package com.reaction.ices4hu.api.controller;


import com.reaction.ices4hu.business.abstracts.QuestionService;
import com.reaction.ices4hu.business.abstracts.SurveyService;
import com.reaction.ices4hu.business.abstracts.UserService;
import com.reaction.ices4hu.core.dtos.QuestionDTO;
import com.reaction.ices4hu.core.entities.Question;
import com.reaction.ices4hu.core.entities.Survey;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/api/questions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class QuestionController {

    private QuestionService questionService;
    private SurveyService surveyService;


    @Autowired
    public QuestionController(QuestionService questionService, SurveyService surverService) {
        super();
        this.questionService = questionService;
        this.surveyService = surverService;
    }

    @PostConstruct
    public void initializeCommonQuestions() {
        List<Question> questionList = new ArrayList<>();
        questionList.add(new Question(1L, "The Instructor satisfactorily responded to questions.", true, null));
        questionList.add(new Question(2L, "Communication with the Instructor was adequate.", true, null));
        questionList.add(new Question(3L, "The Instructor assessed course progress by questioning or using other appropriate means.", true, null));
        questionList.add(new Question(4L, "The communication of information maintained my interest in the classroom or online.", true, null));
        questionList.add(new Question(5L, "The Instructor made clear the applications of the subject matter to my major, to other courses, or to my life.", true, null));
        questionList.add(new Question(6L, "The materials used to support assignments in the course (texts, readings, websites, etc.) were useful.", true, null));
        questionList.add(new Question(7L, " I would rate this Instructor as an effective teacher.", true, null));
        for (Question question : questionList) {
            this.questionService.add(question);
        }
    }

    @GetMapping("/get-common-questions")
    public ResponseEntity<?> getCommonQuestions() {
        List<Question> commonQuestions = questionService.getCommonQuestions();

        if (commonQuestions == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found.");

        List<QuestionDTO> questionDTOs = new ArrayList<>();
        for (Question question : commonQuestions) {
            QuestionDTO questionDTO = new QuestionDTO(question.getQuestionId(), question.getDescription());
            questionDTOs.add(questionDTO);
        }

        return ResponseEntity.ok(questionDTOs);
    }

    @DeleteMapping("/deleteQuestion/{questionId}")
    public ResponseEntity<?> deleteQuestionById(@PathVariable Long questionId){
        Question question = questionService.getQuestionById(questionId);
        if(question == null) return ResponseEntity.badRequest().body("Question not found");
        if (question.getSurveys() != null && !question.getSurveys().isEmpty()){
            List<Survey> surveys = question.getSurveys();

            for (Survey survey : surveys) {
                List<Question> surveyQuestions = survey.getQuestions();
                surveyQuestions.remove(question);
                survey.setQuestions(surveyQuestions);
                surveyService.editSurvey(survey);
            }

        }
        questionService.delete(question);
        return ResponseEntity.ok("Question deleted");
    }

    @PatchMapping("/updateQuestion")
    public ResponseEntity<?> updateQuestion(@RequestBody String str) throws JSONException {
        JSONObject jsonObject = new JSONObject(str);
        Long questionId = jsonObject.getLong("questionId");
        String description = jsonObject.getString("description");
        Question question = questionService.getQuestionById(questionId);
        if(question == null) return ResponseEntity.badRequest().body("Question not found");
        question.setDescription(description);
        questionService.update(question);
        return ResponseEntity.ok("Question updated");
    }



}
