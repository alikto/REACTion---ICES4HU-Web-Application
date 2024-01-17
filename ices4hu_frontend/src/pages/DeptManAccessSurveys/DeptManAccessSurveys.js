import "./DeptManAccessSurveys.css";
import React from "react";
import NavBar from "../../components/NavBar/NavBar";
import DeptManHead from "../../components/DeptManHead/DeptManHead.js"; 

import { useLocation, useNavigate } from 'react-router-dom'; 
import { useState, useEffect } from "react";

function DeptManAccessSurveys() {
    const location = useLocation();
    const userID = location.state.userID;
    const userType = location.state.userType;
    const [courses, setCourses] = useState([]);
    const [SelectedCourseCode, setSelectedCourseCode] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedCourseSemester, setSelectedCoursSemester] = useState('');
    const [surveys, setSurveys] = useState([]);
    const [selectedSurveyId, setSelectedSurveyId] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [evaluationList, setEvaluationList] = useState([]);

    useEffect(() => {

        fetchCourse();
      }, []);

    useEffect(() => {

        fetchSurvey();
      }, [SelectedCourseCode]);

    useEffect(() => {
        console.log(selectedSurveyId)
        fetchStudent();
    }, [selectedSurveyId]

    )

    const fetchCourse = async () => {
        try {
            const CourseResponse = await fetch(`http://localhost:8081/api/courses/department-managers-courses/${userID}`);
            const CourseData = await CourseResponse.json();
            setCourses(CourseData);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
        };
    
    const fetchSurvey = async () => {
        console.log(SelectedCourseCode);
        try {
            const SurveyResponse = await fetch(`http://localhost:8081/api/surveys/getSurveyWithCourseId/${selectedCourseId}`);
            const SurveyData = await SurveyResponse.json();
            setSurveys(SurveyData);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
        };
    
    const fetchStudent = async () => {
        try {
            const StudentResponse = await fetch(`http://localhost:8081/api/responses/getStudentsIdBySurveyId/${selectedSurveyId}`);
            const StudentData = await StudentResponse.json();
            setStudents(StudentData);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const fetchEvaluation = async () => {
        console.log(selectedStudentId);
        try {
            const Evaluation = await fetch(`http://localhost:8081/api/responses/getResponsesBySurveyIdAndStudentId/${selectedSurveyId}/${selectedStudentId}`);
            const EvaluationData = await Evaluation.json();
            setEvaluationList(EvaluationData);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
        console.log(evaluationList)
    };


    const handleCourseSelect = (event) => {
        const tempSelectedCourseId = parseInt(event.target.value);
    
        const selectedCourse = courses.find((course) => course.courseId === tempSelectedCourseId);
        setSelectedCourseCode(selectedCourse.courseCode)
        setSelectedCoursSemester(selectedCourse.semester)
        setSelectedCourseId(selectedCourse.courseId)
    }

    const handleSurveySelect = (event) => {
        const tempSelectedSurveyId = parseInt(event.target.value);
    
        const selectedSurvey = surveys.find((survey) => survey.surveyId === tempSelectedSurveyId);
        setSelectedSurveyId(selectedSurvey.surveyId)
        console.log(selectedSurvey.surveyId)
    }

    const handleStudentSelect = (event) => {
        const tempSelectedStudentId = parseInt(event.target.value);
    
        const selectedStudent = students.find((student) => student === tempSelectedStudentId);
        setSelectedStudentId(selectedStudent)
        console.log(selectedStudent)
    }

    return(
        <div>
            <div>
                <NavBar  userID={userID} userType={userType}/>
            </div>
            <div>
                <DeptManHead></DeptManHead>
            </div>
            <div className="header_access_survey">
                <span>Access Surveys</span>
            </div>
            <div className="general_select">
                <div style={{paddingLeft:'50px'}}>
                    <select className="instSelect" onChange={handleCourseSelect}>
                        <option value="hide">-- Course --</option>
                        {courses.length>0 && courses.map((course) => (
                        <option key={course.courseId} value={course.courseId}>
                            {course.courseTitle + " " + course.semester}</option>
                        ))}
                    </select>
                </div>
                <div style={{paddingLeft:'50px'}}>
                    <select className="instSelect" onChange={handleSurveySelect}>
                        <option value="hide">-- Survey --</option>
                        {surveys.length>0 && surveys.map((survey) => (
                        <option key={survey.surveyId} value={survey.surveyId}>
                            {survey.surveyType + " " + survey.surveyId}</option>
                        ))}
                    </select>
                </div>
                <div style={{paddingLeft:'50px'}}>
                    <select className="instSelect" onChange={handleStudentSelect}>
                        <option value="hide">-- Students --</option>
                        {students.length>0 && students.map((student) => (
                        <option key={student} value={student}>
                            {student}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button className="btn btn-danger mt-1" onClick={() => fetchEvaluation()} >Get Evaluation</button>
                </div>
            </div>
            <div>
                <table>
                    <tr>
                    <th><u><p>Question</p></u></th>
                    <th><u><p>Answer</p></u></th>
                    
                    </tr>
                    {evaluationList.length > 0 ? (
                        evaluationList.map((data, key) => (
                        <tr key={key}>
                            {data.length>0 && data.map((item, subIndex) => (
                            <td key={subIndex}>{item}</td>
                        ))}
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="2">No response available</td>
                        </tr>
                    )}
                </table>
            </div>
        </div>
    )
}


export default DeptManAccessSurveys;