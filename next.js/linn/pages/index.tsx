import { useState,useEffect } from "react";
import axios from "axios";
import { stat } from "fs";

 
 const koneksiStock_baju = axios.create({
  
  baseURL: "http://127.0.0.1:5000/api/stock_baju" 
})

export default function FormStock_baju() {
    const [statekodeproduk, setKodeproduk] = useState("");
    const [statenamaproduk, setNamaproduk] = useState("");
    const [statekategori, setKategori] = useState("");
    const [stateharga, setHarga] = useState("");
    const [statefoto, setFoto] = useState("");
    const [stateukuran, setUkuran] = useState("");
    const [statewarna, setWarna] = useState("");
    const [stock_baju, setStock_baju] =  useState(null);
    const [stateadd,setAdd]=useState("hide");
    const [statebutonadd,setbtnAdd]=useState("show");
    const [stateedit,setEdit]=useState("hide");
    
  
  const handleSubmitAdd = (event) => {
    
    event.preventDefault();
    const formData = new FormData(event.target);
    koneksiStock_baju
      .post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
     
 }
 const handleSubmitEdit =  (event) => {
    
  event.preventDefault();
  const address = "/"+event.target.kodeproduk.value;
  alert(address);
  //const formData = new FormData(event.target);
  const formData = {
    kodeproduk: event.target.kodeproduk.value,
    namaproduk: event.target.namaproduk.value,
    kategori: event.target.kategori.value,
    harga: event.target.harga.value,
    ukuran: event.target.ukuran.value,
    warna: event.target.warna.value

}
  alert(formData);
  koneksiStock_baju
    .put( address,formData)
    .then((res) => {
      console.log(res);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
   
}
  const handleAdd = (event) => {
    
     setAdd("show");
     setbtnAdd("hide");
     setEdit("hide");
 
      
  }
  const handleCancelAdd = (event) => {
    
     setAdd("hide");
     setbtnAdd("show");
     setEdit("hide");
 
      
  }
  const handleCancelEdit = (event) => {
    
    setAdd("hide");
    setbtnAdd("show");
    setEdit("hide");
    setKodeproduk("");
    setNamaproduk("");
    setKategori("");
    setHarga("");
    setUkuran("");
    setWarna("");
    setFoto("");
     
 }
   const handleDelete = (event) => {
            event.preventDefault();
            var kodeproduk = event.target.value;
            koneksiStock_baju.delete(`/${kodeproduk}`)
              .then(response => {
                console.log('Data berhasil dihapus:', response.data);
                window.location.reload();

                setStock_baju(
                  stock_baju.filter((stock_baju) => {
                     return stock_baju.kodeproduk !== kodeproduk;
                  }))
             
                // Lakukan langkah-langkah lain setelah penghapusan data
              })
              .catch(error => {
                console.error('Gagal menghapus data:', error);
              })
          }

      const handleEdit = (event) => {
            event.preventDefault();
            var kodeproduk = event.target.value;
            
               const smtrEdit = stock_baju.filter((stock_baju) => {
                     return stock_baju.kodeproduk == kodeproduk;
                  });
                  if(smtrEdit!=null){

                    setKodeproduk(smtrEdit[0].kodeproduk);
                    setNamaproduk(smtrEdit[0].namaproduk);
                    setKategori(smtrEdit[0].kategori);
                    setHarga(smtrEdit[0].harga);
                    setUkuran(smtrEdit[0].ukuran);
                    setWarna(smtrEdit[0].warna)
                    setFoto(smtrEdit[0].foto);
                    setAdd("hide");
                    setbtnAdd("hide");
                    setEdit("show");

                  }
          }
  useEffect(() => {
      async function getStock_baju() {
        const response = await koneksiStock_baju.get("/").then(function (axiosResponse) {
            setStock_baju(axiosResponse.data.data); 
     
         })
         .catch(function (error) {   
          alert('error from stock_motor in api stock_motor: '+error);
         });;
          }
      getStock_baju();
    }, []);
  
   
if(stock_baju==null){
return(
  <center><div>
    waiting...
  </div></center>
)
}else{

  return (
   <center><div className="logo">
    <br></br><h1>NUKHABYHM</h1><br></br>
       <form id="formadd" className={stateadd} onSubmit={handleSubmitAdd} >
       <br/><h3>TAMBAH STOCK BAJU</h3><br/>
        <table border={0}>
            <tbody>
            <tr>
            <td> <label> KODE PRODUK:</label></td>
            <td><input type="text" id="kodeproduk" name="kodeproduk"/>
              
              </td>
        </tr>
        <tr>
            <td>  <label> NAMA PRODUK:</label></td>
            <td><input type="text" id="namaproduk"   name="namaproduk" 
               /></td>
        </tr>
        <tr>
            <td>  <label> KATEGORI:</label></td>
            <td><input type="text" id="kategori"   name="kategori" 
               /></td>
        </tr>
        <tr>
            <td>  <label> FOTO:</label></td>
            <td>   <input
                    type="file" name="images"/>  </td>
        </tr>
        <tr>
            <td>  <label> HARGA:</label></td>
            <td><input type="number" id="harga" name="harga"
            />
     </td>
        </tr>
        <tr>
            <td>  <label> UKURAN:</label></td>
            <td><input type="text" id="ukuran"   name="ukuran" 
               /></td>
        </tr>
        <tr>
            <td>  <label> WARNA:</label></td>
            <td><input type="text" id="warna"   name="warna" 
               /></td>
        </tr>
            </tbody>
          </table>
          <br/>
          <input type="submit"/> | <input type="button" value="Cancel" onClick={handleCancelAdd} /><br/><br/>
          </form>  

      <form id="formedit" className={stateedit} onSubmit={handleSubmitEdit}>
      <br/><h3>EDIT STOCK BAJU</h3><br/>
          <table border={0}>
            <tbody>
            <tr>
            <td> <label> KODE PRODUK:</label></td>
            <td><input type="text" id="kodeproduk"  value={statekodeproduk} name="kodeproduk"/>
              {/* onChange={handleOnchangeNim}  /> */}
              </td>
        </tr>
        <tr>
            <td>  <label> NAMA PRODUK:</label></td>
            <td><input type="text" id="namaproduk"  value={statenamaproduk} name="namaproduk"
               onChange={(e) => setNamaproduk(e.target.value)}
               /></td>
        </tr>
        <tr>
            <td>  <label> KATEGORI:</label></td>
            <td><input type="text" id="kategori"  value={statekategori} name="kategori"
               onChange={(e) => setKategori(e.target.value)}
               /></td>
        </tr>
        <tr>
            <td>  <label> FOTO:</label></td>
            <td>  <img src={statefoto} width="80"/> </td>
        </tr>
        <tr>
            <td>  <label> HARGA:</label></td>
            <td><input type="text" id="harga"  value={stateharga} name="harga"
               onChange={(e) => setHarga(e.target.value)}
               /></td>
        </tr>
        <tr>
            <td>  <label> UKURAN:</label></td>
            <td><input type="text" id="ukuran"  value={stateukuran} name="ukuran"
               onChange={(e) => setUkuran(e.target.value)}
               /></td>
        </tr>
        <tr>
            <td>  <label> WARNA:</label></td>
            <td><input type="text" id="warna"  value={statewarna} name="warna"
               onChange={(e) => setWarna(e.target.value)}
               /></td>
        </tr>
        
            </tbody>
          </table>
          <br/><input type="submit" /> | <input type="button" value="Cancel" onClick={handleCancelEdit} /><br/><br/>
          </form>  
          <br></br>
        <button id="btnadd" onClick={handleAdd} className={statebutonadd} style={{backgroundColor: "#13e047", borderWidth: "0.5px", padding: "5px", borderSpacing: "0", borderRadius: "3px"}}>
          Tambah Data</button>
        <br></br><br></br>
            Tabel Stock Nukhabyhm
        <table border={2}>
            <thead>
                <tr style={{textAlign:"center"}}>
                <td>KODE PRODUK</td> 
                <td>NAMA PRODUK</td>
                <td>KATEGORI</td>
                <td>HARGA</td>
                <td>UKURAN</td>
                <td>WARNA</td>
                <td>Foto</td>
                <td colSpan={2}><center>Action</center></td>
                </tr>
            </thead>
            <tbody>
            {stock_baju.map((smtr) => 
                <tr style={{textAlign:"center"}}>
                    <td>{smtr.kodeproduk}</td>
                    <td>{smtr.namaproduk}</td>
                    <td>{smtr.kategori}</td>
                    <td>{smtr.harga}</td>
                    <td>{smtr.ukuran}</td>
                    <td>{smtr.warna}</td>
                    <td><img src={smtr.foto} width="80"/></td>
                   <td><button className="cedit" onClick={handleEdit} value={smtr.kodeproduk}>Edit</button> | <button className="chapus" onClick={handleDelete} value={smtr.kodeproduk}> Delete</button></td>
                </tr>
           )}     
                   </tbody>
          </table>
          <br></br>
          <br></br><br></br>
         
          </div></center>
        )
}
  
  }