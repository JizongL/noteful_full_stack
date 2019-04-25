const path = require('path')
const express = require('express')
const xss = require('xss')
const folderRouter = express.Router()
const jsonParser = express.json()
const FolderService = require('./FolderService')

const serializeFolder = folder =>({
  id:folder.id,
  folder_name:xss(folder.folder_name),
})

folderRouter
.route('/')
.get((req,res,next)=>{
  const knexInstance = req.app.get('db')
  FolderService.getAllFolders(knexInstance)
    .then(folders =>{
      res.json(folders.map(serializeFolder))
    })
    .catch(next)
})

.post(jsonParser,(req,res,next)=>{
  const {folder_name } = req.body
  const newFolder = {folder_name}
  console.log(newFolder,'test folder')
  for (const [key, value] of Object.entries(newFolder))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing "${key}" in request body` }
        })

  newFolder.folder_name = folder_name;
  
  FolderService.insertFolder(
      req.app.get('db'),
      newFolder
    )
    .then(folder=>{
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${folder.id}`))
        //.json(folder)
        .json(serializeFolder(folder))
    })
    .catch(next)

})

module.exports = folderRouter