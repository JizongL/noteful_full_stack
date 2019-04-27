const path = require('path')
const express = require('express')
const xss = require('xss')
const noteRouter = express.Router()
const jsonParser = express.json()
const NoteService = require('./NoteService')


const serializeNote = note =>({
// change to note
  id:note.id,
  note_name:xss(note.note_name),
  content:xss(note.content),
  date_added:note.date_added,
  folder:note.folder
})


noteRouter
.route('/')
.get((req,res,next)=>{
  const knexInstance = req.app.get('db')
  NoteService.getAllNotes(knexInstance)
  .then(notes=>{
    res.json(notes.map(serializeNote))
  })
  .catch(next)
})

.post(jsonParser,(req,res,next)=>{
  const {note_name,content,folder} = req.body
  const newNote = {note_name,content,folder}
  for (const [key, value] of Object.entries(newNote))
  if (value == null)
    return res.status(400).json({
      error: { message: `Missing "${key}" in request body` }
    })
    NoteService.insertNote(
      req.app.get('db'),
      newNote
    )
    .then(note=>{
      res 
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${note.id}`))
      .json(serializeNote(note))
    })
    .catch(next)
})


module.exports = noteRouter