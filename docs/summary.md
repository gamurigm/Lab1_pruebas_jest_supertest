# Resumen de Herramientas de Calidad para Node.js: Jest, Supertest y ESLint

Este documento resume la importancia, instalación, funciones y comparación de tres herramientas esenciales para el aseguramiento de la calidad en el desarrollo de APIs con Node.js: **Jest**, **Supertest** y **ESLint**.

## 1. Instalación

Para implementar esta cadena de herramientas, se deben instalar las dependencias de desarrollo en el proyecto.

```bash
npm install --save-dev jest supertest eslint
```

Adicionalmente, se recomienda instalar herramientas para la automatización del flujo de trabajo:

```bash
npm install --save-dev husky lint-staged
```

## 2. Funciones de cada Herramienta

### Jest
**Rol:** Marco de Pruebas Unitarias y Ejecutor (Test Runner).
*   **Ejecución Paralela:** Ejecuta pruebas en procesos aislados para mayor velocidad y seguridad.
*   **Mocking:** Permite aislar la lógica de negocio simulando dependencias (`jest.fn()`, `jest.spyOn()`, `jest.mock()`).
*   **Aserciones:** Proporciona una API rica (`expect`) para validar condiciones y estructuras de datos.
*   **Cobertura:** Genera informes de cobertura de código integrados (`--coverage`).

### Supertest
**Rol:** Librería de Aserciones HTTP para Pruebas de Integración.
*   **Pruebas In-Process:** Simula peticiones HTTP directamente a la instancia de la aplicación Express/Node.js sin necesidad de un puerto de red activo.
*   **Validación de Contrato:** Verifica códigos de estado, encabezados y cuerpos de respuesta.
*   **Sintaxis Encadenable:** Facilita la escritura de pruebas legibles (`.get()`, `.expect()`).

### ESLint
**Rol:** Linter y Análisis Estático de Código.
*   **Análisis Estático:** Identifica patrones defectuosos y errores de estilo analizando el AST.
*   **Reglas Configurables:** Permite activar/desactivar reglas y establecer severidad.
*   **Plugins:** Extensible para Node.js, TypeScript, etc. (ej. `eslint-plugin-n`).
*   **Auto-corrección:** Corrige automáticamente problemas de estilo simples.

## 3. Tablas de Características por Herramienta

### Tabla 1: Jest - Características Clave
| Categoría | Característica | Relevancia |
| :--- | :--- | :--- |
| **Arquitectura** | Ejecución Paralela y Aislamiento | Maximiza rendimiento y garantiza independencia de pruebas. |
| **Dependencias** | Mocking (`jest.fn`, `jest.spyOn`) | Aísla lógica de negocio de E/S externas. |
| **Aserción** | Matchers Integrados (`expect`) | Sintaxis legible para validar estructuras complejas. |
| **Calidad** | Cobertura de Código Integrada | Permite imponer umbrales de calidad en CI/CD. |

### Tabla 2: Supertest - Métodos de Aserción
| Método | Sintaxis Ejemplo | Propósito |
| :--- | :--- | :--- |
| **Estado** | `.expect(200)` | Asegura el código de estado HTTP correcto. |
| **Encabezado** | `.expect('Content-Type', /json/)` | Asegura el formato de respuesta (Contrato API). |
| **Cuerpo** | `.expect(404, /not found/)` | Valida mensajes de error o contenido específico. |
| **Custom** | `.expect(res => ...)` | Lógica de validación compleja sobre el JSON. |

### Tabla 3: ESLint - Configuración
| Opción | Descripción | Ejemplo |
| :--- | :--- | :--- |
| **Rules** | Control de severidad de comprobaciones. | `'no-unused-vars': 'error'` |
| **Plugins** | Reglas especializadas (Node, TS). | `eslint-plugin-n` |
| **Extends** | Configuraciones base compartidas. | `eslint:recommended` |
| **Env** | Define variables globales. | `{ node: true, jest: true }` |

## 4. Tabla Comparativa

### Tabla 4: Comparativa Jest vs Supertest vs ESLint

| Criterio | Jest | Supertest | ESLint |
| :--- | :--- | :--- | :--- |
| **Función Primaria** | Marco y Ejecutor de Pruebas | Librería de Aserción HTTP | Análisis Estático (Linter) |
| **Enfoque** | Pruebas Unitarias y Mocking | Pruebas de Integración (API) | Calidad y Estilo de Código |
| **Mecanismo** | Procesos aislados, Matchers | Simulación HTTP In-Process | Análisis de AST |
| **Uso en Node.js** | Lógica de servicio y unitaria | Validación de rutas y contratos | Prevención de bugs y estilo |
| **Complejidad** | Moderada (Configuración) | Mínima | Moderada (Reglas/Plugins) |

## 5. Conclusión

La integración de estas tres herramientas crea una estrategia de calidad robusta: **ESLint** asegura la consistencia del código, **Jest** valida la lógica interna, y **Supertest** garantiza que la API cumpla con su contrato externo. Se recomienda su adopción conjunta en el flujo de trabajo de desarrollo (CI/CD).
