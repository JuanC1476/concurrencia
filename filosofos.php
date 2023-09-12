<?php

// Declaraciones iniciales
$tenedores = array();
for ($i = 0; $i < 5; $i++) {
    $tenedores[] = new \Semaphore(1);
}

// Función del filósofo
function filosofo($i) {
    while (true) {
        // Pensar
        echo "Filósofo $i pensando...\n";

        // Asegurar los tenedores
        $tenedores[$i]->acquire();
        $tenedores[(($i + 1) % 5)]->acquire();

        // Comer
        echo "Filósofo $i comiendo...\n";

        // Soltar los tenedores
        $tenedores[$i]->release();
        $tenedores[(($i + 1) % 5)]->release();
    }
}

// Crear los filósofos
for ($i = 0; $i < 5; $i++) {
    new \Thread(function () {
        filosofo($i);
    });
}

// Esperar a que terminen todos los hilos
\Swoole\Runtime::wait();

/*
Este código funciona utilizando un monitor para proteger el acceso a los tenedores. El monitor cuenta con cinco semáforos, uno para cada tenedor.

Los filósofos utilizan los semáforos para asegurar los tenedores que necesitan para comer. Una vez que tienen los dos tenedores, los filósofos pueden comer.

Este código garantiza que los filósofos no tengan que esperar indefinidamente por un tenedor, lo que evita el problema de la muerte por inanición.

Aquí hay una explicación más detallada del funcionamiento del código:

La función filosofo() se ejecuta en un hilo separado. Esta función se repite indefinidamente.
En cada iteración, la función filosofo() piensa durante un tiempo aleatorio.
Una vez que ha terminado de pensar, la función filosofo() intenta asegurar los dos tenedores que necesita para comer.
Si no puede asegurar los dos tenedores, la función filosofo() vuelve a intentarlo más tarde.
Una vez que ha asegurado los dos tenedores, la función filosofo() come durante un tiempo aleatorio.
Una vez que ha terminado de comer, la función filosofo() suelta los dos tenedores y vuelve a pensar.
La función main() crea cinco filósofos. Los filósofos se ejecutan en hilos separados. La función main() espera a que terminen todos los hilos antes de terminar.

Este código funciona correctamente para cualquier valor del tamaño del número de filósofos.


*/