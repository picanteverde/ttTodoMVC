#!/bin/bash
rm -rf db
mkdir db
mongorestore --dbpath db dump/ttTodoMVC
