import React from 'react'

export default function ValidateFolderName(props){
  if(props.hasError){
    //console.log(props,'test validatefolder')
    return(
      <div className='folder-name-input-error'>
        {props.message}
      </div>
    )
  }
  return<></>
}