import "./CheckResultsofSurveysInst.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";


function CheckResultsofSurveysInst  () {

    const location = useLocation();
    const instructorId = location.state.userID;
    const [coursesInstructor, setCoursesInstructor] = useState([]);
    const [surveyCourse, setSurveyCourse] = useState([]);
    const [selectCourseInst, setSelectCourseInst] = useState('');
    const [selectSurvey, setSelectSurvey] = useState('');
    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const [averageRating, setAverageRating] = useState([]);

    function getQuestion() {
        var i;
        for(i = 0;i<surveyCourse.length;i++){
            if(selectSurvey==surveyCourse[i].surveyId) {
                setSurveyQuestions(surveyCourse[i].questions);
                console.log("Here")
            }
        } 
    }

    function downloadResults() {
        try {
            fetch(`http://localhost:8081/api/surveys/survey/downloadResults/${selectSurvey}`)
                .then(response => {console.log(response.status);
                alert('File is downloaded');})
                .catch(error => {
                    console.log('Error fetching data:', error);
                    
                });
        } catch (error) {
            console.log('Error fetching data:', error);
            
        }
    }

    function getRating() {
        if(selectCourseInst==='') {
            alert('No course was selected!')
        }
        else if(selectSurvey==='') {
            alert('No survey was selected!')
        }
        else{
            var i;
            for(i = 0;i<surveyQuestions.length;i++){
                const j = surveyQuestions[i].description;
                try {
                    fetch(`http://localhost:8081/api/responses/averageRating/${surveyQuestions[i].questionId}`)

                        .then(response => response.json())
                        .then((data) => { {
                            const questionWithRating = {
                                question: j,
                                rating: data
                            };
                            setAverageRating(prevState => [...prevState, questionWithRating]);
                        }
                        })
                        .catch(error => {
                            console.log('Error fetching data:', error);
                        });
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            } 
            console.log(averageRating);
        }
        
    }

    function fetchSurvey() {
       
        console.log(selectCourseInst);
        try {
            fetch(`http://localhost:8081/api/surveys/getPublishedSurveys/${selectCourseInst}`)
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


    useEffect(() => {
        // GET request using fetch inside useEffect React hook
        fetch('http://localhost:8081/api/courses/instructors-courses/' + instructorId)
            .then(response => response.json())
            .then(data => setCoursesInstructor(data))
    
      // empty dependency array means this effect will only run once (like componentDidMount in classes)
      }, []);


    useEffect(() => {
        fetchSurvey(); // Call fetchSurvey function whenever selectCourseInst changes
        
    }, [selectCourseInst]);

    useEffect(() => {
        getQuestion();
        setAverageRating([]);
    }, [selectSurvey]);

    
    return(
        <div>
            <div className='header-check-result-survey'>
                <span>Check Results of Survey</span>

            </div>
            <div className='dropdown-twobuttons-checkresult'>
                <div className='dropdown mt-3 button-dropdown-courses'>
                    <select value={selectCourseInst} onChange={e=>setSelectCourseInst(e.target.value)} className="selectCourse">
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
                
                
                <div className="two-buttons-checkresult mt-3">
                    <button className="btn button1reeval" onClick={() => {setAverageRating([]); getRating(); console.log(averageRating);}} >Request Average Rating</button>
                    <button className="btn button2downloadeval" onClick={()=>downloadResults()}>Download evaluation results</button>
                </div>
                
            </div>
            <div className='course-survey-table'>
                <table>
                    <tr>
                    <th><u><p>Question</p></u></th>
                    <th><u><p>Rate</p></u></th>
                    
                    </tr>
                    {averageRating.length > 0 ? (
                        averageRating.map((data, key) => (
                        <tr key={key}>
                            <td>{data.question}</td>
                            <td>{data.rating}</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="2">No average ratings available</td>
                        </tr>
                    )}
                </table>
            </div>
            
        </div>
    )


}


export default CheckResultsofSurveysInst;

