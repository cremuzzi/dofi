package main

import (
    "fmt"
    "log"
    //"io/ioutil"
    "crypto/tls"
    "github.com/gofiber/cors"
    "github.com/gofiber/fiber"
    "github.com/gofiber/logger"
)

func main() {

    app := fiber.New(&fiber.Settings{
        DisableStartupMessage: true,
        ServerHeader: "D0F1",
    })

    app.Use(cors.New())
    app.Use(logger.New())

    app.Get("/", func(c *fiber.Ctx) {
        c.JSON(fiber.Map{"data": "D0F1 i5 N0t FID0"})
    })

    app.Get("/api/status", func(c *fiber.Ctx) {
        c.JSON(fiber.Map{
            "datos": fiber.Map{
                "compilacion": 2000,
                "api_version": "1.0.2",
            },
            "finalizado": true,
            "mensaje": "Servicio ejecutandose correctamente",
        })
    })

    /*
app.get('/api/config/obtener', (req, res) => res.json({
    datos: {
    },
    finalizado: true,
    mensaje: "Parámetros para archivo de configuracion"
}));
*/

    app.Get("/api/token/status", func(c *fiber.Ctx) {
        log.Print(c.Body)
        c.JSON(fiber.Map{
            "datos": fiber.Map{
                "connected": true,
                "tokens": []string{"FT ePass2003Auto"},
            },
            "finalizado": true,
            "mensaje": "Lista de Tokens obtenida",
        })
    })

    app.Get("/api/token/connected", func(c *fiber.Ctx) {
        log.Print(c.Body)
        c.JSON(fiber.Map{
            "datos": fiber.Map{
                "connected": true,
                "tokens": []fiber.Map{fiber.Map{
                    "slot": 0,
                    "serial": "40F198765432101F",
                    "name": "User PIN (D0F1)",
                }},
            },
            "finalizado": true,
            "mensaje": "Lista de Tokens obtenida",
        })
    })

    cer, err := tls.LoadX509KeyPair("tls/server.crt", "tls/server.key")
    if err != nil {
        log.Fatal(err)
    }
    config := &tls.Config{Certificates: []tls.Certificate{cer}}

    fmt.Printf(`\x1b[35m%s\x1b[0m`,`

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
                (# D0F1 1s N0t FiD0 #&######%%(      
    `)

    app.Listen(9000, config)
}
