package com.reaction.ices4hu.api.controller;

import com.reaction.ices4hu.business.abstracts.*;
import com.reaction.ices4hu.core.dtos.QuestionDTO;
import com.reaction.ices4hu.core.entities.Course;
import com.reaction.ices4hu.core.entities.Question;
import com.reaction.ices4hu.core.entities.Survey;
import com.reaction.ices4hu.core.entities.users.DepartmentManager;
import com.reaction.ices4hu.core.entities.users.Instructor;
import com.reaction.ices4hu.core.entities.users.User;
import com.reaction.ices4hu.core.requests.CreateSurveyRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/api/surveys")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class SurveyController {

    private final SurveyService surveyService;

    private final QuestionService questionService;

    private final UserService userService;

    private final CourseService courseService;

    private final ResponseService responseService;

    @Autowired
    public SurveyController(SurveyService surveyService, QuestionService questionService, UserService userService, CourseService courseService, ResponseService responseService) {
        super();
        this.surveyService = surveyService;
        this.questionService = questionService;
        this.userService = userService;
        this.courseService = courseService;
        this.responseService = responseService;
    }


    @PostMapping("/createSurvey")
    public ResponseEntity<?> createSurvey(@RequestBody CreateSurveyRequest createSurveyRequest) {
        Long instructorId = createSurveyRequest.getInstructorId();
        Long courseId = createSurveyRequest.getCourseId();
        String surveyType = createSurveyRequest.getSurveyType();

        if (!(surveyType.equals("InstructorSurvey") || surveyType.equals("CourseSurvey"))) {
            return ResponseEntity.badRequest().body("Wrong Survey Type");
        }

        User instructor = userService.getUserById(instructorId);
        Course course = courseService.getCourseById(courseId);

        //instructor check
        if (instructor == null) return ResponseEntity.badRequest().body("Instructor not found");
        else if (!(instructor instanceof Instructor))
            return ResponseEntity.badRequest().body("User is not an Instructor");

        //course check
        if (course == null) return ResponseEntity.badRequest().body("Course not found");

        //check if survey existed
        List<Survey> existedSurveys = surveyService.getSurveyWithCourseId(courseId);

        if (existedSurveys.size() != 0) {
            for (Survey existedSurvey : existedSurveys) {
                if (existedSurvey.getSurveyType().equals(surveyType)) {
                    return ResponseEntity.badRequest().body("Survey Already Exists");
                }

            }
        }

        List<QuestionDTO> surveyQuestionDTOS = createSurveyRequest.getQuestionDTOS();
        //System.out.println(surveyQuestionDTOS.get(0).getQuestionId());
        List<Question> surveyQuestions = new ArrayList<>();
        for (QuestionDTO questionDTO : surveyQuestionDTOS) {

            if (questionDTO.getQuestionId() == null) {
                Question question = new Question(null, questionDTO.getDescription(), false, null);
                surveyQuestions.add(question);
                questionService.add(question);
            } else {
                System.out.println(questionDTO.getQuestionId());
                Question question = questionService.getQuestionById(questionDTO.getQuestionId());

                if (question == null)
                    return ResponseEntity.badRequest().body("No question found for id: " + questionDTO.getQuestionId());

                surveyQuestions.add(question);

            }

        }


        Survey survey = new Survey();
        survey.setSurveyType(createSurveyRequest.getSurveyType());
        survey.setCourseId(createSurveyRequest.getCourseId());
        survey.setInstructorId(createSurveyRequest.getInstructorId());
        survey.setIsPublished(false);
        survey.setQuestions(surveyQuestions);

        survey = surveyService.createSurvey(survey);

        return ResponseEntity.ok(survey);
    }

    @GetMapping("/getSurveyById/{surveyId}")
    public ResponseEntity<?> getSurveyById(@PathVariable Long surveyId) {
        Survey survey = surveyService.getSurveyBySurveyId(surveyId);
        return ResponseEntity.ok(survey);
    }

    @GetMapping("/getAllSurveys")
    public ResponseEntity<?> getAllSurveys() {
        List<Survey> surveys = surveyService.getAllSurveys();
        return ResponseEntity.ok(surveys);
    }

    @GetMapping("getSurveyByInstuctorId/{instructorId}")
    public ResponseEntity<?> getSurveyByInstuctorId(@PathVariable Long instructorId) {
        List<Survey> surveys = surveyService.getSurveyByInstructorId(instructorId);
        return ResponseEntity.ok(surveys);
    }

    @DeleteMapping("/deleteSurvey/{surveyId}")
    public ResponseEntity<?> deleteSurvey(@PathVariable Long surveyId) {
        Survey survey = surveyService.getSurveyBySurveyId(surveyId);
        if (survey == null) return ResponseEntity.badRequest().body("Survey not found");
        surveyService.deleteSurvey(survey);
        return ResponseEntity.ok("Survey deleted");
    }

    @PatchMapping("/editSurvey")
    public ResponseEntity<?> editSurvey(@RequestBody String str) throws JSONException {
        JSONObject jsonObject = new JSONObject(str);
        Survey existingSurvey = surveyService.getSurveyBySurveyId(jsonObject.getLong("surveyId"));
        if (existingSurvey == null) return ResponseEntity.badRequest().body("Survey not found");
        existingSurvey.setInstructorId(jsonObject.getLong("instructorId"));
        existingSurvey.setCourseId(jsonObject.getLong("courseId"));
        existingSurvey.setSurveyType(jsonObject.getString("surveyType"));


        List<Question> surveyQuestions = new ArrayList<>();
        for (int i = 0; i < jsonObject.getJSONArray("questionDTOS").length(); i++) {
            JSONObject questionDTO = jsonObject.getJSONArray("questionDTOS").getJSONObject(i);
            if (questionDTO.has("questionId") && questionDTO.has("description")) {
                Question question = questionService.getQuestionById(questionDTO.getLong("questionId"));
                if (question == null) return ResponseEntity.badRequest().body("Question not found");
                question.setDescription(questionDTO.getString("description"));
                questionService.update(question);
                surveyQuestions.add(question);
            } else if (questionDTO.has("description")) {
                List<Survey> newSurveyList = new ArrayList<>();
                newSurveyList.add(existingSurvey);
                Question question = new Question(null, questionDTO.getString("description"), false, newSurveyList);
                questionService.add(question);
                surveyQuestions.add(question);
            }
        }
        existingSurvey.setQuestions(surveyQuestions);

        surveyService.editSurvey(existingSurvey);

        return ResponseEntity.ok(existingSurvey);
    }

    @GetMapping("/getSurveyWithCourseId/{courseId}")
    public ResponseEntity<?> getSurveyWithCourseId(@PathVariable Long courseId) {
        Course course = courseService.getCourseById(courseId);
        if (course == null) {
            return ResponseEntity.badRequest().body("No course found for given id");

        }
        List<Survey> surveys = surveyService.getSurveyWithCourseId(courseId);
        return ResponseEntity.ok(surveys);
    }

    @GetMapping("/getPublishedSurveys/{courseId}")
    public ResponseEntity<?> getPublishedSurveys(@PathVariable Long courseId) {
        Course course = courseService.getCourseById(courseId);
        if (course == null) {
            return ResponseEntity.badRequest().body("No course found for given id");

        }
        List<Survey> surveys = surveyService.getSurveyWithCourseId(courseId);

        List<Survey> publishedSurveys = new ArrayList<>();

        for (Survey survey : surveys) {
            if (survey.getIsPublished()) {
                publishedSurveys.add(survey);
            }
        }
        return ResponseEntity.ok(publishedSurveys);
    }


    @PostMapping("/shareResultsAll/{departmentManagerId}")
    public ResponseEntity<?> shareResultsAll(@PathVariable Long departmentManagerId) {
        User user = userService.getUserById(departmentManagerId);
        if (user != null) {

            if (!(user instanceof DepartmentManager departmentManager)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not Department Manager");
            }

            List<Course> courses = courseService.getCoursesByDepartmentName(departmentManager.getDepartmentName());

            for (Course course : courses) {
                List<Survey> courseSurveys = surveyService.getSurveyWithCourseId(course.getCourseId());

                for (Survey survey : courseSurveys) {
                    survey.setIsPublished(true);
                    surveyService.editSurvey(survey);
                }
            }

            return ResponseEntity.ok("All results for " + departmentManager.getDepartmentName() + " is shared!");

        } else {
            // Handle the case when DepartmentManager is not found
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Department Manager not found");
        }
    }


    @GetMapping("/survey/downloadResults/{surveyId}")
    public ResponseEntity<Resource> downloadSurveyRatings(@PathVariable Long surveyId, HttpServletResponse response) throws IOException {
        Survey survey = surveyService.getSurveyBySurveyId(surveyId);

        // Create Excel workbook and sheet
        Workbook workbook = new HSSFWorkbook();
        Sheet sheet = workbook.createSheet("Survey Ratings");

        // Create header row
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Question Description");
        headerRow.createCell(1).setCellValue("Average Rating");

        // Create data rows
        for (int i = 1; i < survey.getQuestions().size(); i++) {
            Question question = survey.getQuestions().get(i - 1);
            Double averageRating = responseService.calculateAverageRatingByQuestionId(question.getQuestionId());

            Row dataRow = sheet.createRow(i);
            dataRow.createCell(0).setCellValue(question.getDescription());
            dataRow.createCell(1).setCellValue(averageRating);

        }

        String filePath = "C:/Users/erkin/384son/final-presentation-reaction/ices4hu/files/survey_ratings_" + surveyId + ".xls";
        try (FileOutputStream outputStream = new FileOutputStream(filePath)) {
            workbook.write(outputStream);
        }


        Resource fileResource = new FileSystemResource(filePath);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        String fileName = "survey_ratings_" + surveyId + ".xls";
        headers.setContentDispositionFormData("attachment", fileName);

        // Return the file as a ResponseEntity
        return ResponseEntity.ok()
                .headers(headers)
                .body(fileResource);
    }

}
