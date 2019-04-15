import React from 'react'
import {Link} from 'react-router-dom'
import NotefulContext from '../contextFolder/notefulContext';

// note:
// need to validate note name no repeat




class AddNote extends React.Component{
  static contextType = NotefulContext
  constructor(props){
    super(props)
    let date = new Date().toISOString()
    this.state={
      name:'',
      content:'',
      folderId:'',
      modified:date
    }
  }
  
  


  newDate =()=>{
    let date = new Date()
    this.setState({modified:date.toISOString()})
  }
  newNoteRequest=(e)=>{
    e.preventDefault()
    console.log(JSON.stringify(this.state),'test this.state in request handle')
    if(this.state.folderId)
    fetch(`http://localhost:9090/notes`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  body:JSON.stringify(this.state)
}).then(res=>{
  if(!res.ok){
    return res.json().then(error=>{throw new Error(error)})
  }
  
  return res.json()
}).then(
  (data)=>{
    console.log('added test',data)
    this.context.addNote(data)
    this.props.history.push(`/folder/${this.state.folderId}`)
  })
  }

  inputNameHanle=(e)=>{
    this.setState({name:e.target.value})
  }

  inputContentHandle=(e)=>{
    
    this.setState({content:e.target.value})
  }

  inputFolderHandle=(e)=>{
    let newFolder = e.target.value
    const foundFolder = this.context.folders.filter(folder=>folder.name===newFolder)
    console.log(foundFolder[0].id,'test found folder')
    this.setState({folderId:foundFolder[0].id})
  }

  render(){
   
    console.log(this.props.match,'this.context test')
    
    console.log(JSON.stringify(this.state),'test state json')
    const folderOption = this.context.folders.map(folder=>
       <option id ={folder.id} key={folder.id}>{folder.name}</option>
     )
      


    return(
      <div className='add-note-container'>
      <form className='add-note-form'
      onSubmit={(e)=>this.newNoteRequest(e)}>
        <label>Name
        <input placeholder='name' onChange={(e)=>this.inputNameHanle(e)}/>
        </label>
        <label>Content
        <textarea placeholder='content' onChange={(e)=>this.inputContentHandle(e)}/>
        </label>
        <label>Folder
        <select onChange={(e)=>this.inputFolderHandle(e)}>
        <option >choose folder</option>
        {folderOption}
        </select>
        </label>

      <button type='submit'>Submit</button>
      </form>
      <Link to='/'>Back</Link>
      </div>
    )
  }
}

export default AddNote