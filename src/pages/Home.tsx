// # To load files from image src always call this as an import statement beacuse webpack configs
import { useHistory } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

import '../styles/auth.scss';
import { Button } from "../components/Button";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }
        history.push("/rooms/new");
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();
        // Execute event.preventDefault() in any React Form

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`/rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            alert('Room does not exists.')
            return;
        }

        if (roomRef.val().endedAt) {
            alert('Room already closed.')
            return;
        }

        history.push(`/rooms/${roomCode}`)
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
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Google's logo" />
                        Create your room with Google
                    </button>
                    <div className="separator">Or enter in a room</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Type the code of the room"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Enter in the room
                        </Button>
                    </form>
                </div>
            </main>
        </div> 
    )
}