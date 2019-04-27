import React from 'react'
import {Link} from 'react-router-dom'

import NotefulContext from '../contextFolder/notefulContext'




class Note extends React.Component{
state={
  note:'',
  noteId:''
}
  static contextType = NotefulContext;
   noteRemoveRequest=(noteId,callback)=>{
    fetch(`http://localhost:9090/api/notes/${noteId}`, {
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
    
    this.props.history.push('/')
    callback(noteId)
    
  }).catch(err=>console.log(err))
  }
  
  
  render(){
    const noteForRender = this.context.notes.filter(note=>
      note.id ===Number(this.props.match.params.noteId))
      console.log(this.context.notes,'test note id')
      console.log(this.context,'test note for context')
      console.log(typeof this.props.match.params.noteId,'test note for render')
      
      let noteId = noteForRender[0].id
      console.log(noteForRender[0],'test modified')
    return(
      <div className='note'>
      <ul>
        <li key={noteId}>
        <Link to={`/note/${noteId}`}>
        <h6>{noteForRender[0].note_name}</h6>
        </Link>
        <span>Modified {noteForRender[0].date_added}</span>
      </li>
      </ul>
        {noteForRender[0].content}
        <button
        onClick={()=>this.noteRemoveRequest(noteId,this.context.removeNote)}
        >Remove</button>
        <Link to={`/folder/${noteForRender[0].folderId}`}>
          Return
        </Link>
      </div>

    )
  }
}

export default Note