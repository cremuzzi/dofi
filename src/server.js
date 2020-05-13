var express = require('express')
var app = express()
var fs = require('fs')
var https = require('https')
const winston = require('winston');
const { createLogger, format, transports } = winston;

const logger = winston.createLogger({
    format: format.combine(
            format.colorize(),
            format.prettyPrint(),
            format.timestamp(),
            format.printf(i => `${i.timestamp} | ${i.message}`)
          ),
    transports: [
        new winston.transports.Console({colorize: true})
    ]
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const host= process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 9000;

app.get('/', (req, res) => res.send('this is Wildcat'))

app.get('/api/status', (req, res) => res.json({
    datos:{
       ultima_version_api_info:{
          "url_descarga_ultima_version":"https://firmadigital.bo/herramientas/#descargas",
          compilacion:1020,
          api_version:"1.3.0"
       },
       compilacion:1020,
       api_version:"1.3.0"
    },
    finalizado:true,
    mensaje:"Servicio iniciado correctamente"
}));

app.get('/api/token/status', (req, res) => res.json({
    datos: {
        "connected": true,
        "tokens": [
            "FT ePass2003Auto"
        ]
    },
    "finalizado": true,
    "mensaje": "Lista de Tokens obtenida"
}));




https.createServer({
  key: fs.readFileSync('./src/tls/server.key'),
  cert: fs.readFileSync('./src/tls/server.cert')
}, app)
.listen(port, host, function () {
  logger.info(`
                                                                                
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
  `);
  logger.info(`DOFI up and running on https://${host}:${port}`)
})
