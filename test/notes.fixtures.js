function makeNotesArray(){
    return [
        {
            id:1,
            name: 'note1', 
            modified: '2019-01-03T00:00:00.000Z', 
            folderid: 1, 
            content: 'test content 1'
        },
        {
            id:2,
            name: 'note2', 
            modified: '2019-01-03T00:00:00.000Z', 
            folderid: 2, 
            content: 'test content 2'
        },
        {
            id:3,
            name: 'note3', 
            modified: '2019-01-03T00:00:00.000Z', 
            folderid: 3, 
            content: 'test content 3'
        },
    ];
}

function makeMaliciousNote(){
    const maliciousNote = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>', 
        modified: '2019-01-03T00:00:00.000Z', 
        folderid: 1, 
        content: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.'
    }
    const expectedNote = {
        ...maliciousNote,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        content: 'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.'
    }
    return {
        maliciousNote,
        expectedNote,
    }
}

module.exports = {
    makeNotesArray,
    makeMaliciousNote
};