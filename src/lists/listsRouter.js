const path = require('path')
const express = require('express')
const xss = require('xss')
const ListsService = require('./listsService')
const listsRouter = express.Router()
const jsonParser = express.json()

const serializeList = list => ({
    id: list.id,
    name: xss(list.name),
    modified: list.modified, 
    folderid: list.folderid, 
    content: xss(list.content)
})

listsRouter 
    .route('/')
    .get((req,res,next)=>{
        ListsService.getAllLists(
            req.app.get('db')
        )
            .then(lists=>{
                res.json(lists.map(serializeList))
            })
            .catch(next)
    })
    .post(jsonParser, (req,res,next)=>{
        const {name,modified,folderid,content} = req.body
        const newList = {name,modified,folderid,content}

        //VALIDATION

        //name is required
        if(!newList.name){
            return res
                .status(400)
                .send({error: {message:`Missing 'name' in request body`}})
        }

        //content is required
        if(!newList.content){
            return res
                .status(400)
                .send({error: {message:`Missing 'content' in request body`}})
        }
        
        //folderid is required
        if(!newList.folderid){
            return res
                .status(400)
                .send({error: {message:`Missing 'folderid' in request body`}})
        }

        ListsService.insertList(
            req.app.get('db'),
            newList
        )
            .then(list=>{
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl,`/${list.id}`))
                    .json(serializeList(list))
            })
            .catch(next)
    })

listsRouter
    .route('/:list_id')
    .all((req, res, next)=>{
        ListsService.getById(
            req.app.get('db'),
            req.params.list_id
        )
            .then(list=>{
                if(!list){
                    return res.status(404).json({
                        error: {message: `List doesn't exist`}
                    })
                }
                res.list=list
                next()
            })
            .catch(next)
    })
    .get((req,res,next)=>{
        res.json(serializeList(res.list))
    })
    .delete((req,res,next)=>{
        ListsService.deleteList(
            req.app.get('db'),
            req.params.list_id
        )
            .then(()=>{
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser,(req,res,next)=>{
        const {name,modified,folderId,content} = req.body
        const listToUpdate = {name,modified,folderId,content}

        const numberOfValues = Object.values
        (listToUpdate).filter(Boolean).length
            if(numberOfValues===0){
                return res.status(400).json({
                    error: {
                        message: `Request body must contain 'name','modified','folderId', or 'content'`
                    }
                })
            }

        ListsService.updateList(
            req.app.get('db'),
            req.params.list_id,
            listToUpdate
        )
            .then(numRowsAffected=>{
                res.status(204).end()
            })
            .catch(next)
    })


module.exports = listsRouter;