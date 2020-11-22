import logo from './logo.svg';
import './App.css';
import {withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import {listNotes} from './graphql/queries';
import {createNote as createNoteMutation, deleteNote as DeleteNoteMutation} from './graphql/mutations';
import {API} from 'aws-amplify';
const initialState={name: '', description:''}
function App() {

  


const [notes, setNotes] =useState([]);
const [formData, setFormData] = useState(initialState);

useEffect(()=>{
  fetchNotes();
},[]);

async function fetchNotes() {
 const api = await API.graphql({query: listNotes});
 setNotes(api.data.listNotes.items);
 
}

async function createNote() {
  if(!formData.name  || !formData.description)return;
  await API.graphql({query: createNoteMutation, variables: {input: formData}});
  setNotes([...notes, formData]);
  setFormData(initialState);
}

async function deleteNote({id}){
  const newNotesArray = notes.filter(i=> i.id != id);
  setNotes(newNotesArray);
  await API.graphql({query: DeleteNoteMutation, variables: {input: id}})
  
}

  return (
    <div className="App">
      <input onChange={(e)=> setFormData({...formData, 'name': e.target.value})}
      placeholder="Note Name"
      value={formData.name}
      />
      <input onChange={(e)=> setFormData({...formData, 'description': e.target.value})}
      placeholder="Note Description"
      value={formData.description } />
      <button onClick={createNote}>Create Note</button>
      <div style={{marginBottom:30}}>
        {
          notes.map( note=> (
            <div key={note.id || note.name}>
              <h2>{note.name}</h2>
              <p>{note.description}
              </p>
              <button onClick = {()=> deleteNote(note)}>Delete Note</button>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
    
  );
}

export default withAuthenticator(App);
