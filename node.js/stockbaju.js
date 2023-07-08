const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;

const multer = require('multer')
const path = require('path')
var cors = require('cors');

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: '*'
}));


// script upload

app.use(express.static("./public"))
 //! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
}); 

// create data / insert data
app.post('/api/stock_baju',upload.single('images'),(req, res) => {


    const data = { ...req.body };
    const kodeproduk = req.body.kodeproduk;
    const namaproduk = req.body.namaproduk;
    const kategori = req.body.kategori;
    const ukuran = req.body.ukuran;
    const harga = req.body.harga;
    const warna = req.body.warna;

    if (!req.file) {
        console.log("No file upload");
        const querySql = 'INSERT INTO stock_baju (kodeproduk,namaproduk,kategori,harga,ukuran,warna) values (?,?,?,?,?,?);';
         
        // jalankan query
        koneksi.query(querySql,[ kodeproduk,namaproduk,kategori,harga,ukuran,warna], (err, rows, field) => {
            // error handling
            if (err) {
                return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }
       
            // jika request berhasil
            res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://localhost:5000/images/' + req.file.filename;
        const foto =   imgsrc;
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySql = 'INSERT INTO stock_baju (kodeproduk,namaproduk,kategori,harga,ukuran,warna,foto) values (?,?,?,?,?,?,?);';
 
// jalankan query
koneksi.query(querySql,[ kodeproduk,namaproduk,kategori,harga,ukuran,warna,foto], (err, rows, field) => {
    // error handling
    if (err) {
        return res.status(500).json({ message: 'Gagal insert data!', error: err });
    }

    // jika request berhasil
    res.status(201).json({ success: true, message: 'Berhasil insert data!' });
});
}
});

// read data / get data
app.get('/api/stock_baju', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM stock_baju';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});

// update data
app.put('/api/stock_baju/:kodeproduk', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM stock_baju WHERE kodeproduk = ?';
    const kodeproduk = req.body.kodeproduk;
    const namaproduk = req.body.namaproduk;
    const kategori = req.body.kategori;
    const harga = req.body.harga;
    const ukuran = req.body.ukuran;
    const warna = req.body.warna;

    const queryUpdate = 'UPDATE stock_baju SET namaproduk=?,harga=?,ukuran=? WHERE kodeproduk = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.kodeproduk, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [namaproduk,harga,ukuran, req.params.kodeproduk], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// delete data
app.delete('/api/stock_baju/:kodeproduk', (req, res) => {
    // buat query sql untuk mencari data dan hapus
    const querySearch = 'SELECT * FROM stock_baju WHERE kodeproduk = ?';
    const queryDelete = 'DELETE FROM stock_baju WHERE kodeproduk = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.kodeproduk, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query delete
            koneksi.query(queryDelete, req.params.kodeproduk, (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika delete berhasil
                res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// buat server nya
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
