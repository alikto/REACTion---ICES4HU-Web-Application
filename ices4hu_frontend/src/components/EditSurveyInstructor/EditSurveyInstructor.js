import "./EditSurveyInstructor.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";


function EditSurveyInstructor() {

      
    const location = useLocation();
    const instructorId = location.state.userID;
    const [selectCourse, setSelectCourse] = useState();
    const [coursesInstructor, setCoursesInstructor] = useState([]);
    const [surveyCourse, setSurveyCourse] = useState([]);
    const [selectSurvey, setSelectSurvey] = useState();
    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const [surveyType, setSurveyType] = useState();
    const [input, setInput] = useState("");

    const deleteItem = (item) => {
      let newProducts = surveyQuestions.filter(
        (record) => record.description !== item
      );
      setSurveyQuestions(newProducts);
    };

    function getQuestion() {
      var i;
      for(i = 0;i<surveyCourse.length;i++){
          if(selectSurvey==surveyCourse[i].surveyId) {
              setSurveyQuestions(surveyCourse[i].questions);
              console.log("Here")
              setSurveyType(surveyCourse[i].surveyType)
          }
      } 
  }

    const saveInput = (e) => {
      setInput(e.target.value);
    };

    const addNewItem = () => {
      const copyCart = [...surveyQuestions];
      copyCart.push({"description": input});
      setSurveyQuestions(copyCart);
      setInput("");
    };

    function fetchSurvey() {
        
        console.log(selectCourse);
        try {
            fetch(`http://localhost:8081/api/surveys/getSurveyWithCourseId/${selectCourse}`)
                .then(response => response.json())
                .then(data => {
                    setSurveyCourse(data);
                })
                .catch(error => {
                    console.log('Error fetching data:', error);
                    setSurveyCourse([]);
                });
        } catch (error) {
            console.log('Error fetching data:', error);
            setSurveyCourse([]);
        }
        
    }

    const handleEdit = (description) => {
      const updatedQuestions = surveyQuestions.map((question) => {
        if (question.description === description) {
          return { ...question, isEditing: true };
        }
        return question;
      });
      setSurveyQuestions(updatedQuestions);
    };

    const handleQuestionChange = (event, description) => {
      const updatedQuestions = surveyQuestions.map((question) => {
        if (question.description === description) {
          return { ...question, description: event.target.value };
        }
        return question;
      });
      setSurveyQuestions(updatedQuestions);
    };

    const handleSave = (description) => {
      const updatedQuestions = surveyQuestions.map((question) => {
        if (question.description === description) {
          return { ...question, isEditing: false };
        }
        return question;
      });
      setSurveyQuestions(updatedQuestions);
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log(surveyQuestions);
      const body = {  "surveyId" : selectSurvey, "instructorId": instructorId, "courseId": selectCourse, "surveyType": surveyType, "questionDTOS": surveyQuestions };
      fetch('http://localhost:8081/api/surveys/editSurvey', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
        .then(response => {
          if (response.status === 200) {
            console.log('Successful edit');
            alert('Survey successfully edited');
            return response.json();
          } else {
            alert('Invalid edit. Please try again.');
            console.log(`Error: ${response.status}`);
            // Handle other response status codes here
          }
          
        })
        
        .catch(error => {
          console.error('Error:', error);
        });
        setSurveyQuestions([]);
        setSelectCourse('Choose a course');
        
    }

    
    useEffect(() => {
        // GET request using fetch inside useEffect React hook
        fetch('http://localhost:8081/api/courses/instructors-courses/' + instructorId)
            .then(response => response.json())
            .then(data => setCoursesInstructor(data));
    
      // empty dependency array means this effect will only run once (like componentDidMount in classes)
      }, []); 

      useEffect(() => {
        fetchSurvey(); // Call fetchSurvey function whenever selectCourseInst changes
        
      }, [selectCourse]);

    return(
        <div>
            <div className="createSurveyHeader">
                <p>Edit Survey</p>
            </div>
            <div className='input_button_dropdown_row'>
                
                <div className='dropdown mt-3 button-dropdown-courses'>
                    <select value={selectCourse} onChange={e=>setSelectCourse(e.target.value)} className="selectCourse">
                        <option className="optionsCourse">Choose a course</option>
                          {
                             coursesInstructor.length > 0 && coursesInstructor?.map((course) => {
                              return(
                                <option className="optionsCourse" key={course.courseId} value={course.courseId}>
                                  {course.courseCode}
                                </option>

                              )
                            })
                          }
                    </select>

                </div>
                <div className='see_surveys mt-3'>
                    <select value={selectSurvey} onChange={(e)=>setSelectSurvey(e.target.value)}   className="selectCourse">
                        <option className="optionsCourse">Choose a survey</option>
                          { surveyCourse.length > 0 &&
                            surveyCourse.map((survey) => {
                              return(
                                <option className="optionsCourse" key={survey.surveyId} value={survey.surveyId}>
                                 {survey.surveyId} 
                                </option>

                              )
                            })
                          }
                    </select>

                </div>
                <div>
                  <div>
                      <input type="text" placeholder="Write your question" value={input} onChange={saveInput}/> 
                  </div>
                  <div className='button-add-question'>
                      <button className="btn btn-secondary mt-3" onClick={addNewItem}>Add Question</button>
                  </div>
                </div>
                <div className="two-buttons-checkresult mt-3">
                    <button className="btn button1reeval" onClick={() => {getQuestion()}} >Get Survey</button>
                    <button className="btn btn-danger" onClick={handleSubmit}>Edit</button>
                </div>
          </div>

            <div className='course-survey-table'>
                <table>
                    <tr>
                    <th><u><p>Question</p></u></th>
                    
                    </tr>
                    <tbody>
                      {surveyQuestions.length > 0 ? (
                        surveyQuestions.map((data, key) => (
                          <tr key={key}>
                            <td>
                              {data.isEditing ? (
                                <input
                                  type="text"
                                  value={data.description}
                                  onChange={(e) => handleQuestionChange(e, data.description)}
                                />
                              ) : (
                                data.description
                              )}
                            </td>
                            <td>
                              {data.isEditing ? (
                                <button className="btn btn-secondary m-3" onClick={() => handleSave(data.description)}>
                                  Save
                                </button>
                              ) : (
                                <button className="btn btn-secondary m-3" onClick={() => handleEdit(data.description)}>
                                  Edit
                                </button>
                              )}
                            </td>
                            <td>
                              <button className="btn btn-secondary m-3" onClick={() => deleteItem(data.description)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2">No average ratings available</td>
                        </tr>
                      )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


export default EditSurveyInstructor;


