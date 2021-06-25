import { Link, useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import illustration from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'

import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

export function NewRoom() {
   const {user} = useAuth()
   const history = useHistory()
   const [newRoom, setNewRoom] = useState('')

   async function handleCreateRoom(event: FormEvent){
    event.preventDefault()
    
    //verificar se campo esta vacio
    if(newRoom.trim() === ''){
        return
    }

    const roomRef = database.ref('rooms')

    const firebaseRoom = await roomRef.push({
        title: newRoom,
        authorId: user?.id,
    })

    history.push(`/rooms/${firebaseRoom.key}`)
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
                    <h1>{user?.name}</h1>
                    <h2>Crea una nueva sala</h2>
                    <form onSubmit={handleCreateRoom}> 
                        <input 
                            type="text" 
                            placeholder="Nombre de la sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Crear sala
                        </Button>
                    </form>
                    <p>
                        Quiere unirse a una sala existente? <Link to="/">Haga clic aquí</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}