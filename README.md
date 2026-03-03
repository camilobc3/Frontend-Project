# Proyecto Juego de Ciudad - Arquitectura por Capas

Este proyecto implementa un juego web donde el jugador es un alcalde que gestiona una ciudad y construye diferentes tipos de edificios.

## Estructura del Proyecto

El proyecto está organizado en 4 capas:

- **acceso_datos/**: Capa de acceso a datos
- **modelos/**: Modelos del dominio (actualmente implementado)
- **negocio/**: Lógica de negocio
- **presentacion/**: Interfaz de usuario

## Modelos Implementados

### Interfaces

- **Produccion**: Define el método `produccionXTurno(): int`
- **ConsumoServicios**: Define los métodos `consumoAgua(): int` y `consumoElectricidad(): int`

### Clases Base

- **Alcalde**: Representa al jugador
  - Atributos: `id`, `nombre`, `contraseña`
  - Relación: 1-n con Ciudad (lista `misCiudades`)

- **Ciudad**: Representa una ciudad gestionada
  - Atributos: `id`, `nombre`, `turno`
  - Relaciones:
    - 1-1 con Mapa (`miMapa`)
    - 1-n con Ciudadano (lista `misCiudadanos`)
    - 1-n con Edificio (lista `misEdificios`)

- **Ciudadano**: Representa un habitante de la ciudad
  - Atributos: `id`, `nivelFelicidad`
  - Relación: n-n con Edificio a través de Contrato (lista `misContratos`)

- **Mapa**: Representa el mapa de la ciudad
  - Atributos: `tamaño`
  - Relación: 1-n con Edificio (lista `misEdificios`)

- **Contrato**: Relación muchos a muchos entre Ciudadano y Edificio
  - Atributos: `id`, `miCiudadano`, `miEdificio`

### Jerarquía de Edificios

#### Edificio (Abstracta)
- Atributos: `costo`
- Relación: n-n con Ciudadano a través de Contrato (lista `misContratos`)

#### Edificios Simples
- **Parque**: `beneficio`
- **Camino**: `beneficio`

#### PlantaUtilidad (Abstracta)
Hereda de Edificio e implementa Produccion y ConsumoServicios

- **PlantaElectrica**: Produce electricidad
- **PlantaAgua**: Produce agua

#### EdificioServicio (Abstracta)
Hereda de Edificio e implementa Produccion y ConsumoServicios
- Atributos: `radio`, `beneficio`

- **EstacionPolicia**: Proporciona seguridad
- **EstacionBombero**: Proporciona protección contra incendios
- **Hospital**: Proporciona servicios de salud

#### EdificioIndustrial (Abstracta)
Hereda de Edificio e implementa Produccion y ConsumoServicios
- Atributos: `numeroEmpleos`

- **Fabrica**: Produce bienes industriales
- **Granja**: Produce alimentos

#### EdificioComercial (Abstracta)
Hereda de Edificio e implementa Produccion y ConsumoServicios
- Atributos: `numeroEmpleos`

- **Tienda**: Comercio pequeño
- **CentroComercial**: Comercio grande

#### EdificioResidencial (Abstracta)
Hereda de Edificio e implementa Produccion y ConsumoServicios
- Atributos: `capacidadVivienda`

- **Casa**: Vivienda individual
- **Apartamento**: Edificio de múltiples unidades

## Uso

Para importar los modelos en otros módulos:

```javascript
// Importar todos los modelos
import * as Modelos from './modelos/index.js';

// O importar modelos específicos
import { Alcalde, Ciudad, Casa, Fabrica } from './modelos/index.js';

// Crear instancias
const alcalde = new Modelos.Alcalde(1, "Juan", "password123");
const ciudad = new Modelos.Ciudad(1, "Mi Ciudad", 0);
```

## Relaciones entre Clases

1. **Alcalde-Ciudad (1-n)**: Un alcalde puede gestionar múltiples ciudades
2. **Ciudad-Mapa (1-1)**: Cada ciudad tiene un mapa
3. **Ciudad-Ciudadano (1-n)**: Una ciudad tiene múltiples ciudadanos
4. **Mapa-Edificio (1-n)**: Un mapa contiene múltiples edificios
5. **Ciudad-Edificio (1-n)**: Una ciudad tiene múltiples edificios
6. **Ciudadano-Edificio (n-n)**: Relación muchos a muchos a través de Contrato

## Próximos Pasos

- Implementar la capa de negocio con las reglas del juego
- Implementar la capa de acceso a datos para persistencia
- Implementar la capa de presentación con la interfaz gráfica
