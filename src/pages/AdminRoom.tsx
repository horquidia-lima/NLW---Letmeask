import { useHistory, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import '../styles/room.scss'

import { RoomCode } from '../components/RoomCode'
import {Question} from '../components/Question'
import {useRoom} from '../hooks/useRoom'
import { database } from '../services/firebase'

type RoomParams = {
    id: string
}

export function AdminRoom() {
    const history = useHistory()
    const params = useParams<RoomParams>()
    const roomId = params.id

    const {title, questions} = useRoom(roomId)

   async function handleEndRoom(){
       await database.ref(`rooms/${roomId}`).update({
           endedAt: new Date()
       })

       history.push('/')
   }


   async function handleDeleteQuestion(questionId: string){
       if(window.confirm('¿Está seguro de que desea eliminar esta pregunta?')){
         await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
       }
    }

   async function handleCheckQuestionAsAnswered(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
    })
   }

   async function handleHighlightQuestion(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
    })
   }

    return(
       <div id="page-room">
           <header>
               <div className="content">
                <img src={logoImg} alt="Letmeask" />
                <div>
                    <RoomCode code={roomId}/>
                    <Button isOutlined onClick={handleEndRoom}>Cerrar sala</Button>
                </div>  
               </div>
           </header>

           <main>
            <div className="room-title">
                <h1>Sala {title}</h1>
                {questions.length > 0 && <span>{questions.length} pregunta(s)</span>}  
            </div>


            <div className="question-list">
                {questions.map(question => {
                    return(
                        <Question
                            key={question.id}
                            content= {question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}
                        >
                        {!question.isAnswered && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                >
                                    <img src={checkImg} alt="check question" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleHighlightQuestion(question.id)}
                                >
                                    <img src={answerImg} alt="answer question" />
                                </button>

                            </>
                        )}
                            
                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="remove question" />
                            </button>
                        </Question>
                    )
                })}
            </div>
            
           </main>
       </div>
    )
}