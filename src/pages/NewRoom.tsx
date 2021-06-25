// import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";

// # To load files from image src always call this as an import statement beacuse webpack configs
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";

import '../styles/auth.scss';
import { Button } from "../components/Button";
import { database } from "../services/firebase";



export function NewRoom() {
    const { user } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom ] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        })

        history.push(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Illustration simplifying questions and answers" />
                <strong>Create Q&amp;A live rooms</strong>
                <p>Remove the doubts from your audience in real time</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Create a new room</h2>

                    {/* Click in the button always in the form submit  */}
                    {/* Todo formulario envia o formulario para algum endere'co novo atraves do action
                    Para manipular uma fun'cao nativa do html, a fun'cao handleForm pode receber a vari'avel event
                    Dentro do event eh possivel obter infos do form */}


                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Name of the room"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Create rrom
                        </Button>
                    </form>
                    <p>
                        Do you want to enter in a existing room? <Link to="/">Click here</Link>
                    </p>
                </div>
            </main>
        </div> 
    )
}