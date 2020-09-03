const path = require('path');
const express = require('express');
const folderRouter = express.Router();
const jsonParser = express.json();
//const uuid = require('uuid');
const foldersService = require('./foldersService');
const xss = require('xss');

//var uniqid = require('uniqid');

const serializeFolder = folder => ({
  id: folder.id,
  name: xss(folder.name)
});

folderRouter
  .route('/')
  .get((req,res,next) => {
    //const knexInstance = req.app.get('db');
    foldersService.getAllFolders(
      req.app.get('db')
    )
      .then(folders => {
        res.json(folders.map(serializeFolder));
      })
      .catch((err) => {
        next(err)
     })
  })
  .post((req,res,next) =>{
    const {name} = req.body;
    console.log(req.body, "Folder body is something")
    const newFolder = { name };

    //VALIDATION
    //name is required
      if(!newFolder.name){
        return res
          .status(400)
          .send({error: {message:`Missing 'name' in request body`}})
      }

    foldersService.insertFolder(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res
          .status(201)
          .location(req.originalUrl +`/${folder.id}`)
          .json(serializeFolder(folder));
      })
      .catch(next);
  });


folderRouter  
  .route('/:folder_id')
  .all((req,res,next)=>{
    foldersService.getById(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(folder =>{
        if (!folder) {
          return res.status(404).json({
            error: { message: 'Folder doesn\'t exist' }
          });
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req,res,next) => {
    //const knexInstance = req.app.get('db');
    /*foldersService.getFolderNotes(knexInstance, req.params.id)
      .then((notes)=>{
        res.json(notes.map(note=>serializeNote(note)));
      })
      .catch(next);*/
      res.json(serializeFolder(res.folder))
  })
  .delete((req,res,next)=>{
    //const { id } = req.params;
    //const knexInstance = req.app.get('db');
    foldersService.deleteFolder(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { name} = req.body;
    const folderToUpdate = { name};

    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'request body must contain \'name\''
        }
      });
    }

    foldersService.updateFolder(
      req.app.get('db'),
      req.params.folder_id,
      folderToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

  module.exports = folderRouter;
  