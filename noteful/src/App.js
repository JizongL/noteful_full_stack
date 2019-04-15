import React, { Component } from 'react';
import './App.css';
import {Route,Link} from 'react-router-dom'
import AddFolder from './folder/AddFolder'
import MainSidebar from './main/MainSidebar'
import FolderMain from './folder/FolderMain'
import MainMain from './main/MainMain'
import Note from './note/Note'
import FolderSidebar from './folder/FolderSidebar';
import NotefulContext from './contextFolder/notefulContext'
import AddNote from './note/addNote'
import NotefulError from './errorBoundary/notefulError'

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      folders:[],
      notes:[],
      error:''
    }

  }
  
  
  
  componentDidMount(){
    
    fetch("http://localhost:9090/folders").then(
     res=> {if(!res.ok){
       return res.json().then(error=>{throw new Error(error)})
     }
     return res.json()
    }
     
    ).then(folders=>{
      this.setState({folders:folders})
    }).catch(error=>{this.setState({
      error:error
    })

    });
    fetch("http://localhost:9090/notes").then(
     res=> {if(!res.ok){
       return res.json()
        .then(error=>{throw new Error(error)})
     }
      return res.json()
    }
     
    ).then(notes=>{
      this.setState({notes:notes})
    }).catch(error=>{this.setState({
      error:error
    })

    })

  }

  removeNoteHandle=(noteId)=>{
    const newNote = this.state.notes.filter(note=>note.id!==noteId)
    console.log(newNote,'test newNote')
    this.setState({notes:newNote})
    
  }

  addFolderHandle=(newFolder)=>{
    const newFolders=this.state.folders
    newFolders.push(newFolder)
    this.setState({folders:newFolders})
  }

  addNoteHandle=(newNote)=>{
    const newNotes = this.state.notes
    newNotes.push(newNote)
    this.setState({notes:newNotes})
  }

  render() {
    //console.log(this.state,'testing state data')
    const value={
      folders:this.state.folders,
      notes:this.state.notes,
      removeNote:this.removeNoteHandle,
      addFolder:this.addFolderHandle,
      addNote:this.addNoteHandle
    }
    return (
      <NotefulContext.Provider value={value}>

      <div className="App">
        <header>
          <Link to='/'>
          <h1>Noteful</h1>
          </Link>
        </header>
        <nav>
    
        
        <Route exact path='/' 
        component={MainSidebar}/>
        <Route path='/folder' 
         component={FolderSidebar}/>
     
       
        </nav>
        
        <main>
          
            <Route exact path='/' component={MainMain}/>      
            <Route path='/folder/:folderId' component={FolderMain}/>
            <Route path='/note/:noteId' component={Note}/>        
            <Route path='/folder/addFolder' component = {AddFolder}/>
            <Route path='/notes/addNote' component = {AddNote}/>
          
        </main>
      </div>
      </NotefulContext.Provider>
    );
  }
}

export default App;
