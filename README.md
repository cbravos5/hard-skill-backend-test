# 📝 Conteúdo

- [About](#about)
- [Starting](#getting_started)
- [Uso](#usage)
- [Construído com](#built_using)

# 🧐 About <a name = "about"></a>

The main objetive of this project is to simulate a data management API for a miniblog. It uses a NoSQL database (MongoDB) for data storage and Node.js/Express as main server development tools. Each controller is tested with Jest and the entire enviroment (server aplication and db) can be containerized with simple commands.

# 🏁 Starting <a name = "getting_started"></a>

In the next subsections are the steps for installing and executing the application. All the script commands will be executed with *yarn*, but feel free to use the package manager of your choice.

## Dependencies

- Node v16.13.0 or higher
- Docker
- Docker compose

## Instalation

Clone repository

    git clone https://github.com/cbravos5/hard-skill-backend-test.git

or

    git clone git@github.com:cbravos5/hard-skill-backend-test.git


Install node dependencies

    yarn


### Enviroment variables ###

The **.env_example** file contains the environment variables. Duplicate and rename it with **.env**. All the variables in the example file are default values that will work with the containerized approach. If you want to access the mongoDB instance from outside the container, you'll need to change the **DB_URI** variable to something like this:
   **mongodb://localhost:27017/crud-node-mongo**

If you want to use the mongoDB cloud instance, you'll need to set variables **DB_USER** e **DB_USER_PWD** to correponding data and let **DB_URI** empty.

## Running

### locally ###

If you want to run locally:

    yarn dev

**Don't forget to change the DB_URI variable**

### Containerized

If you want to run inside a container:

    make start

Will take a couple of seconds to build the containers. The node server runs in development mode and the current terminal will be attached to logs.

If you want to stop the container:

    make stop
    make remove


# 🎈 Usage <a name="usage"></a>

## Entities

- **Author**:
  - firstName (required): string;
  - lastName (required): String;
  - age (required): number;
  - email (required): string;
- **Category**: 
  - name (required): string;
  - type (required): string;
- **Article**:
  - title (required): string;
  - description (required): string;
  - text (required): string;
  - author (required): Author;
  - category (optional): Category;
- **Comment**:
  - text (required): string;
  - article (required): Article;
  - creator (optional): string;


## Routes

The base url is *http://localhost:3000/*
If you need to change the port number, check out .env file for **APP_PORT** variable
and change docker-compose.yml port mapping.
 
### **Create an Author**

    post /authors/create



**Request body**
  
|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
| firstName |     Non-empty string     |     T    |
| lastName  |     Non-empty string     |     T    |
|    age    | Integer number or string |     T    |
|   email   |        valid email       |     T    |


**Body example**

    {
      firstName: "John",
      lastName: "Doe",
      age: 20,
      email: "john.doe@email.com"
    }

**Return example**

      "author": {
    		"firstName": "John",
    		"lastName": "Doe",
    		"age": 20,
    		"email": "john.doe@email.com",
    		"articles": [],
    		"_id": "62e2a214e645fec7d57d7b2a"
	    }

### **Update an Author**

    patch /authors/update/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |

**Request body**
  
|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
| firstName |     Non-empty string     |     F    |
| lastName  |     Non-empty string     |     F    |
|    age    | Integer number or string |     F    |
|   email   |        valid email       |     F    |


**Body example**

    {
      lastName: "Smith",
      email: "john.smith@email.com"
    }

**Return example**

    "author": {
  		"firstName": "John",
  		"lastName": "Smith",
  		"age": 30,
  		"email": "john.smith@email.com",
  		"articles": [],
  		"_id": "62e2a214e645fec7d57d7b2a"
    }

### **Get an Author**

    get /authors/get/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Return example**

    "author": {
  		"firstName": "John",
  		"lastName": "Smith",
  		"age": 30,
  		"email": "john.smith@email.com",
  		"articles": [],
  		"_id": "62e2a214e645fec7d57d7b2a"
   }

### **Get all Authors**

    get /authors/get/

**Return example**

    "authors": [
  		{
  			"_id": "62e1d88ee88837b2d71d1ccb",
  			"firstName": "Pedro",
  			"lastName": "Camargo",
  			"age": 42,
  			"email": "pedro.camargo@email.com",
  			"articles": [
          "62e15559ef0a411a9310481a"
        ]
  		},
  		{
  			"_id": "62e2a214e645fec7d57d7b2a",
  			"firstName": "Pedro",
  			"lastName": "Smith",
  			"age": 30,
  			"email": "jogn.smith@email.com",
  			"articles": []
  		}
  	]

### **Delete an Author**

    delete /authors/delete/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Return example**

    "message": "Author deleted"

### **Get an Author with its articles**

    get /authors/get/:id/articles

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Return example**

    "author": {
  		"_id": "62e14bbb771574c41eaf2215",
  		"firstName": "Elisa",
  		"lastName": "Macedo",
  		"age": 22,
  		"email": "elisa.macedo@email.com",
  		"articles": [
  			{
  				"_id": "62e15559ef0a411a9310481a",
  				"title": "Donec interdum",
  				"description": "Nulla blandit mollis varius. Donec interdum fermentum orci sed dictum.",
  				"text": "Nunc ultricies sodales dui, sed elementum est luctus in. Nullam rutrum fermentum purus sed porttito...",
  				"author": "62e14bbb771574c41eaf2215",
  				"category": "62e1554eef0a411a93104816",
  				"comments": []
  			},
  			{
  				"_id": "62e15561ef0a411a93104822",
  				"title": "Elementum est luctus",
  				"description": "Nulla blandit mollis varius. Donec interdum fermentum orci sed dictum.",
  				"text": "Nunc ultricies sodales dui, sed elementum est luctus in. Nullam rutrum fermentum purus sed porttitor...",
  				"author": "62e14bbb771574c41eaf2215",
  				"category": "62e1554eef0a411a93104816",
  				"comments": []
  			}
  		]
  	}

### **Create a Category**

    post /categories/create

**Request body**
  
|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|   name    |     Non-empty string     |     T    |
|   type    |     Non-empty string     |     T    |

**Body example**

    {
      "name": "A category",
  	  "type": "Category type"
    }

**Return example**

  	"category": {
      "name": "A category",
      "type": "Category type",
      "articles": [],
      "_id": "62e2a60ae645fec7d57d7b30"
    }

### **Update a Category**

    patch /categories/update/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |

**Request body**
  
|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|   name    |     Non-empty string     |     F    |
|   type    |     Non-empty string     |     F    |


**Body example**

    {
      type: "Category type 2",
    }

**Return example**

    "category": {
  		"name": "A category",
  		"type": "Category type 2",
  		"articles": [],
  		"_id": "62e2a60ae645fec7d57d7b30"
  	}

### **Get a Category**

    get /categories/get/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Return example**
```json
    "category": {
  		"_id": "62e2a60ae645fec7d57d7b30",
  		"name": "A category",
  		"type": "Category type 2",
  		"articles": []
   }
```


## ⛏️ Construído com <a name = "built_using"></a>

- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Typescript](https://www.typescriptlang.org/) - Main language
