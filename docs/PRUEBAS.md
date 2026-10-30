# Pruebas con Vitest

Se ejecutan con `npm test` (o `npm run coverage` para ver la cobertura). No necesitan conexión a Supabase: en las pruebas del backend la base de datos se reemplaza por una función simulada.

## Resultado

```
Test Files  8 passed (8)
     Tests  72 passed (72)
```

## Qué se prueba y por qué

| Archivo | Qué comprueba | Por qué se eligió |
|---|---|---|
| `src/utils/validaciones.test.js` (25) | Login, candidato (teléfono chileno, nombres con tildes y ñ), solicitud, evaluación y reglas de cambio de etapa | Son las reglas del negocio y se usan en el front y en el back; un error aquí afecta a toda la app |
| `src/utils/dashboard.test.js` (14) | Unión de solicitudes con candidatos, filtros, conteo por etapa, % de recomendados, promedio de días y carga por evaluador | Son los indicadores que ve la psicóloga; deben calcularse bien para tomar decisiones |
| `src/utils/formatters.test.js` (7) | Formato de fechas, días entre fechas y filtro de candidatos | Se usan en casi todas las vistas |
| `src/context/DataContext.test.js` (7) | El reducer agrega, reemplaza y limpia datos sin modificar el estado anterior | Si el estado se actualiza mal, las vistas muestran información desactualizada |
| `src/pages/Login.test.jsx` (3) | Validación del formulario, mensaje de credenciales incorrectas y redirección al panel | Es la puerta de entrada a la aplicación |
| `src/components/solicitudes/CambioEtapa.test.jsx` (4) | Bloqueo del avance con su motivo, avance con comentario y error del servidor | Es la acción principal del seguimiento (reemplaza mover tarjetas en Planner) |
| `src/components/dashboard/TablaSolicitudes.test.jsx` (2) | Mensaje sin resultados y enlaces al detalle | Es la tabla principal del panel y del listado |
| `server/api.test.js` (10) | Login (400, 401 y token), rutas protegidas sin token o con token falso, validación en la API, permiso por rol y 404 | Comprueba que el backend no confía solo en las validaciones del frontend |

## Tipos de prueba

- **Unitarias**: funciones puras de `utils/` y el reducer.
- **De componentes**: se renderiza el componente con Testing Library y se simula al usuario con `user-event`.
- **De API**: se hacen peticiones HTTP reales a la aplicación Express con Supertest.
