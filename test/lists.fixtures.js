function makeListsArray(){
  return [
      {
          id:1,
          name: 'list1', 
          modified: '2019-01-03T00:00:00.000Z', 
          folderid: 1, 
          content: 'test content 1'
      },
      {
          id:2,
          name: 'list2', 
          modified: '2019-01-03T00:00:00.000Z', 
          folderid: 2, 
          content: 'test content 2'
      },
      {
          id:3,
          name: 'list3', 
          modified: '2019-01-03T00:00:00.000Z', 
          folderid: 3, 
          content: 'test content 3'
      },
  ];
}

function makeMaliciousList(){
  const maliciousList = {
      id: 911,
      name: 'Naughty naughty very naughty <script>alert("xss");</script>', 
      modified: '2019-01-03T00:00:00.000Z', 
      folderid: 1, 
      content: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.'
  }
  const expectedList = {
      ...maliciousList,
      name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      content: 'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.'
  }
  return {
      maliciousList,
      expectedList,
  }
}

module.exports = {
  makeListsArray,
  makeMaliciousList
}