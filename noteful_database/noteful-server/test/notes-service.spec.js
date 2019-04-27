const {expect} = require('chai')
const knex = require('knex')
const app = require('../src/app')
const {makeNotesArray} = require('./notes.fixtures')
const {makeFoldersArray}= require('./folders.fixtures')
const NoteService = require('../src/notes/NoteService')
//const FolderService = require('../src/folders/FolderService')

describe.only(`Notes Endpoints`,()=>{
  let db
  before('make knex instance',()=>{
    db=knex({
      client:'pg',
      connection:process.env.TEST_DB_URL
    })
    app.set('db',db)
  })
  after('disconnect from db',()=>db.destroy())
  before('clean the table',()=>db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))
  afterEach('clean the table',()=>db.raw('TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE'))

  describe(`GET /api/notes`,()=>{
    context(`Given no notes`,()=>{
      it(`GET /api/notes responds with 200 and an empty array`,()=>{
        return supertest(app)
        .get(`/api/notes`)
        .expect(200,[])
      })
    })
    context(`Given there are notes in the database`,()=>{
      const testNotes = makeNotesArray()
      const testFolders = makeFoldersArray()
      beforeEach('insert notes',()=>{
        return db
        .into('noteful_folders')
        .insert(testFolders)
        .then(()=>{
          return db
          .into('noteful_notes')
          .insert(testNotes)
        })
      })
      it(`GET /api/notes responds with 200 and all the notes`,()=>{
        return supertest(app)
          .get('/api/notes')
          .expect(200,testNotes)
      })
    })

  })
  describe(`POST /api/notes`,()=>{
    const testNotes = makeNotesArray()
    const testFolders = makeFoldersArray()
    beforeEach('insert notes',()=>{
      return db
      .into('noteful_folders')
      .insert(testFolders)
      // .then(()=>{
      //   return db
      //   .into('noteful_notes')
      //   .insert(testNotes)
      // })
    })

    it('create a note, responding with 201 and the new note',function(){
        this.retries(3)
        const newNote ={
          note_name:'note 6',
          content:'note 6 content',                 
          folder:1
        }
        return supertest(app)
          .post('/api/notes')
          .send(newNote)
          .expect(201)
          .expect(res=>{
            expect(res.body.note_name).to.eql(newNote.note_name)
            expect(res.body.content).to.eql(newNote.content)
            expect(res.body.folder).to.eql(newNote.folder)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/notes/${res.body.id}`)
            const expected = new Date().toLocaleString()
            const actual = new Date(res.body.date_added).toLocaleString()
            expect(actual).to.eql(expected)
          })
    })
  })
})