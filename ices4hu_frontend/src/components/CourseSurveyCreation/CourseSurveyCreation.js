import { useLocation } from 'react-router-dom';
import './CourseSurveyCreation.css';
import React, { useState, useEffect } from "react";


function CourseSurveyCreation() {
    const location = useLocation();
    const instructorId = location.state.userID;
    const surveyType = "CourseSurvey";
    const [selectCourse, setSelectCourse] = useState('');
    const [commonQuestions, setCommonQuestions] = useState([]);
    const [inputFields, setInputFields] = useState([]);
    const [coursesInstructor, setCoursesInstructor] = useState([]);

    const [input, setInput] = useState(""); 

    useEffect(() => {
      // GET request using fetch inside useEffect React hook
      fetch('http://localhost:8081/api/courses/instructors-courses/'+instructorId)
          .then(response => response.json())
          .then(data => setCoursesInstructor(data));
  
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);

    useEffect(() => {
      // GET request using fetch inside useEffect React hook
      fetch('http://localhost:8081/api/questions/get-common-questions')
          .then(response => response.json())
          .then(data => setCommonQuestions(data));
  
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);

    const deleteItem = (item) => {
        let newProducts = inputFields.filter(
          (record) => record.description !== item
        );
        setInputFields(newProducts);
      };

    const saveInput = (e) => {
        setInput(e.target.value);
      };

      const addNewItem = () => {
        const copyCart = [...inputFields];
        copyCart.push({"description": input});
        setInputFields(copyCart);
        setInput("");
      };

    function printInput() {
        console.log(coursesInstructor);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (inputFields.length===0) {
          alert("No questions were added!");
        }
        else if(selectCourse==='') {
          alert("No course was selected!");
        }
        else {
          const body = {  "instructorId" : instructorId, "courseId": selectCourse, "surveyType": surveyType, "questionDTOS": inputFields };
          fetch('http://localhost:8081/api/surveys/createSurvey', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          })
            .then(response => {
              if (response.status === 200) {
                console.log('Successful created');
                alert('Survey was successfully created');
                setInputFields([]);
              } else {
                alert('Invalid request. Please try again.');
                console.log(`Error: ${response.status}`);
                // Handle other response status codes here
              }
              return response.json();
            })
            
            .catch(error => {
              console.error('Error:', error);
            });
        }
        
    }

    return(
        <div>
            <div className="createSurveyHeader">
                <p>Create Survey About Course</p>
                
            </div>
            <div className='input_button_dropdown_row'>
                <div>
                    <input type="text" placeholder="Write your question" value={input} onChange={saveInput}/> 
                </div>
                <div className='button-add-question'>
                    <button className="btn btn-secondary mt-3" onClick={addNewItem}>Add Question</button>
                </div>
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
                <div className='button-get-common-questions'>
                    <button className="btn btn-danger mt-3" onClick={() => setInputFields(commonQuestions)}>Get Common Questions</button>
                </div>
                <div className='button-create-survey'>
                    <button className="btn btn-danger mt-3" onClick={handleSubmit}>Create Survey</button>
                </div>
            </div>

            <div className='course-survey-table'>
                <table>
                    <tr>
                    <th><u><p>Description</p></u></th>
                    
                    </tr>
                    {inputFields.map((data, key) => {
                        
                            return (
                                <tr key={key}>
                                <td>{data.description}</td>
                                <button className='btn btn-secondary m-3' onClick={printInput}>Edit</button>
                                <button className='btn btn-secondary m-3' onClick={() => deleteItem(data.description)}>Delete</button>
                                </tr>
                            )
                        
                    
                    })}
                </table>
            </div>
            
        </div>
    )
};


export default CourseSurveyCreation;