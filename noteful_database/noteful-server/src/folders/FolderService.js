

const FolderService ={
  getAllFolders(knex){
    return knex
      .select('*')
      .from('noteful_folders')
  },
  insertFolder(knex,newFolder){
    return knex
      .insert(newFolder)
      .into('noteful_folders')
      .returning('*')
      .then(row=>{
        return row[0]
      })
  },
  getById(knex,id){
    return knex
      .select('*')
      .from('noteful_folders')
      .where('id',id)
      .first()
  },

}

module.exports = FolderService