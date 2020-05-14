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

app.post('/api/token/data', (req, res) => {
    console.log(req.body);
    crt_data = '-----BEGIN CERTIFICATE-----\n5hmguu1JmxVDV3eGpGfwrjDIAgUubDOZcFpa67dzc3bN+zUei7Wab+1lcomyrrDy\nblaHblahblahD0f115N0tF1D0\n\n-----END CERTIFICATE-----\n';

    fs.readFile(CRT_PATH, 'utf8', (err, data) => {
        if (!err) crt_data = data;

        res.json({
            datos: {
                data_token: {
                    certificates: 1,
                    data: [
                        {
                            tipo: "PRIMARY_KEY",
                            tipo_desc: "Clave Privada",
                            alias: "doffer",
                            id: "333"
                        },
                        {
                            tipo: "X509_CERTIFICATE",
                            tipo_desc: "Certificado",
                            alias: "doffer",
                            pem: crt_data,
                            id: "333",
                            common_name: "Doffer Van Dof"
                        }
                    ],
                    private_keys:1
                }
            },
            finalizado: true,
            mensaje: "Se cargaron los datos del token correctamente"
        })
    });
});

app.post('/api/token/generate_csr', (req, res) => {
    console.log(req.body);
    csr_data = '-----BEGIN CERTIFICATE REQUEST-----\njMamCIfXTX8vp8QcjFEbYIHUl3Fg06pmv1Imrm2Vime+GqxA1I9R2ilYtWunlY2l\nHX\/UgFAFKW\/uR2zICF67KD0wH76Ts8UkHYR3+ZrHhpjPpy+zEmlDLv4pSP781sNR\nXoDb\n-----END CERTIFICATE REQUEST-----\n';
    fs.readFile(CSR_PATH, 'utf8', (err, data) => {
        if (!err) cert_data = data;

        res.json({
            datos: {
                csr: csr_data
            },
            finalizado: true,
            mensaje: "Se genero el CSR correctamente"
        })
    });
});

https.createServer({
  key: fs.readFileSync(path.join('.','src/tls/server.key')),
  cert: fs.readFileSync(path.join('.','src/tls/server.cert'))
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
                (# D0F1 is N0t FiD0 #&######%%(      
  `);
  console.log(`
      >>> https://${host}:${port}
  `)
})
