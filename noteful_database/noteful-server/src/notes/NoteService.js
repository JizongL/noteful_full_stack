const NoteService ={
  getAllNotes(knex){
    return knex
    .select('*')
    .from('noteful_notes')
  },
  insertNote(knex,newNote){
    return knex
    .insert(newNote)
    .into('noteful_notes')
    .returning('*')
    .then(row=>{
      return row[0]
    })

  },
  getById(knex,id){
    return knex
      .select('*')
      .from('noteful_notes')
      .where('id',id)
      .first()
  },

}

module.exports = NoteService