const { query } = require('../db/db-module');

module.exports = {
    searchBook,
    createBook,
    getMemberBooks,
    deleteBook,
    searchDetail,
    interested,
    memberInterestedBooks,
    searchALlBooks,
    deleteIntBook,
    updateMajor,
    updateName,
    updatePhoneNum,
    getMember
}

async function searchALlBooks(req, res) {
    const sql = 'Select * from Book';
    const book = (await query(sql));
    return res.json(book);
}

async function searchBook(req, res) {
    const type = req.body.type;
    const value = req.body.value;
    const sql = 'Select * from Book  where ' + type + ' = ?';
    const book = (await query(sql, [value]));
    return res.json(book);
}

async function searchDetail(req, res) {
    const unid = req.body.unid;
    const sql = 'Select Title, Author, listPrice, Description, memberUname from Book, Owns where unid = ? and bookUnid = unid';
    const book = (await query(sql, unid));
    return res.json(book);
}

async function createBook(req, res) {
    const isbn = req.body.isbn;
    const title = req.body.title;
    const author = req.body.author;
    const desc = req.body.description;
    const subject = req.body.subject;
    const oprice = req.body.oprice;
    const cprice = req.body.cprice;
    const member = req.body.member;

    // returning into to get unid instead of isbn
    var sql = 'INSERT INTO Book (Isbn, Title, origPrice, listPrice, Author, Description, Subject) values (?,?,?,?,?,?,?) ';
    var data = [
        isbn,
        title,
        oprice,
        cprice,
        author,
        desc,
        subject,
    ];
    const createBook = (await query(sql, data));
    var getunid = 'Select unid FROM Book where Isbn = ?';
    const bkID = (await query(getunid, isbn));
    var own = [
        bkID[0].unid,
        member
    ];
    var createRelation = 'INSERT INTO Owns (bookUnid, memberUname) VALUES (?, ?)';
    const ownsRelation = (await query(createRelation, own));
    return res.json(ownsRelation);
}

async function getMemberBooks(req, res) {
    const member = req.body.member;
    const sql = 'Select Book.unid, Book.Isbn, Book.Title, Book.Author From Book, Owns Where Owns.bookUnid=Book.unid And Owns.memberUname=?';
    const books = (await query(sql, member));
    return res.json(books);
}

async function deleteBook(req, res) {
    const unid = req.body.unid;
    const sql = 'Delete From Book Where unid=?';
    const del = (await query(sql, unid));
    return res.json(del);
}
async function updateMajor(req, res) {
    const major = req.body.major;
    const uname = req.body.uname;
    const sql = 'update Member set major = ? where uname = ?';
    var data = [major, uname];
    const up = (await query(sql, data));
    return res.json(up);
}

async function updateName(req, res) {
    const name = req.body.name;
    const uname = req.body.uname;
    const sql = 'update Member set name = ? where uname = ?';
    var data = [name, uname];
    const up = (await query(sql, data));
    return res.json(up);
}

async function updatePhoneNum(req, res) {
    const phone = req.body.phone;
    const uname = req.body.uname;
    const sql = 'update Member set phone = ? where uname = ?';
    var data = [phone, uname];
    const up = (await query(sql, data));
    return res.json(up);
}

async function getMember(req, res) {
    const uname = req.body.uname;
    const sql = "select uname, name, major, phone, email from Member where uname = ?";
    const obj = (await query(sql, uname));
    return res.json(obj)
}

async function interested(req, res) {
    const member = req.body.member;
    const book = req.body.book;
    var data = [
        member,
        book
    ];
    const sql = 'INSERT INTO Interested VALUES ( ?,? )';
    const interestedRelation = (await query(sql, data));
    const sql1 ='Select uname,email,name,phone from Member, Owns where Owns.memberUname = Member.uname and Owns.bookUnid = ?';
    const memberInfo = (await query(sql1, book));
    return res.json(memberInfo);
}

async function memberInterestedBooks(req, res) {
    const member = req.body.member;
    const sql = 'Select unid, Isbn, Title, Author From Book, Interested Where bookUnid = unid and memberUname = ?'
    const result = (await query(sql, member));
    return res.json(result);
}

async function deleteIntBook(req, res) {
    const unid = req.body.unid;
    const sql = 'Delete From Interested Where bookUnid = ?';
    const result = (await query(sql, unid));
    return res.json(result);
}
