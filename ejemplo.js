/**
 * Archivo de ejemplo para demostrar el uso de los modelos
 */
import { 
    Alcalde, 
    Ciudad, 
    Mapa, 
    Ciudadano, 
    Contrato,
    Casa,
    Fabrica,
    Hospital,
    PlantaElectrica,
    PlantaAgua,
    Parque
} from './modelos/index.js';

// Crear un alcalde
const alcalde = new Alcalde(1, "Juan Pérez", "password123");
console.log("Alcalde creado:", alcalde.nombre);

// Crear un mapa
const mapa = new Mapa(100);
console.log("Mapa creado con tamaño:", mapa.tamaño);

// Crear una ciudad
const ciudad = new Ciudad(1, "Nueva Ciudad", 0, mapa);
console.log("Ciudad creada:", ciudad.nombre);

// Asociar la ciudad al alcalde
alcalde.agregarCiudad(ciudad);
console.log("Ciudad agregada al alcalde. Total ciudades:", alcalde.misCiudades.length);

// Crear ciudadanos
const ciudadano1 = new Ciudadano(1, 80);
const ciudadano2 = new Ciudadano(2, 75);
ciudad.agregarCiudadano(ciudadano1);
ciudad.agregarCiudadano(ciudadano2);
console.log("Ciudadanos agregados. Total:", ciudad.misCiudadanos.length);

// Crear edificios
const casa1 = new Casa(1000, 4); // Costo 1000, capacidad 4 personas
const fabrica1 = new Fabrica(5000, 20); // Costo 5000, 20 empleos
const hospital1 = new Hospital(8000, 50, 100); // Costo 8000, radio 50, beneficio 100
const plantaElectrica = new PlantaElectrica(10000);
const plantaAgua = new PlantaAgua(8000);
const parque1 = new Parque(500, 30); // Costo 500, beneficio 30

// Agregar edificios al mapa y a la ciudad
mapa.agregarEdificio(casa1);
mapa.agregarEdificio(fabrica1);
mapa.agregarEdificio(hospital1);
mapa.agregarEdificio(plantaElectrica);
mapa.agregarEdificio(plantaAgua);
mapa.agregarEdificio(parque1);

ciudad.agregarEdificio(casa1);
ciudad.agregarEdificio(fabrica1);
ciudad.agregarEdificio(hospital1);
ciudad.agregarEdificio(plantaElectrica);
ciudad.agregarEdificio(plantaAgua);
ciudad.agregarEdificio(parque1);

console.log("Edificios agregados. Total en mapa:", mapa.misEdificios.length);
console.log("Edificios en ciudad:", ciudad.misEdificios.length);

// Crear contratos (relación n-n entre ciudadanos y edificios)
const contrato1 = new Contrato(1, ciudadano1, casa1);
const contrato2 = new Contrato(2, ciudadano1, fabrica1);
const contrato3 = new Contrato(3, ciudadano2, fabrica1);

ciudadano1.agregarContrato(contrato1);
ciudadano1.agregarContrato(contrato2);
ciudadano2.agregarContrato(contrato3);

casa1.agregarContrato(contrato1);
fabrica1.agregarContrato(contrato2);
fabrica1.agregarContrato(contrato3);

console.log("Contratos creados.");
console.log("Ciudadano 1 tiene", ciudadano1.misContratos.length, "contratos");
console.log("Fábrica tiene", fabrica1.misContratos.length, "contratos");

// Probar métodos de producción y consumo
console.log("\n--- Producción y Consumo ---");
console.log("Casa - Producción por turno:", casa1.produccionXTurno());
console.log("Casa - Consumo de agua:", casa1.consumoAgua());
console.log("Casa - Consumo de electricidad:", casa1.consumoElectricidad());

console.log("\nPlanta Eléctrica - Producción:", plantaElectrica.produccionXTurno());
console.log("Planta Eléctrica - Consumo de agua:", plantaElectrica.consumoAgua());
console.log("Planta Eléctrica - Consumo de electricidad:", plantaElectrica.consumoElectricidad());

console.log("\nFábrica - Producción por turno:", fabrica1.produccionXTurno());
console.log("Fábrica - Número de empleos:", fabrica1.numeroEmpleos);

console.log("\nHospital - Radio de cobertura:", hospital1.radio);
console.log("Hospital - Beneficio:", hospital1.beneficio);

// Avanzar turno
ciudad.avanzarTurno();
console.log("\n--- Turno actual:", ciudad.turno, "---");
