const {expect} = require('chai')
const knex = require('knex')
const app = require('../src/app')
const {makeFoldersArray} = require('./folders.fixtures')
//const FolderService = require('../src/folders/FolderService')

describe('Folders Endpoints',()=>{
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
  
  describe(`GET /api/folders`,()=>{
    context('Given no folders',()=>{
      it(`GET /api/folders responds with 200 and an empty array`,()=>{
        return supertest(app)
        .get('/api/folders')
        .expect(200,[])
      })
    })
    context('Given there are folders in the database',()=>{
      const testFolders = makeFoldersArray();
      beforeEach('insert folders',()=>{
        return db
        .into('noteful_folders')
        .insert(testFolders)
        
      })

      it(`GET /api/folders responds with 200 and all the folders`,()=>{
        return supertest(app)
          .get('/api/folders')
          .expect(200,testFolders)
      })
    })
  })

  describe(`POST /api/folders`,()=>{
    it(`create a folder, responding with 201 and the new folder`,function(){
      this.retries(3)
      
      const newFolder = {
        folder_name:'test new folder',        
      }
      return supertest(app)
        .post('/api/folders/')
        .send(newFolder)
        .expect(201)
        .expect(res =>{
          expect(res.body.folder_name).to.eql(newFolder.folder_name)
        })
    })
    const newFolder = {
      
    }
    it(`respond with 400 and an error message when folder name is missing`,()=>{
      return supertest(app)
        .post('/api/folders/')
        .send(newFolder)
        .expect(400,{error:{message:'Missing "folder_name" in request body'}})
    })
    const maliciousFolderName = {
      folder_name:'<script>alert("xss");</script>'
    }
    it(`responds with 201 and posted malicious content`,()=>{
      return supertest(app)
        .post('/api/folders/')
        .send(maliciousFolderName)
        .expect(201)
        .expect(res=>{
          expect(res.body.folder_name).to.eql('&lt;script&gt;alert("xss");&lt;/script&gt;')
        })
    })

  })

  // no delete test yet for folders. 
  
})