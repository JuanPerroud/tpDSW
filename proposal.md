# Propuesta TP DSW

## Grupo
### Integrantes
* 54810 Bruzzesi Juan Jose
* 54816 Perroud Juan Ignacio


### Repositorios
Aplicación Frontend
* Html ,css javaScript y react

Aplicación Backend
* JavaScript, node.js



## Tema
### Descripción
Esta plataforma web está diseñada para la gestión y socialización de planes de entrenamiento. Permite a los usuarios crear rutinas personalizadas con la flexibilidad de mantenerlas privadas o compartirlas con la comunidad. El sistema incluye una función de seguimiento que registra el progreso diario en cada ejercicio específico ademas de generar un grafico que permite visualizar el avance a lo largo de tiempo. 

### Modelo


https://drive.google.com/file/d/1zpFRJattUcgWjvaiwikj7yXvM7jI8qKg/view?usp=sharing


## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Rutina<br>|
|CRUD dependiente|1. CRUD Seguimiento {depende de} CRUD Tipo Usuario y Ejercicio<br>2. CRUD Multimedia {depende de} CRUD Ejercicio|
|Listado<br>+<br>detalle| 1. Listado de usuarios filtrados por rutina, muestra nombre de usuario <br> 2. Listado de rutinas filtrado por grupo muscular o tipo, muestra nombre de rutina y ejercicios|
|CUU/Epic|1. Registrar usuario<br>2. Crear rutinas<br>3. Seguir rutina(favorita)|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Rutina<br>3. CRUD Ejercicio<br>4. CRUD Seguimiento<br>5. CRUD Multimedia|
|CUU/Epic|1. Registrar usuario<br>2. Iniciar sesion como usuario<br>3. Crear rutinas<br>4. Seguir rutinas<br>5. Mostrar rutinas disponibles<br>Generar un seguimiento para los usuarios|




