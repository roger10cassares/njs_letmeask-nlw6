
import { type } from "os";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

import '../styles/room.scss';

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth();
    // RoomParams server to type, to know the params that this route should receive
    const params = useParams<RoomParams>();
    const [newQuestion,setNewQuestion] = useState('')
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('')


    const roomId = params.id;

// useEffect is a Hook that dispatch an event always that some info changes
    useEffect(() => {
        const roomRef = database.ref(`/rooms/${roomId}`);

        // Here an event is being listening. Once (just once). On (stay listening)
        // roomRef.once('value', room => {
        // Here we should listen just the appens or modifications to make the changes , not hearing all changes
        // https://firebase.google.com/docs/database/admin/retrieve-data?hl=pt-br
        roomRef.on('value', room => {
            const databaseRoom = room.val()
            const FirebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(FirebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
            })
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions)
        })
    },[roomId])

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author : {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false
        };

        await database.ref(`/rooms/${roomId}/questions`).push(question);

        setNewQuestion('');
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Room {title}</h1>
                    { questions.length > 0 && <span>{questions.length} question(s)</span> }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="What do you want to ask?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>To send a question, <button>please make your login</button>.</span>

                        )}
                        <Button type="submit" disabled={!user}>
                            Send the question
                        </Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    )
}