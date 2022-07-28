# 📝 Summary

- [About](#about)
- [Starting](#getting_started)
- [Usage](#usage)
- [Built using](#built_using)

# 🧐 About <a name = "about"></a>

The main objetive of this project is to simulate a data management API for a miniblog. It uses a NoSQL database (MongoDB) for data storage and Node.js/Express as main server development tools. Each controller is tested with Jest and the entire enviroment (server aplication and db) can be containerized with simple commands.

# 🏁 Starting <a name = "getting_started"></a>

In the next subsections are the steps to install and execute the application. All script commands will be executed with *yarn*, but feel free to use the package manager of your choice.

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

The **.env_example** file contains the environment variables. Duplicate and rename with **.env**. All the variables in the example file are default values that will work with the containerized approach. If you want to access the mongoDB instance from outside the container, you need to change the **DB_URI** variable to something like this:
   **mongodb://localhost:27017/crud-node-mongo**

If you want to use the mongoDB cloud instance, you need to set **DB_USER** and **DB_USER_PWD** variables to correponding data and leave **DB_URI** empty.

## Running

### locally ###

If you want to run locally:

    yarn dev

**Don't forget to change the DB_URI variable**

### Containerized

If you want to run inside a container:

    make start

It takes a few seconds to build the containers the first time. The node server runs in development mode and the current terminal will be attached to logs.

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

    POST /authors/create



**Request body**
  
|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
| firstName |     Non-empty string     |     T    |
| lastName  |     Non-empty string     |     T    |
|    age    | Integer number or string |     T    |
|   email   |        valid email       |     T    |


**Body example**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "age": 20,
  "email": "john.doe@email.com"
}
```

**Response example**
```json
"author": {
  "firstName": "John",
  "lastName": "Doe",
  "age": 20,
  "email": "john.doe@email.com",
  "articles": [],
  "_id": "62e2a214e645fec7d57d7b2a"
}
```

### **Update an Author**

    PATCH /authors/update/:id

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
```json
{
  "lastName": "Smith",
  "email": "john.smith@email.com"
}
```

**Response example**
```json
"author": {
  "firstName": "John",
  "lastName": "Smith",
  "age": 30,
  "email": "john.smith@email.com",
  "articles": [],
  "_id": "62e2a214e645fec7d57d7b2a"
}
```

### **Get an Author**

    GET /authors/get/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Response example**
```json
"author": {
  "firstName": "John",
  "lastName": "Smith",
  "age": 30,
  "email": "john.smith@email.com",
  "articles": [],
  "_id": "62e2a214e645fec7d57d7b2a"
}
```

### **Get all Authors**

    GET /authors/get/

**Response example**
```json
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
```

### **Delete an Author**

    DELETE /authors/delete/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Response example**
```json
"message": "Author deleted"
```

### **Get an Author with its articles**

    GET /authors/get/:id/articles

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Response example**
```json
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
```

### **Create a Category**

    POST /categories/create

**Request body**
  
|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|   name    |     Non-empty string     |     T    |
|   type    |     Non-empty string     |     T    |

**Body example**
```json
{
  "name": "A category",
  "type": "Category type"
}
```

**Response example**
```json
"category": {
  "name": "A category",
  "type": "Category type",
  "articles": [],
  "_id": "62e2a60ae645fec7d57d7b30"
}
```

### **Update a Category**

    PATCH /categories/update/:id

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
```json
{
  "type": "Category type 2",
}
```

**Response example**
```json
"category": {
  "name": "A category",
  "type": "Category type 2",
  "articles": [],
  "_id": "62e2a60ae645fec7d57d7b30"
}
```

### **Get a Category**

    GET /categories/get/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Response example**
```json
"category": {
  "_id": "62e2a60ae645fec7d57d7b30",
  "name": "A category",
  "type": "Category type 2",
  "articles": []
}
```

### **Get all Categories**

    GET /categories/get/

**Response example**
```json
"categories": [
  {
  	"_id": "62e1dd788cf6bf1ce279e0aa",
  	"name": "Another",
  	"type": "Category",
  	"articles": []
  },
  {
  	"_id": "62e2a60ae645fec7d57d7b30",
  	"name": "A category",
  	"type": "Category type 2",
  	"articles": []
  }
]
```

### **Delete a Category**

    DELETE /categories/delete/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Response example**
```json
"message": "Category deleted"
```

### **Get a Category with its articles**

    GET /categories/get/:id/articles

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Response example**
```json
"category": {
  "_id": "62e2a60ae645fec7d57d7b30",
  "name": "A category",
  "type": "Category type 2",
  "articles": [
  	{
  		"_id": "62e15559ef0a411a9310481a",
  		"title": "Donec interdum",
  		"description": "Nulla blandit mollis varius. Donec interdum fermentum orci sed dictum.",
  		"text": "Nunc ultricies sodales dui, sed elementum est luctus in. Nullam rutrum fermentum purus sed porttito...",
  		"author": "62e14bbb771574c41eaf2215",
  		"category": "62e2a60ae645fec7d57d7b30",
  		"comments": []
  	},
  	{
  		"_id": "62e15561ef0a411a93104822",
  		"title": "Elementum est luctus",
  		"description": "Nulla blandit mollis varius. Donec interdum fermentum orci sed dictum.",
  		"text": "Nunc ultricies sodales dui, sed elementum est luctus in. Nullam rutrum fermentum purus sed porttitor...",
  		"author": "62e14bbb771574c41eaf2215",
  		"category": "62e2a60ae645fec7d57d7b30",
  		"comments": []
  	}
  ]
}
```

### **Create a Comment**

    POST /comments/create

**Request body**
  
|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|   text    |     Non-empty string     |     T    |
| articleId |      Valid MongoId       |     T    |
|  creator  |      Non-empty string    |     F    |

**Body example**
```json
{
	"text": "A useful comment",
	"articleId": "62e2a67fe645fec7d57d7b33",
	"creator": "John Doe"
}
```

**Response example**
```json
"comment": {
		"text": "A useful comment",
		"article": {
			"_id": "62e2a67fe645fec7d57d7b33",
			"title": "Sed elementum est",
			"description": "Nulla blandit mollis varius. Donec interdum fermentum orci sed dictum. ",
			"text": "Nunc ultricies sodales dui, sed elementum est luctus in. Nullam rutrum fermentum purus sed porttitor...",
			"author": "62e2a214e645fec7d57d7b2a",
			"category": null,
			"comments": []
		},
		"creator": "John Doe",
		"_id": "62e2b559e645fec7d57d7b3c"
}
```

### **Update a Comment**

    PATCH /comments/update/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |

**Request body**
  
|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|   text    |     Non-empty string     |     F    |


**Body example**
```json
{
  "text": "A unuseful comment"
}
```

**Response example**
```json
"comment": {
  "text": "A unuseful comment",
  "article": "62e2a67fe645fec7d57d7b33",
  "creator": "John Doe",
  "_id": "62e2b559e645fec7d57d7b3c"
}
```

### **Get a Comment**

    GET /comments/get/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Response example**
```json
"comment": {
  "_id": "62e2b559e645fec7d57d7b3c",
  "text": "A unuseful comment",
  "article": "62e2a67fe645fec7d57d7b33",
  "creator": "John Doe"
}
```

### **Get all Comments**

    GET /comments/get/

**Response example**
```json
"comments": [
  {
  	"_id": "62e2b559e645fec7d57d7b3c",
  	"text": "A unuseful comment",
  	"article": "62e2a67fe645fec7d57d7b33",
  	"creator": "John Doe"
  },
  {
  	"_id": "62e2bd2fb1bd551d46681783",
  	"text": "A expected comment",
  	"article": "62e2a67fe645fec7d57d7b33",
  	"creator": "John Smith"
  }
]
```

### **Delete a Comment**

    DELETE /comments/delete/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Response example**
```json
"message": "Comment deleted"
```


### **Create an Article**

    POST /articles/create

**Request body**
  
|    Param    |       Desc.      | Required |
|:-----------:|:----------------:|----------|
|     tile    | Non-empty string |     T    |
| description | Non-empty string |     T    |
|     text    | Non-empty string |     T    |
|   authorId  |   Valid MongoId  |     T    |
|  categoryId |   Valid MongoId  |     F    |

**Body example**
```json
{
	"title": "Lorem epsun",
	"description": "Nulla blandit mollis varius. Donec interdum fermentum orci sed dictum. ",
	"text": "Nunc ultricies sodales dui, sed elementum est luctus in. Nullam rutrum fermentum purus sed porttitor...",
	"authorId": "62e2a214e645fec7d57d7b2a"
}
```

**Response example**
```json
"article": {
  "title": "Lorem epsun",
  "description": "Nulla blandit mollis varius. Donec interdum fermentum orci sed dictum. ",
  "text": "Nunc ultricies sodales dui, sed elementum est luctus in. Nullam rutrum fermentum purus sed porttitor...",
  "author": {
  	"_id": "62e2a214e645fec7d57d7b2a",
  	"firstName": "Pedro",
  	"lastName": "Smith",
  	"age": 30,
  	"email": "jogn.smith@email.com",
  	"articles": [
  		"62e2a67fe645fec7d57d7b33"
  	]
  },
  "category": null,
  "comments": [],
  "_id": "62e2bef9b1bd551d46681789"
}
```

### **Update an Article**

    PATCH /articles/update/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |

**Request body**
  
|    Param    |       Desc.      | Required |
|:-----------:|:----------------:|----------|
|     tile    | Non-empty string |     F    |
| description | Non-empty string |     F    |
|     text    | Non-empty string |     F    |
|   authorId  |   Valid MongoId  |     F    |
|  categoryId |   Valid MongoId  |     F    |

**Body example**
```json
{
	"title":  "Lorem ipsum",
	"categoryId": "62e1dd788cf6bf1ce279e0aa"
}
```

**Response example**
```json
"article": {
  "title": "Lorem ipsum",
  "description": "Nulla blandit mollis varius. Donec interdum fermentum orci sed dictum. ",
  "text": "Nunc ultricies sodales dui, sed elementum est luctus in. Nullam rutrum fermentum purus sed porttitor...",
  "author": "62e2a214e645fec7d57d7b2a",
  "category": {
  	"_id": "62e1dd788cf6bf1ce279e0aa",
  	"name": "Another",
  	"type": "Category",
  	"articles": []
  },
  "comments": [],
  "_id": "62e2bef9b1bd551d46681789"
}
```

### **Get an Article**

    GET /articles/get/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Response example**
```json
"article": {
  "_id": "62e2bef9b1bd551d46681789",
  "title": "Lorem ipsum",
  "description": "Nulla blandit mollis varius. Donec interdum fermentum orci sed dictum. ",
  "text": "Nunc ultricies sodales dui, sed elementum est luctus in. Nullam rutrum fermentum purus sed porttitor...",
  "author": {
  	"_id": "62e2a214e645fec7d57d7b2a",
  	"firstName": "Pedro",
  	"lastName": "Smith",
  	"age": 30,
  	"email": "jogn.smith@email.com",
  	"articles": [
  		"62e2a67fe645fec7d57d7b33",
  		"62e2bef9b1bd551d46681789"
  	]
  },
  "category": {
  	"_id": "62e1dd788cf6bf1ce279e0aa",
  	"name": "Another",
  	"type": "Category",
  	"articles": [
  		"62e2bef9b1bd551d46681789"
  	]
  },
  "comments": []
}
```

### **Get all Articles**

    GET /articles/get/

**Response example**
```json
"articles": [
  {
  	"_id": "62e2a67fe645fec7d57d7b33",
  	"title": "Sed elementum est",
  	"description": "Nulla blandit mollis varius. Donec interdum fermentum orci sed dictum. ",
  	"text": "Nunc ultricies sodales dui, sed elementum est luctus in. Nullam rutrum fermentum purus sed porttitor...",
  	"author": "62e2a214e645fec7d57d7b2a",
  	"category": null,
  	"comments": [
  		"62e2b559e645fec7d57d7b3c",
  		"62e2bd2fb1bd551d46681783"
  	]
  },
  {
  	"_id": "62e2bef9b1bd551d46681789",
  	"title": "Lorem ipsum",
  	"description": "Nulla blandit mollis varius. Donec interdum fermentum orci sed dictum. ",
  	"text": "Nunc ultricies sodales dui, sed elementum est luctus in. Nullam rutrum fermentum purus sed porttitor...",
  	"author": "62e2a214e645fec7d57d7b2a",
  	"category": "62e1dd788cf6bf1ce279e0aa",
  	"comments": []
  }
]
```

### **Delete an Article**

    DELETE /articles/delete/:id

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Response example**
```json
"message": "Article deleted"
```

### **Get an Article with its comments**

    GET /articles/get/:id/comments

**Request params**

|   Param   |           Desc.          | Required |
|:---------:|:------------------------:|----------|
|    :id    |       Valid MongoId      |     T    |


**Response example**
```json
"article": {
  "_id": "62e2a67fe645fec7d57d7b33",
  "title": "Sed elementum est",
  "description": "Nulla blandit mollis varius. Donec interdum fermentum orci sed dictum. ",
  "text": "Nunc ultricies sodales dui, sed elementum est luctus in. Nullam rutrum fermentum purus sed porttitor...",
  "author": "62e2a214e645fec7d57d7b2a",
  "category": null,
  "comments": [
  	{
  		"_id": "62e2b559e645fec7d57d7b3c",
  		"text": "A unuseful comment",
  		"article": "62e2a67fe645fec7d57d7b33",
  		"creator": "John Doe"
  	},
  	{
  		"_id": "62e2bd2fb1bd551d46681783",
  		"text": "A expected comment",
  		"article": "62e2a67fe645fec7d57d7b33",
  		"creator": "John Smith"
  	}
  ]
}
```

## Constraints

Some requests may have some different constraints

1. When deleting an Author it cannot have any articles associated as Article have a mandatory dependency on the Author. It will return an error response if the constraint is violated.
   
2. An Article could be created with a null Category, but cannot have its Category updated to null. It will assume that Category ramains unchanged unless you submit a valid MongoId.


# Testing

To test the enviroment run

    yarn test

To get the coverage report run

    yarn test:coverage

## ⛏️ Built using <a name = "built_using"></a>

- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Express](https://expressjs.com/) - Server Framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Typescript](https://www.typescriptlang.org/) - Main language
- [Docker](http://www.docker.com) - Containerization tool
