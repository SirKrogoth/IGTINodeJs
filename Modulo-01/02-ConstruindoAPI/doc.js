export const swaggerDocument = {
    "swagger": "2.0",
    "info": {
      "description": "minha-API ",
      "version": "1.0.0",
      "title": "Swagger Minha-API",
      "termsOfService": "http://swagger.io/terms/",
      "contact": {
        "email": "menezes.jrafael@gmail.com"
      },
      "license": {
        "name": "Apache 2.0",
        "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
      }
    },
    "host": "petstore.swagger.io",
    "basePath": "/v2",
    "tags": [
      {
        "name": "account",
        "description": "Account management",
        "externalDocs": {
          "description": "Find out more",
          "url": "http://swagger.io"
        }
      }
    ],
    "schemes": [
      "https",
      "http"
    ],
    "paths": {
      "/account": {
        "post": {
          "tags": [
            "account"
          ],
          "summary": "Listar contas",
          "description": "Lista todas as contas cadastradas",
          "operationId": "addContas",
          "consumes": [
            "application/json"
          ],
          "parameters": [
            {
              "in": "body",
              "name": "body",
              "description": "Pet object that needs to be added to the store",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Pet"
              }
            }
          ],
          "responses": {
            "405": {
              "description": "Invalid input"
            }
          },
          "security": [
            {
              "petstore_auth": [
                "write:pets",
                "read:pets"
              ]
            }
          ]
        },
        "put": {
          "tags": [
            "pet"
          ],
          "summary": "Update an existing pet",
          "description": "",
          "operationId": "updatePet",
          "consumes": [
            "application/json",
            "application/xml"
          ],
          "produces": [
            "application/xml",
            "application/json"
          ],
          "parameters": [
            {
              "in": "body",
              "name": "body",
              "description": "Pet object that needs to be added to the store",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Pet"
              }
            }
          ],
          "responses": {
            "400": {
              "description": "Invalid ID supplied"
            },
            "404": {
              "description": "Pet not found"
            },
            "405": {
              "description": "Validation exception"
            }
          },
          "security": [
            {
              "petstore_auth": [
                "write:pets",
                "read:pets"
              ]
            }
          ]
        }
      },      
    },
    "securityDefinitions": {
      "petstore_auth": {
        "type": "oauth2",
        "authorizationUrl": "http://petstore.swagger.io/oauth/dialog",
        "flow": "implicit",
        "scopes": {
          "write:pets": "modify pets in your account",
          "read:pets": "read your pets"
        }
      },
      "api_key": {
        "type": "apiKey",
        "name": "api_key",
        "in": "header"
      }
    },
    "definitions": {
      "Order": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          },
          "balance": {
            "type": "number",
            "format": "double"
          }          
      }      
    },
    "externalDocs": {
      "description": "Find out more about Swagger",
      "url": "http://swagger.io"
    }
  }
}