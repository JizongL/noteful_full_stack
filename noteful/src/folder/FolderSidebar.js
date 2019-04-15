import React from 'react'
import {Link} from 'react-router-dom'
import NotefulContext from '../contextFolder/notefulContext'




class FolderSidebar extends React.Component{
  static contextType = NotefulContext

  render(){
 
    return(
      <ul>
      {this.context.folders.map(folder=>
      <li key={folder.id}>
      <Link to={`/folder/${folder.id}`}>
      {folder.name}
      </Link>
      </li>
    )}
    <Link to='/folder/addFolder'>Add folder</Link>
      </ul>
    )
  }
}

export default FolderSidebar