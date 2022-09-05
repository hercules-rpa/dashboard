# Hércules-RPA-Dashboard

Hércules-RPA-Dashboard es un cuadro de manos opensource desarrollado por **Treelogic** para dar soporte front-end  al Proyecto Hércules-RPA. La parte frontend está escrita en Vue.js bajo la tecnología nodeJS.

## Instalación

Para poder ejecutar este entorno es necesario que se descargue e instale nodeJS tanto para Windows, Mac o Linux. También es necesario instalar el gestor de paquetes NPM que normalmente viene incluido con la instalación de nodeJS.

- Para instalar nodeJS en Windows podemos descargarnos la última versión estable en la página oficial [nodeJS](https://nodejs.org/es/).

- Para Linux utilizaremos el siguiente comando: `sudo apt-get install nodejs` y comprobaremos si nos ha instalado la versión correcta con los comandos `nodejs -v` y `npm -v`

- Para Mac podemos utilizar el gestor de paquetes _brew_ : `brew install node` o directamente bajarnos la imagen correspondiente en su página oficial de [nodeJS](https://nodejs.org/es/download/).

Recomendamos instalar el entorno virtual [NVM](https://github.com/nvm-sh/nvm) que es un gestor de versiones de nodeJS y puede ser interesante tener varias versiones por si surgieran problemas de compatibilidad.

## Despliegue

Para el despliegue de la aplicación debemos situarnos en la carpeta raíz del proyecto donde se encuentra el fichero `package.json` el cual contiene todas las dependencias que se necesita para desplegar la applicación.

Una vez ahí debemos ejecutar el comando `npm install` que nos instalará las dependencias.

>Si surge algún problema durante la instalación utilizar el comando `npm i --legacy-peer-deps` para realizar la instalación por si hay algún paquete del que ya no se ofrezca soporte.

Cuando se haya ejecutado correctamente la instalación el siguiente comando debe ser `npm run dev`, con esto desplegaremos localmente una versión de desarrollo del frontend de la app. La salida final que os debe dar es algo así:

```d
 DONE  Compiled successfully in 39016ms                                                                                                                                        

 App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.1.131:8080/

  Note that the development build is not optimized.
  To create a production build, run npm run build.

```

Para crear una build de producción utilizaremos el comando `npm run build` y nos generará una carpeta con todo el contenido necesario para subir a nuestro servidor HTTP

