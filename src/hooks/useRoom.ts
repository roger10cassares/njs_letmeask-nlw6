import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";


type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    // hasLiked: boolean;
    likeId: string | undefined;
}


export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('')

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
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    // hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id)
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                    // some return if you found or not
                    // find returns the object you found
                }
            })
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions)
        })

        return () => {
            roomRef.off('value');
        }
    },[roomId, user?.id])
    // uf user.id is an external var that the useEffect depends to execute successfully, it migh be passed to the [] together with the lookup change var
// if user.id ramdomly ChannelMergerNode, data will be reload according to the id

    return { questions, title }
}