const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const https = require('https')
const morgan = require('morgan');
const path = require('path')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('tiny'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const host= process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 9000;
const CRT_PATH = process.env.CSR_PATH || path.join(__dirname, 'my.crt') ;
const CSR_PATH = process.env.CERT_PATH || path.join(__dirname, 'my.csr') ;

app.get('/', (req, res) => res.send('D0FI is N0t FID0'))

app.get('/api/status', (req, res) => res.json({
    datos:{
       ultima_version_api_info:{
          "url_descarga_ultima_version":"https://firmadigital.bo/herramientas/#descargas",
          compilacion:1020,
          api_version: "1.3.0"
       },
       compilacion: 1020,
       api_version: "1.3.0"
    },
    finalizado: true,
    mensaje: "Servicio iniciado correctamente"
}));

app.get('/api/token/status', (req, res) => {
    console.log(req.body);
    res.json({
        datos: {
            connected: true,
            tokens: [
                "D0fi is Not FiD0"
            ]
        },
        finalizado: true,
        mensaje: "Lista de Tokens obtenida"
    })
});

app.post('api/token/generate_csr', (req, res) => res.json({
    datos: {
        csr: "-----BEGIN CERTIFICATE REQUEST-----\n
                MIn5HgH3Lpzsm8njCYxOwH....
                vrtmYNVlM9MVvwIvsQ8074Y0MI\n
                -----END CERTIFICATE REQUEST-----\n"
    },
    finalizado: true,
    mensaje: "Se genero el CSR correctamente"
})

https.createServer({
  key: fs.readFileSync('./src/tls/server.key'),
  cert: fs.readFileSync('./src/tls/server.cert')
}, app)
.listen(port, host, function () {
  console.log(`\x1b[35m%s\x1b[0m`,`


                   ,%%&*        .......                             
                   /###%%&#((/////////////(%@&,                     
                *#//*//(%##(///////////////////%%                   
            .%(,/(##(##%%(//////////////#########(                  
          /#,////////////////////////(#########&##/                 
         #,*////////////////////////###############                 
       ,/,/////////////////////////(######%@#/*,,.                  
      .%,//////////////////////////#####%*                          
      **,/////////////////#%&&&%#//#####/                           
      /,(%&&&&&#////////#&%%%%%%(//####%,                           
      /,,/%%%%#//////////(%%#//////#####*                           
      ,*,*/////////////////////////(####&                           
       %,,//////////////////////////%###%,                          
       ,,,*/////////////////////////#####%                          
        #,,////////#%%///////////////####&/                         
         *,,///////#&&///////////////(####&                         
         **,///////#&&(///////////////####%#                        
          /,///////#&&#////////////////%###@.                       
           (///////(#(/////////////////(###%#                       
           .(////////////////////////#(/###%@                       
            /(/////(/////#/////((///(%&/.                           
               ./#########%&&%%%,                                   
                          /((((%*                                   
                          /((((##                                   
                          *####%&     /%&&&%*                       
                   /(*(#%&%%((##&/(&&######%%&                      
                 ,#*##%,,////////&#########%%&.                     
                 (//#%,,////////%###&######%%(                      
                (# D0FI is N0t FID0 #&######%%(                     
  `);
  console.log(`doing funny stuff on https://${host}:${port}`)
})
