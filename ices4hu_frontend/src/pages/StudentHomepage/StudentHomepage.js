import "./StudentHomepage.css";

import NavBar from "../../components/NavBar/NavBar.js";
import LogoForHomepage from "../../components/LogoForHomepage/LogoForHomepage";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function StudentHomepage() {
  const location = useLocation();
  const userID = location.state.userID;
  const userType = location.state.userType;
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [instructors2, setInstructors2] = useState([]);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false); // State to control survey visibility
  const [showNoSurvey, setShowNoSurvey] = useState(false); // State to control survey visibility
  const [mainSurveyId, setMainSurveyId] = useState();
  const [newAnswers, setNewAnswers] = useState({});
  const [selectedRating, setSelectedRating] = useState({});

  const [courseNames, setCourseNames] = useState({}); // State to store course names

  useEffect(() => {
    fetchCourseNames(); // Fetch course names on component mount
  }, []);

  const fetchCourseNames = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/courses/getAll");
      const data = await response.json();
      const names = {};
      data.forEach((course) => {
        names[course.courseId] = course.courseCode;
      });
      setCourseNames(names);
    } catch (error) {
      console.log("Error fetching course names:", error);
    }
  };

  const toggleCourseDropdown = async () => {
    setShowCourseDropdown(true);
    setShowInstructorDropdown(false);
    try {
      fetch("http://localhost:8081/api/courses/students-courses/" + userID)
        .then((response) => response.json())
        .then((data) => setCourses(data));
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const toggleInstructorDropdown = async () => {
    setShowInstructorDropdown(true);
    setShowCourseDropdown(false);
    
    try {
      const response = await fetch("http://localhost:8081/api/courses/students-courses/" + userID);
      const data = await response.json();
      setCourses(data);
      
      const surveyPromises = data.map((course) =>
        fetch(`http://localhost:8081/api/surveys/getSurveyWithCourseId/${course.courseId}`)
          .then((response) => response.json())
          .then((data) => data.filter((survey) => survey.surveyType === "InstructorSurvey"))
      );
      
      const surveyResults = await Promise.all(surveyPromises);
      const instructorSurveys = surveyResults.flat();
      setInstructors(instructorSurveys);
      
      const instructorInfoPromises = instructorSurveys.map((survey) =>
        fetch(`http://localhost:8081/api/users/get/${survey.instructorId}`)
          .then((response) => response.json())
          .then((data) => ({ ...data, surveyId: survey.surveyId, courseId: courseNames[survey.courseId] }))
      );
      
      const instructorInfo = await Promise.all(instructorInfoPromises);
      setInstructors2(instructorInfo.flat());
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  

  const handleInstructorSelect = (input) => {
    setNewAnswers({});
    setSelectedRating({});
    setShowNoSurvey(true);
    const filteredSurvey = instructors.find(
      (survey) => survey.surveyId === parseInt(input)
    );
    setMainSurveyId(filteredSurvey.surveyId);
    const courseSurveyQuestions = filteredSurvey ? filteredSurvey.questions : [];
    if (courseSurveyQuestions.length > 0) {
      setShowSurvey(true);
    } else {
      setShowSurvey(false);
    }
    setQuestions(courseSurveyQuestions);
    fetchSubmittedResponses();
  };

  const handleCourseSelect = (input) => {
    setNewAnswers({});
    setSelectedRating({});
    setShowNoSurvey(true);
    fetchCourseSurvey(input);
    fetchSubmittedResponses();
  };

  function fetchCourseSurvey(input) {
    try {
      fetch(
        `http://localhost:8081/api/surveys/getSurveyWithCourseId/` + input
      )
        .then((response) => response.json())
        .then((data) => {
          const filteredSurvey = data.find(
            (survey) => survey.surveyType === "CourseSurvey"
          );
          const courseSurveyQuestions = filteredSurvey
            ? filteredSurvey.questions
            : [];
          if (courseSurveyQuestions.length > 0) {
            setShowSurvey(true);
            setQuestions(courseSurveyQuestions);
            setMainSurveyId(filteredSurvey.surveyId);
          } else {
            setShowSurvey(false);
          }
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
          setQuestions([]);
        });
    } catch (error) {
      console.log("Error fetching data:", error);
      setQuestions([]);
    }
  }

  const setAnswerForQuestion = (questionId, studentId, rating) => {
    setNewAnswers((prevNewAnswers) => ({
      ...prevNewAnswers,
      [questionId]: {
        ...prevNewAnswers[questionId],
        [studentId]: rating,
      },
    }));
  };

  const [submittedResponses, setSubmittedResponses] = useState([]);

  useEffect(() => {
    fetchSubmittedResponses();
  }, []);

  const fetchSubmittedResponses = async () => {
    try {
      fetch("http://localhost:8081/api/responses/getAllResponses")
        .then((response) => response.json())
        .then((data) => setSubmittedResponses(data));
    } catch (error) {
      console.log("Error fetching submitted responses:", error);
    }
  };

  const Question = ({ questionId, questionIndex, questionText, ratingDots }) => {
    const selectedRatingForQuestion =
    newAnswers[questionId]?.[userID] ||
    (submittedResponses.find(
      (response) =>
        response.questionId === questionId &&
        response.studentId === userID
    )?.rate || null);
    const handleRatingSelect = (rating) => {
      const questionId = questions[questionIndex - 1]?.questionId;
        if (questionId) {
          setAnswerForQuestion(questionId, userID, rating);
        }
    };
    return (
      <div className="question-row">
        <span className="question-id">{questionIndex}</span>
        <span className="question-text">{questionText}</span>
        <div className="rating-dots">
          {ratingDots.map((rating) => {
            const dotClass =
              selectedRatingForQuestion === rating
                ? "rating-dot selected"
                : "rating-dot";
            return (
              <div
                key={rating}
                className={dotClass}
                onClick={() => handleRatingSelect(rating)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const promises = []; // Array to store Promises
  
    for (const questionId of Object.keys(newAnswers)) {
      const rating = newAnswers[questionId][userID];
      fetchSubmittedResponses();
      const matchingResponse = submittedResponses.find((response) => {
        return response.questionId === parseInt(questionId) && response.studentId === parseInt(userID);
      });
  
      if (matchingResponse) {
        const matchingResponseId = matchingResponse.responseId;
        const body = {
          responseId: matchingResponseId,
          questionId: parseInt(questionId),
          studentId: parseInt(userID),
          surveyId: mainSurveyId,
          rate: rating,
        };
  
        promises.push(
          fetch("http://localhost:8081/api/responses/editResponse", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          })
            .then((response) => {
              if (response.status === 200) {
                console.log("Question responses edited successfully.");
                return true;
              } else {
                console.log(`Error: ${response.status}`);
                // Handle other response status codes here
                throw new Error(`Error: ${response.status}`);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              throw error;
            })
        );
      } else {
        const body = {
          questionId: parseInt(questionId),
          studentId: parseInt(userID),
          surveyId: mainSurveyId,
          rate: rating,
        };
  
        promises.push(
          fetch("http://localhost:8081/api/responses/createResponse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          })
            .then((response) => {
              if (response.status === 200) {
                console.log("Question responses added successfully.");
                return true;
              } else {
                console.log(`Error: ${response.status}`);
                // Handle other response status codes here
                throw new Error(`Error: ${response.status}`);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              throw error;
            })
        );
      }
    }
  
    Promise.all(promises)
      .then(() => {
        alert("Your answers are saved.");
      })
      .catch((error) => {
        alert("Error saving your answers. Please try again.");
      });
  };
  

  return (
    <div>
      <div>
        <NavBar  userID={userID} userType={userType}/>
        <LogoForHomepage></LogoForHomepage>
      </div>

      <div className="student-page-top">
        <button className="dmButton" onClick={toggleCourseDropdown}>
          Evaluate Course
        </button>
        <button className="dmButton" onClick={toggleInstructorDropdown}>
          Evaluate Instructor
        </button>

        {showCourseDropdown && (
          <div>
            <select
              onChange={(event) => handleCourseSelect(event.target.value)}
            >
              <option disabled selected hidden>
                Evaluate Course
              </option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseCode + " - " +course.courseTitle}
                </option>
              ))}
            </select>
          </div>
        )}

        {showInstructorDropdown && (
          <div>
            <select
              onChange={(event) => handleInstructorSelect(event.target.value)}
            >
              <option disabled selected hidden>
                Evaluate Instructor
              </option>
              {instructors2.length > 0 &&
                instructors2.map((instructor2) => (
                  <option
                    key={instructor2.instructorId}
                    value={instructor2.surveyId}
                  >
                    {instructor2.name +
                      " " +
                      instructor2.surname +
                      " - " +
                      instructor2.courseId}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>
      {showSurvey && (
        <div className="student-page-bottom">
          <div className="student-survey-area">
            <div className="student-survey-header">
              <span className="id-span">ID</span>
              <span className="question-span">Question</span>
              <span className="number-span">
                {[1, 2, 3, 4, 5].map((number) => (
                  <span key={number} className="number">
                    {number}
                  </span>
                ))}
              </span>
            </div>
            {questions.map((question, index) => (
              <Question
                key={question.questionId}
                questionId={question.questionId}
                questionIndex={index + 1}
                questionText={question.description}
                ratingDots={[1, 2, 3, 4, 5]}
              />
            ))}
          </div>
          <div className="survey-buttons">
            <button className="survey-button">Save All</button>
            <button
              className="survey-button"
              onClick={handleSubmit}
              style={{
                background:
                  "linear-gradient(180deg, #AB0000 0%, #DB0000 100%)",
                border: "none",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {!showSurvey &&
        (showInstructorDropdown || showCourseDropdown) &&
        showNoSurvey && (
          <div className="student-page-bottom">
            <div className="no-survey-message">No Survey Found.</div>
          </div>
        )}
    </div>
  );
}

export default StudentHomepage;
