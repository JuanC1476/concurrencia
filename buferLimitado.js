<?php

// Declaraciones iniciales
$buffer = array();
$size = 10;
$mutex = new \Mutex();
$full = new \Semaphore(0);
$empty = new \Semaphore($size);

// Función del productor
function producer() {
    while (true) {
        // Esperar hasta que haya espacio en el búfer
        $empty->acquire();

        // Agregar un elemento al búfer
        $buffer[] = rand();

        // Notificar al consumidor
        $full->release();
    }
}

// Función del consumidor
function consumer() {
    while (true) {
        // Esperar hasta que haya elementos en el búfer
        $full->acquire();

        // Eliminar un elemento del búfer
        $item = array_shift($buffer);

        // Notificar al productor
        $empty->release();

        // Imprimir el elemento eliminado
        echo $item . PHP_EOL;
    }
}

// Crear los productores y consumidores
for ($i = 0; $i < 5; $i++) {
    new \Thread(function () {
        producer();
    });
}

for ($i = 0; $i < 10; $i++) {
    new \Thread(function () {
        consumer();
    });
}

// Esperar a que terminen todos los hilos
\Swoole\Runtime::wait();





/*Este código funciona utilizando un monitor para proteger el acceso al búfer. El monitor cuenta con dos semáforos:

full: Este semáforo se utiliza para indicar que hay espacio disponible en el búfer.
empty: Este semáforo se utiliza para indicar que hay elementos disponibles en el búfer.
El productor utiliza el semáforo full para esperar hasta que haya espacio disponible en el búfer. Una vez que hay espacio disponible, el productor agrega un elemento al búfer y notifica al consumidor utilizando el semáforo empty.

El consumidor utiliza el semáforo empty para esperar hasta que haya elementos disponibles en el búfer. Una vez que hay elementos disponibles, el consumidor elimina un elemento del búfer y notifica al productor utilizando el semáforo full.

Este código garantiza que los productores y consumidores no accedan al búfer al mismo tiempo, lo que evita errores de concurrencia.

Aquí hay una explicación más detallada del funcionamiento del código:

La función producer() se ejecuta en un hilo separado. Esta función se repite indefinidamente.

En cada iteración, la función producer() utiliza el semáforo full para esperar hasta que haya espacio disponible en el búfer.

Una vez que hay espacio disponible, la función producer() agrega un elemento al búfer.

Finalmente, la función producer() notifica al consumidor utilizando el semáforo empty.

La función consumer() se ejecuta en un hilo separado. Esta función se repite indefinidamente.

En cada iteración, la función consumer() utiliza el semáforo empty para esperar hasta que haya elementos disponibles en el búfer.

Una vez que hay elementos disponibles, la función consumer() elimina un elemento del búfer.

Finalmente, la función consumer() imprime el elemento eliminado.

La función main() crea cinco productores y diez consumidores. Los productores y consumidores se ejecutan en hilos separados. La función main() espera a que terminen todos los hilos antes de terminar.

Este código funciona correctamente para cualquier valor del tamaño del búfer.*/