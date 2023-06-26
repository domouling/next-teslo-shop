# Nexts.js Teslo App

para correr localmente, es necesario la base de datos

```

docker-compose up -d
```

* El -d es detached (segundo plano)

* MongoDB URL Local:

```

mongodb://localhost:27017/teslodb
```
## Configurar variables de entorno
Renombrar el archivo __.env.template__ a __.env__

* Reconstruir los modulo de node y levantar dev
```
yarn install
yarn dev
```



## Llenar la base de datos con informacion de pruebas

Llamar a:
```

http://localhost:3000/api/seed
```

