// Importar el paquete 'semaphore' de npm
const Semaphore = require('semaphore');

// Crear un semáforo con un número máximo de permisos
const semaphore = new Semaphore(2);

// Función para acceder al recurso compartido
function accederRecurso() {
  // Esperar a que se adquiera un permiso del semáforo
  semaphore.take(() => {
    // Acceder al recurso compartido
    console.log('Accediendo al recurso compartido');

    // Simular una tarea que toma tiempo
    setTimeout(() => {
      // Liberar el permiso del semáforo
      semaphore.leave();
      console.log('Saliendo del recurso compartido');
    }, 2000);
  });
}

// Lanzar múltiples hilos o procesos que acceden al recurso compartido
for (let i = 0; i < 5; i++) {
  accederRecurso();
}

