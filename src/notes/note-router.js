const path = require('path');
const express = require('express');
const noteRouter = express.Router();
//const bodyParser = express.json();
const notesService = require('./notesService');
const xss = require('xss');
const jsonParser = express.json();

//var uniqid = require('uniqid');

const serializeNote = note => ({
  id: note.id,
  name: xss(note.name),
  modified: note.modified,
  folderId: note.folder_id,
  content: xss(note.content)
});

noteRouter
  .route('/')
  .get((req,res,next) => {
    //const knexInstance = req.app.get('db');
    notesService.getAllNotes(
      req.app.get('db')
    )
      .then(notes=>{
        res.json(notes.map(serializeNote))
      })
      .catch((err) => {
        next(err)
     })
  })

  .post(jsonParser, (req,res,next) =>{
    //different
    const {name,modified,folderid,content} = req.body
    console.log(req.body, "List body is something")
    const newNote = {name,modified,folderid,content}

    //VALIDATION

    //name is required
    if(!newNote.name){
      return res
        .status(400)
        .send({error: {message:`Missing 'name' in request body`}})
    }

    //content is required
    if(!newNote.content){
      return res
        .status(400)
        .send({error: {message:`Missing 'content' in request body`}})
    }
        
    //folderid is required
    if(!newNote.folderid){
      return res
        .status(400)
        .send({error: {message:`Missing 'folderid' in request body`}})
    }

    
    notesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(req.originalUrl +`/${note.id}`)
          .json(serializeNote(note));
      })
      .catch(next);
  });
noteRouter  
  .route('/:note_id')
  .all((req,res,next)=>{
    notesService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(note =>{
        if (!note) {
          return res.status(404).json({
            error: { message: 'Note doesn\'t exist' }
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })

  .get((req,res,next) => {
    res.json(serializeNote(res.note));
  })
  .delete((req,res,next)=>{
    //const { id } = req.params;
    //const knexInstance = req.app.get('db');
    notesService.deleteNote(
      req.app.get('db'),
        req.params.note_id
    )

      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, modified, folder_id, content } = req.body;
    const noteToUpdate = { name, modified, folder_id, content };

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'request body must contain either \'name\', \'modified\', \'folder_id\' or \'content\''
        }
      });
    }

    notesService.updateNote(
      req.app.get('db'),
      req.params.id,
      noteToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

  module.exports = noteRouter;  
  