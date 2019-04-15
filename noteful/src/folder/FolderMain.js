import React from 'react'

import {Link} from 'react-router-dom'
import NotefulContext from '../contextFolder/notefulContext'

const noteRemoveRequest=(noteId,callback)=>{
  fetch(`http://localhost:9090/notes/${noteId}`, {
  method: 'DELETE',
  headers: {
    'content-type': 'application/json'
  },
}).then(res=>{
  if(!res.ok){
   return res.json().then(error=>{
      throw new Error(error)
    })
  }return res.json()
  
}).then(()=>{
  console.log('test delete handle noteId',noteId)
  callback(noteId)
})
}

class FolderMain extends React.Component{
  
  static contextType = NotefulContext;
render(){
  
  //console.log('testing props',this.props.match.params.folderId)
  //console.log(Data.notes,'test data note')
  const notesForFolder = this.context.notes.filter(note=>
    note.folderId===this.props.match.params.folderId
  )
  //console.log(notesForFolder,'test noteforfolder')
  return(
    <ul>
    {notesForFolder.map(note=>
      <li key={note.id}>
        <Link to={`/note/${note.id}`}>
        <h6>{note.name}</h6>
        </Link>
        <span>Modified {note.modified}</span>
        <button
        onClick={()=>noteRemoveRequest(note.id,this.context.removeNote)}
        >Remove</button>
      </li>)}
      <Link to='/notes/addNote'>Add note</Link>
    </ul>
  )
}
}

export default FolderMain