package main

import (
	"crypto/tls"
	"fmt"
	"github.com/gofiber/cors"
	"github.com/gofiber/fiber"
	"github.com/gofiber/logger"
	"gopkg.in/yaml.v2"
	"log"
	"os"
)

/* from https://dev.to/koddr/let-s-write-config-for-your-golang-web-app-on-right-way-yaml-5ggp  */
type Config struct {
	Server struct {
		Host    string `yaml:"host"`
		Port    int    `yaml:"port"`
		TlsCert string `yaml:"tls_cert"`
		TlsKey  string `yaml:"tls_key"`
	} `yaml:"server"`
}

func NewConfig(configPath string) (*Config, error) {
	config := &Config{}

	file, err := os.Open(configPath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	d := yaml.NewDecoder(file)

	if err := d.Decode(&config); err != nil {
		return nil, err
	}

	return config, nil
}

func ValidateConfigPath(path string) error {
	s, err := os.Stat(path)
	if err != nil {
		return err
	}
	if s.IsDir() {
		return fmt.Errorf("'%s' is a directory, not a normal file", path)
	}
	return nil
}

func GetConfigPath() (string, error) {

	configPath := os.Getenv("CONFIG_PATH")

	if len(configPath) == 0 {
		configPath = "config.yaml"
	}

	if err := ValidateConfigPath(configPath); err != nil {
		return "", err
	}
	return configPath, nil
}

func (config Config) Run() {

	app := fiber.New(&fiber.Settings{
		DisableStartupMessage: true,
		ServerHeader:          "D0F1",
	})

	app.Use(cors.New())
	app.Use(logger.New())

	app.Get("/", func(c *fiber.Ctx) {
		c.JSON(fiber.Map{"data": "D0F1 15 n07 f1d0"})
	})

	app.Get("/api/status", func(c *fiber.Ctx) {
		c.JSON(fiber.Map{
			"datos": fiber.Map{
				"compilacion": 2000,
				"api_version": "1.0.2",
			},
			"finalizado": true,
			"mensaje":    "Servicio ejecutandose correctamente",
		})
	})

	app.Get("/api/config/obtener", func(c *fiber.Ctx) {
		c.JSON(fiber.Map{
			"datos": fiber.Map{
				"profile.file_name":  "/root/FidoProfiles/2357111317.default.profile",
				"certificado.emisor": "firmadigital_bo.pem",
				"profile": fiber.Map{
					"driverPath": "/usr/lib/pkcs11/opensc-pkcs11.so",
					"name":       "40f1",
					"type":       "PKCS11",
				},
				"firmatic.enabled": "false",
				"profile.name":     "2357111317.default.profile",
			},
			"finalizado": true,
			"mensaje":    "Parámetros para archivo de configuracion",
		})
	})

	app.Get("/api/token/status", func(c *fiber.Ctx) {
		log.Print(c.Body)
		c.JSON(fiber.Map{
			"datos": fiber.Map{
				"connected": true,
				"tokens":    []string{"FT ePass2003Auto"},
			},
			"finalizado": true,
			"mensaje":    "Lista de Tokens obtenida",
		})
	})

	app.Get("/api/token/connected", func(c *fiber.Ctx) {
		log.Print(c.Body)
		c.JSON(fiber.Map{
			"datos": fiber.Map{
				"connected": true,
				"tokens": []fiber.Map{fiber.Map{
					"slot":   0,
					"serial": "40F198765432101F",
					"name":   "User PIN (D0F1)",
				}},
			},
			"finalizado": true,
			"mensaje":    "Lista de Tokens obtenida",
		})
	})

	cer, err := tls.X509KeyPair([]byte(config.Server.TlsCert), []byte(config.Server.TlsKey))
	if err != nil {
		log.Fatal(err)
	}

	tlsConfig := &tls.Config{Certificates: []tls.Certificate{cer}}

	log.Print(`

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
                (# D0F1 15 n07 f1d0 #&######%%(      
    `)

	app.Listen(9000, tlsConfig)
}

func main() {
	cfgPath, err := GetConfigPath()

	if err != nil {
		log.Fatal(err)
	}
	cfg, err := NewConfig(cfgPath)
	if err != nil {
		log.Fatal(err)
	}

	cfg.Run()
}
