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
const CSR_PATH = process.env.CSR_PATH || path.join('/mycrypto','my.csr');
const CRT_PATH = process.env.CRT_PATH || path.join('/mycrypto','my.crt');

app.get('/', (req, res) => res.send('D0FI is N0t FID0'))

app.get('/api/config/obtener', (req, res) => res.json({
    datos: {
    },
    finalizado: true,
    mensaje: "Parámetros para archivo de configuracion"
}));

app.get('/api/status', (req, res) => res.json({
    datos: {
        compilacion: 2000,
        api_version: "1.0.2"
    },
    finalizado: true,
    mensaje: "Servicio ejecutandose correctamente"
}));

app.get('/api/token/status', (req, res) => {
    console.log(req.body);
    res.json({
        datos: {
            connected: true,
            tokens: [
                "FT ePass2003Auto"
            ]
        },
        finalizado: true,
        mensaje: "Lista de Tokens obtenida"
    })
});

app.get('/api/token/connected', (req, res) => {
    console.log(req.body);
    res.json({
        datos: {
            connected: true,
            tokens: [{
                slot: 0,
                serial: "40F198765432101F",
                name: "User PIN (D0F1)"
            }]
        },
        finalizado: true,
        mensaje: "Lista de Tokens obtenida"
    });
});

app.post('/api/token/data', (req, res) => {
    console.log(req.body);
    res.json({
        datos: {
            data_token: {
                certificates: 0,
                data: [
                    {
                        alias: "myalias",
                        id: "23571113",
                        tiene_certificado: false,
                        tipo: "PRIMARY_KEY",
                        tipo_desc: "Clave Privada"
                    }
                ],
                private_keys: 1
            }
        },
        finalizado: true,
        mensaje: "Datos de token obtenidos correctamente"
    });
});

app.post('/api/token/generate_csr', (req, res) => {
    console.log(req.body);
    csr_data = '-----BEGIN CERTIFICATE REQUEST-----\njMamCIfXTX8vp8QcjFEbYIHUl3Fg06pmv1Imrm2Vime+GqxA1I9R2ilYtWunlY2l\nHX\/UgFAFKW\/uR2zICF67KD0wH76Ts8UkHYR3+ZrHhpjPpy+zEmlDLv4pSP781sNR\nXoDb\n-----END CERTIFICATE REQUEST-----\n';
    fs.readFile(CSR_PATH, 'utf8', (err, data) => {
        if (!err) csr_data = data;

        res.json({
            datos: {
                csr: csr_data
            },
            finalizado: true,
            mensaje: "Se genero el CSR correctamente"
        })
    });
});

app.post('/api/token/verificar_driver', (req, res) => {
    console.log(req.body);
    res.json({
        datos: [{
            globalName: "F*u",
            slot: 0,
            token :{
                manufacture: "MOo",
                max_pin_length: 16,
                serial: "1337",
                model: "PKCS#15",
                label: "D0f1",
                support_opensc: false,
                min_pin_length: 4
            }
        }],
        finalizado: true,
        mensaje: "Validación realizada correctamente"
    });
});

https.createServer({
  key: fs.readFileSync(path.join('.','src/tls/server.key')),
  cert: fs.readFileSync(path.join('.','src/tls/server.crt'))
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
