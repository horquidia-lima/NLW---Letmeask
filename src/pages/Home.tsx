import { useHistory } from 'react-router-dom'

import illustration from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { Button } from '../components/Button'

import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'


export function Home() {
    const history = useHistory()
    const {user, signInWithGoogle} = useAuth()
    const [roomCode, setRoomCode] = useState('')

    async function handleCreateRoom(){
        if(!user){
          await signInWithGoogle()
        }
        history.push('/rooms/new')  
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault()

        if(roomCode.trim() === ''){
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        if(!roomRef.exists()){
            alert('Room does not exists.')
            return
        }

        if(roomRef.val().endedAt){
            alert('Room already closed.')
            return
        }

        history.push(`/rooms/${roomCode}`)
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustration} alt="Ilustracion simbolizando preguntas y respuestas" />
                <strong>Crea salas de Q&amp;A en vivo</strong>
                <p>Responda las dudas de tu audiencia en tiempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Logo Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo Google" />
                        Crea tu sala con google
                    </button>
                    <div className="separator">o entrar en una sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder="Ingrese el código de la sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Ir a la sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}