import "./AdminManageSurveys.css"
import LogoForHomePage from "../../components/LogoForHomepage/LogoForHomepage";
import NavBar from "../../components/NavBar/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminManageSurveys() {
    const location = useLocation();
    const userID = location.state.userID;
    const userType = location.state.userType;
    console.log(userID);

    const [surveys, setSurveys] = useState([]);
    const [selectedSurvey, setSelectedSurvey] = useState(null);

    useEffect(() => {
        // Fetch surveys from API
        fetch('http://localhost:8081/api/surveys/getAllSurveys')
        .then((response) => response.json())
        .then((data) => setSurveys(data))
        .catch((error) => console.log(error));
    }, []);

    const handleSelectSurvey = (survey) => {
        setSelectedSurvey(survey);
    };

    const SurveySelection = ({ surveys, onSelectSurvey }) => {
        const [instructors, setInstructors] = useState([]);

        useEffect(() => {
            // Fetch instructors for each survey
            const fetchInstructors = async () => {
            const instructorPromises = surveys.map((survey) => {
                const userId = survey.instructorId;
                return fetch(`http://localhost:8081/api/users/get/${userId}`)
                .then((response) => response.json())
                .catch((error) => {
                    console.log(`Error fetching instructor with userId ${userId}:`, error);
                    return null;
                });
            });

            const fetchedInstructors = await Promise.all(instructorPromises);
            setInstructors(fetchedInstructors);
            };

            fetchInstructors();
        }, [surveys]);


        const getInstructorName = (survey) => {
            const instructor = instructors.find((instructor) => instructor && instructor.userId === survey.instructorId);
            return instructor ? instructor.name : 'Unknown Instructor';
          };

        const handleChange = (event) => {
          const selectedSurveyId = parseInt(event.target.value);
          const selectedSurvey = surveys.find((survey) => survey.surveyId === selectedSurveyId);
          onSelectSurvey(selectedSurvey);
        };
      
        return (
          <select className="dropdown-survey" onChange={handleChange}>
            <option style={{fontSize: '30px'}} value="">Select a survey</option>
            {surveys.map((survey) => (
                <option className="option-dropdown-survey" key={survey.surveyId} value={survey.surveyId}>
                Survey of {getInstructorName(survey)}
                </option>
            ))}
          </select>
        );
      };

    const SurveyQuestions = ({ survey }) => {
        let counter = 1;
        const [editingQuestionId, setEditingQuestionId] = useState(null);
        const [newQuestion, setNewQuestion] = useState('');

        const handleEditClick = (questionId) => {
            setEditingQuestionId(questionId);
          };
        
          const handleDeleteClick = (questionId) => {
            fetch(`http://localhost:8081/api/questions/deleteQuestion/${questionId}`, {
              method: 'DELETE',
            })
              .then((response) => {
                if (response.ok) {
                    const updatedSurveys = surveys.map((survey) => {
                        if (survey.surveyId === selectedSurvey.surveyId) {
                          const updatedQuestions = survey.questions.filter(
                            (question) => question.questionId !== questionId
                          );
                          return { ...survey, questions: updatedQuestions };
                        }
                        return survey;
                      });
                      setSurveys(updatedSurveys);
                      const updatedSurvey = updatedSurveys.find(
                        (survey) => survey.surveyId === selectedSurvey.surveyId
                      );
                      setSelectedSurvey(updatedSurvey);
                  }
              })
              .catch((error) => {
                // Handle error
              });
          };
        
          const handleInputChange = (e) => {
            setNewQuestion(e.target.value);
          };

          const handleDoneClick = () => {
            const editData = {
                questionId: editingQuestionId,
                description: newQuestion,
            };

            fetch('http://localhost:8081/api/questions/updateQuestion', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editData),
            })
            .then((response) => {
                const updatedSurveys = surveys.map((survey) => {
                    if (survey.surveyId === selectedSurvey.surveyId) {
                      const updatedQuestions = survey.questions.map((question) => {
                        if (question.questionId === editingQuestionId) {
                          return { ...question, description: newQuestion };
                        }
                        return question;
                      });
                      return { ...survey, questions: updatedQuestions };
                    }
                    return survey;
                  });
                  setSurveys(updatedSurveys);
                  setSelectedSurvey(updatedSurveys.find((survey) => survey.surveyId === selectedSurvey.surveyId)); // Update selectedSurvey with updated questions
            })
            .catch((error) => {
                console.log(error);
            });
            
            setEditingQuestionId(null);
            setNewQuestion('');
          };

        return (
          <div>
            {survey.questions.map((question) => (
              <div className="survey-row" key={question.questionId}>
                <span className="question-info">{counter++}. {question.description}</span>
                <div>
                    {editingQuestionId === question.questionId ? (
                        <div>
                            <input
                            style={{margin:'0px', fontSize:'20px'}}
                            type="text"
                            value={newQuestion}
                            onChange={handleInputChange}
                            />
                            <button className="button-survey"
                                    style={{ background: 'linear-gradient(180deg, #3A3A3A 0%, #1E1E1E 100%)', marginLeft:'15px' }}
                                    onClick={handleDoneClick}>Done</button>
                        </div>
                    ) : (
                        <div>
                            <button className="button-survey"
                                    style={{ background: 'linear-gradient(180deg, #3A3A3A 0%, #1E1E1E 100%)' }}
                                    onClick={() => handleEditClick(question.questionId)}>
                                Edit
                            </button>
                            <button className="button-survey" 
                                    onClick={() => handleDeleteClick(question.questionId)}>
                                Delete
                            </button>
                        </div>
                    )}
                </div>

            </div>
            ))}
          </div>
        );
    };

    const navigate = useNavigate();
    const addUser = (event) => {
        console.log(event)
        event.preventDefault();
        navigate('/admin/adduser');
    }
    const addCourse = (event) => {
        console.log(event);
        event.preventDefault();
        navigate('/admin/addCourse')
    }
    const manageSurveys = (event) => {
        console.log(event);
        event.preventDefault();
        navigate('/admin/manageSurveys');
    }


    return(
        <div>
            <div>
                <NavBar  userID={userID} userType={userType}/>
                <LogoForHomePage/>
            </div>
            <div class="button-container">
                <button onClick={addUser} class="b1" style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    color: '#FFFFFF'
                }}>Add User</button>
                <button onClick={addCourse} class="b1" style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    color: '#FFFFFF'
                }}>Add Course</button>
                <button class="b1" style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    color: '#FFFFFF'
                }}>Start Semester</button>
                <button class="b1" style={{
                    fontFamily: 'Montserrat',
                    fontWeight: 500,
                    color: '#FFFFFF'
                }}>Manage Surveys</button>
                
            </div>

            <div className="survey-container">
            <div>
                <h1 style={{fontSize:'64px'}}>Manage Surveys</h1>
                <SurveySelection surveys={surveys} onSelectSurvey={handleSelectSurvey} />
                {selectedSurvey && <SurveyQuestions survey={selectedSurvey} />}
            </div>
            </div>
        </div>
    )

}
export default AdminManageSurveys;