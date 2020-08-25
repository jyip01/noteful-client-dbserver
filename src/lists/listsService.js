const ListsService = {
    getAllLists(knex){
        return knex.select('*').from('lists')
    },
    insertList(knex,newList){
        return knex
            .insert(newList)
            .into('lists')
            .returning('*')
            .then(rows=>{
                return rows[0]
            })
    },
    getById(knex,id){
        return knex 
            .from('lists')
            .select('*')
            .where('id',id)
            .first()
    },
    deleteList(knex,id){
        return knex('lists') 
            .where({id})
            .delete()
    },
    updateList(knex,id,newListFields){
        return knex('lists')
            .where({id})
            .update(newListFields)
    }
}

module.exports = ListsService;