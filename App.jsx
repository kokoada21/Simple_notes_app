import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([]);
    const [currentNoteId, setCurrentNoteId] = React.useState([]);
    const [tempNoteText, setTempNoteText] = React.useState("");

    const currentNote =
        notes.find(note => note.id === currentNoteId)
        || notes[0]    
        
    const sortedNotes = notes.sort((a,b) => b.updatedAt - a.updatedAt);
    
    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr);
        })
        //handling unsubscibtion from websocket in case of an error
        return () => unsubscribe()
    }, [])

    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docUpdate = { body: text, updatedAt: Date.now()};
        const docref = doc(db, "notes", currentNoteId);
        await setDoc(docref, docUpdate, { merge: true });
    }

    //when current note is changed, whole tempNoteText state is changed to current note text
    React.useEffect(() => {
        if(currentNote){
            setTempNoteText(currentNote.body);
        }
    }, [currentNote])

    //Use effect that runs on every keystroke
    //Timeout makes sure the data gets sent only after user stops writing
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            //preventing update if note is only selected
            if(tempNoteText !== currentNote.body){
                updateNote(tempNoteText);
            }
        }, 500)
        //Timeout cleanup when another key is pressed
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    async function deleteNote(noteId) {
        const docref = doc(db, "notes", noteId);
        await deleteDoc(docref);
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                        />
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
