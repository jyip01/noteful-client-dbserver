function makeFoldersArray(){
    return [
        {
            id: 1,
            name: 'fold1'
        },
        {
            id: 2,
            name: 'fold2'
        },
        {
            id: 3,
            name: 'fold3'
        },
    ];
}

function makeMaliciousFolder(){
    const maliciousFolder = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    }
    const expectedFolder = {
        ...maliciousFolder,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    }
    return {
        maliciousFolder,
        expectedFolder
    }
}

module.exports = {
    makeFoldersArray,
    makeMaliciousFolder
};