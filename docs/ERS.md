# Especificación de Requisitos de Software (ERS)
## Sistema de Gestión de Evaluaciones Psicolaborales | AquaChile

| Campo | Valor |
| --- | --- |
| Proyecto | ProyectoAquaChile |
| Asignatura | DSY1104 Desarrollo Full Stack II, Duoc UC |
| Contexto | Proyecto de Vinculación con el Medio (VcM) |
| Contraparte | AquaChile, área de Reclutamiento y Selección |
| Versión | 0.2 — especificación general para revisión |
| Fecha | 31/10/2026 |
| Alcance del documento | Proyecto completo definido para el MVP, incluidas las funciones pendientes |
| Referencia de avance | Entrega AquaChile 1/2, documentada el 30/10/2026 |

## 1. Introducción

Este documento define los requisitos generales de ProyectoAquaChile, un sistema web para gestionar evaluaciones psicolaborales del área de Reclutamiento y Selección. Abarca el conjunto de funciones definido para el MVP, desde el registro de candidatos y solicitudes hasta el cierre de la evaluación y el apoyo con IA previsto para la siguiente entrega.

El propósito del ERS es establecer qué debe hacer el sistema, quiénes lo utilizan y qué reglas y restricciones debe cumplir. Los requisitos describen el alcance acordado del proyecto; su inclusión no significa que todos estén implementados o verificados. El avance actual, los resultados de pruebas y las comprobaciones pendientes se presentan por separado.


### 1.1 Estado de los requisitos

| Estado | Descripción |
| --- | --- |
| Documentado (D) | Funcionalidad incluida en el alcance descrito del proyecto. Su funcionamiento completo debe contrastarse con la aplicación. |
| Reportado (R) | Resultado registrado en la documentación de pruebas o comunicado durante la revisión manual. |
| Verificado en pruebas (VP) | Comportamiento comprobado por la suite automatizada; no implica validación integral con la base real. |
| Pendiente (P) | Funcionalidad prevista para una próxima entrega. |
| Por validar (V) | Comportamiento o detalle que todavía requiere comprobación. |

### 1.2 Descripción general del producto

El sistema reúne en una aplicación web el registro de candidatos, las solicitudes de evaluación, la asignación de profesionales, el seguimiento de entrevistas, los resultados y los indicadores del proceso. La relación principal es candidato → solicitud → evaluación, con un historial que permite consultar los cambios de etapa.

La solución busca reemplazar el uso disperso de herramientas para estas tareas. No requiere una sincronización con las herramientas anteriores para cumplir el flujo definido. Su arquitectura contempla un frontend React, una API Express y una base de datos PostgreSQL en Supabase.

## 2. Problema y objetivos

Actualmente, la solicitud de evaluación llega por Microsoft Forms, los datos se mantienen en Excel, el seguimiento se actualiza manualmente en Planner y los indicadores están en otro dashboard. La dispersión obliga a copiar información, mover tarjetas y realizar tareas administrativas, sin una vista única del proceso.

**Objetivo general:** centralizar el registro y seguimiento de evaluaciones psicolaborales para facilitar el trabajo del área de Reclutamiento y Selección.

Objetivos específicos derivados de esa problemática:

1. Reunir candidatos y solicitudes en un flujo consultable.
2. Hacer visible la etapa de cada solicitud, su responsable y su entrevista.
3. Registrar resultados y observaciones con reglas consistentes.
4. Entregar filtros e indicadores para apoyar el seguimiento.
5. Restringir el acceso a operaciones privadas y el registro de evaluaciones según el rol.

## 3. Alcance y límites

### 3.1 Alcance general del proyecto

El proyecto contempla autenticación, gestión de candidatos, creación y consulta de solicitudes, formulario público, asignación de evaluador y fecha, seguimiento por cuatro etapas, registro de evaluaciones, historial, filtros e indicadores. También incluye el apoyo con IA previsto para la siguiente entrega, como asistencia a la decisión del profesional y sin reemplazar su criterio.

La solución considera tanto el frontend como la API y la persistencia de datos. El flujo debe mantener la relación entre candidatos, solicitudes, evaluaciones y cambios de etapa.

### 3.2 Desarrollo por etapas

| Etapa | Funciones contempladas | Situación |
| --- | --- | --- |
| Entrega 1/2 | Registro y consulta de candidatos, solicitudes, asignación, etapas, evaluaciones, historial, filtros, indicadores y acceso por roles. | Flujo principal revisado manualmente con resultado satisfactorio reportado; quedan verificaciones específicas y ajustes pendientes. |
| Entrega 2/2 | Sugerencia de categoría mediante IA, ajustes de diseño y ampliación de pruebas según retroalimentación. | Desarrollo pendiente. |

### 3.3 Límites del alcance definido

El alcance definido no incluye integración automática con Forms, Excel, Planner o el dashboard anterior; creación automática de carpetas; generación o envío electrónico de informes; notificaciones; exportaciones; administración de usuarios; eliminación de registros ni despliegue productivo. El estado **Informe enviado** representa un hito del flujo: no corresponde a un envío automático de archivos o correos.

Para el desarrollo, las pruebas y las demostraciones se utilizarán datos ficticios. El tratamiento de datos personales reales y las condiciones para una operación productiva requieren una definición y validación adicionales.

## 4. Actores y permisos

| Actor | Interacción documentada | Límite o precisión pendiente |
| --- | --- | --- |
| Solicitante del formulario público | Envía una solicitud desde `/postular` sin sesión. Está orientado a la solicitud de evaluaciones por parte del analista. | El acceso público no acredita identidad ni rol. No implica acceso a consultas privadas. |
| Analista de reclutamiento | Inicia sesión, crea candidatos y solicitudes y participa en su seguimiento. | No puede registrar evaluaciones. La matriz exhaustiva de permisos de edición, asignación y cambio de etapa debe validarse. |
| Profesional evaluador | Usuario autenticado que además registra resultado y observaciones de evaluación. Puede ser asignado como responsable. | No se documenta si solo puede evaluar solicitudes asignadas a sí mismo. |
| Psicóloga / contraparte | Usa la información para el seguimiento y conserva la decisión final ante la futura sugerencia de IA. | No se define un tercer rol técnico: su correspondencia con el rol evaluador debe confirmarse. |

No se documenta un rol administrador. Supabase es un servicio de infraestructura, no un actor de negocio.

## 5. Requisitos funcionales

Los siguientes requisitos establecen el comportamiento esperado del sistema y sirven como base para su validación.

| ID | Requisito y criterio de aceptación | Estado |
| --- | --- | --- |
| RF-01 | Iniciar sesión con credenciales. Un acceso válido entrega un token y permite entrar al panel; credenciales incorrectas muestran un error. | D |
| RF-02 | Registrar, consultar y editar candidatos; presentar listado y ficha con sus solicitudes. Los formularios deben validar los datos antes de aceptar el registro. | D |
| RF-03 | Crear y consultar solicitudes vinculadas a un candidato; mostrar listado y detalle. Una solicitud nueva comienza en Evaluación recibida. | D |
| RF-04 | Recibir solicitudes por formulario público sin sesión. El envío debe informar el resultado de la operación y aplicar validaciones. La persistencia exacta de candidato y solicitud debe comprobarse. | D / V |
| RF-05 | Asignar un evaluador responsable y una fecha de entrevista desde el detalle de la solicitud. Para agendar deben existir ambos datos. | D |
| RF-06 | Cambiar la etapa de una solicitud permitiendo únicamente avanzar o retroceder una etapa por vez y comunicando los bloqueos. | D |
| RF-07 | Registrar resultado y observaciones de evaluación mediante un usuario evaluador; rechazar esa operación para el analista. | D |
| RF-08 | Mostrar el panel con solicitudes e indicadores: conteo por etapa, porcentaje de recomendados, promedio de días y carga por evaluador. Validar fórmulas y universo de cálculo antes de aceptarlos. | D / V |
| RF-09 | Buscar y filtrar candidatos y solicitudes; reflejar los resultados en las listas y mostrar un mensaje cuando no existan coincidencias. Los campos exactos de cada filtro deben confirmarse. | D / V |
| RF-10 | Consultar el historial de etapas de cada solicitud, con etapa, fecha, comentario y usuario según el modelo de datos. | D |
| RF-11 | Proteger operaciones privadas mediante token; login y postulaciones son excepciones públicas. Aplicar autorización por rol al registro de evaluaciones. | D |
| RF-12 | Permitir un recorrido coherente entre panel, candidato, solicitud y seguimiento, con enlaces a los detalles y sin destinos rotos. | D / V |
| RF-13 | Al pasar a Informe enviado, requerir una evaluación registrada y dejarla Finalizada. No implica envío electrónico del informe. | D |
| RF-14 | Sugerir mediante IA una categoría a partir de observaciones, manteniendo la decisión humana final. Modelo, integración y criterios de aceptación detallados están por definir. | P |

## 6. Reglas de negocio y validación

| ID | Regla | Observaciones |
| --- | --- | --- |
| RN-01 | Secuencia: Evaluación recibida → Entrevista agendada → Entrevista realizada → Informe enviado. | |
| RN-02 | Solo se permite avanzar o retroceder una etapa por operación; no saltar etapas. | |
| RN-03 | No se puede agendar sin evaluador y fecha de entrevista. | |
| RN-04 | No se puede pasar a Informe enviado sin evaluación registrada. | |
| RN-05 | Solo el rol evaluador registra una evaluación. | |
| RN-06 | Resultados admitidos: Recomendado, Recomendado con observaciones y No recomendado. | |
| RN-07 | Al llegar a Informe enviado, la evaluación queda Finalizada. | |
| RN-08 | Equivalencia de seguimiento: Pendiente = Evaluación recibida; En proceso = Entrevista agendada o realizada; Finalizada = Informe enviado. | no confundir con el campo estado de la evaluación. |
| RN-09 | Las validaciones se comparten entre formularios y API. Las pruebas registradas incluyen casos de teléfono chileno y nombres con tildes y ñ. | no se especifican aquí longitudes o formatos exactos sin evidencia. |
| RN-10 | La IA futura apoya la clasificación; la decisión final permanece en la psicóloga. | pendiente. |


## 7. Requisitos no funcionales y restricciones

| ID | Requisito / criterio de revisión | Evidencia y límite |
| --- | --- | --- |
| RNF-01 | Seguridad de acceso: usar JWT para rutas privadas y bcrypt para el hash de contraseñas. Duración de token declarada: 8 horas. | D; no se realizó auditoría ni prueba de expiración. |
| RNF-02 | Interfaz adaptable con Bootstrap 5 en las vistas principales. Revisar formularios, tablas y navegación en distintos anchos sin pérdida de acciones esenciales. | D / V; revisión visual y tamaños mínimos por confirmar. |
| RNF-03 | Usabilidad: comunicar validaciones, errores, ausencia de resultados y operaciones simuladas; mantener navegación coherente. | Evidencia documental parcial; aceptación manual pendiente. |
| RNF-04 | Mantenibilidad: organizar React en componentes reutilizables, separar acceso a API y compartir validaciones; evidenciar props, arreglos, `.map()`, estado, eventos y condicionales. | Estructura D; uso concreto de todos los recursos V. Verificación en código pendiente. |
| RNF-05 | Consistencia: usar una fuente central de datos y actualizar el estado de las vistas sin mutar el estado anterior. | D; reducer con pruebas VP. Consistencia con persistencia real V. |
| RNF-06 | Verificabilidad: mantener pruebas Vitest pertinentes y evidencia de ejecución; justificar escenarios. | 72/72 VP, ejecutadas el 31/10/2026; cobertura sin medir. |
| RNF-07 | Reproducibilidad del entorno: documentar ejecución con Node.js 20 o superior, dependencias y configuración de conexión. | D; instalación y arranque no reproducidos. |
| RNF-08 | Datos de demostración exclusivamente ficticios o anonimizados; no usar datos personales reales. | Declaración de datos ficticios D; contenido de la base no auditado. |

No hay objetivos cuantificados documentados de latencia, concurrencia, disponibilidad, accesibilidad, respaldo, recuperación o retención. Estos criterios deberán acordarse si el alcance futuro los requiere.

## 8. Flujo principal y excepciones

1. El analista registra al candidato; alternativamente, el proceso comienza en el formulario público.
2. Se crea una solicitud asociada al candidato en **Evaluación recibida**.
3. Se asigna evaluador y fecha; la solicitud pasa a **Entrevista agendada**.
4. Tras la entrevista, pasa a **Entrevista realizada**; el evaluador registra resultado y observaciones.
5. Al registrar el hito de envío del informe, pasa a **Informe enviado** y la evaluación queda **Finalizada**.
6. El panel permite consultar la distribución por etapas y los indicadores.

Los intentos de saltar etapas, agendar sin datos o finalizar sin evaluación deben bloquearse. Un analista no debe poder guardar una evaluación. Las rutas privadas deben rechazar accesos sin token válido. Las pruebas registradas incluyen bloqueos y errores de servidor. El recorrido completo contra Supabase requiere una validación adicional.

## 9. Arquitectura e interfaces documentadas

```text
Navegador: React 18 + Vite + React Router 6 + Bootstrap 5
                         |
                API REST / token JWT
                         |
                 Node.js + Express 5
                         |
              PostgreSQL en Supabase (pg)
```

- `src/services/api.js` centraliza las llamadas y agrega el token.
- `AuthContext` gestiona la sesión; `DataContext`, con Context API y useReducer, reúne el estado de los datos.
- `src/utils/validaciones.js` contiene validaciones compartidas por frontend y backend.
- En desarrollo, frontend y API usan los puertos 5173 y 3001 respectivamente.
- En producción, Express entrega la API y el frontend compilado en `dist/`; la solución es monolítica y se plantea como un único servicio.
- La base se configura mediante `DATABASE_URL`. La conexión efectiva está pendiente de validación.

### 9.1 Entidades y relaciones

| Entidad | Contenido principal | Relaciones declaradas |
| --- | --- | --- |
| Usuarios | Nombre, email, hash de contraseña y rol analista/evaluador. | Un usuario puede ser responsable de varias solicitudes. |
| Candidatos | Nombre, email, teléfono, cargo, familia de cargo, ubicación, origen Interno/Externo y fecha de registro. | Un candidato puede tener varias solicitudes. |
| Solicitudes | Candidato, cargo, familia, ubicación, analista, responsable, etapa, fechas y observaciones. | Pertenece a un candidato; puede generar una evaluación y varios registros de historial. |
| Evaluaciones | Solicitud, fecha, resultado, observaciones y estado En proceso/Finalizada. | Cero o una evaluación por solicitud en el modelo documentado. |
| Historial de etapas | Solicitud, etapa, fecha, comentario y usuario. | Varios registros por solicitud. |

Las cardinalidades corresponden al modelo de datos del proyecto. Queda pendiente contrastarlas con las restricciones SQL y la integridad referencial de la base.

### 9.2 Vistas

| Acceso | Rutas |
| --- | --- |
| Público | `/login`, `/postular` |
| Con sesión | `/`, `/candidatos`, `/candidatos/nuevo`, `/candidatos/:id`, `/candidatos/:id/editar`, `/solicitudes`, `/solicitudes/nueva`, `/solicitudes/:id` |

El detalle de solicitud reúne asignación, etapa, evaluación e historial. La visibilidad de acciones por rol debe contrastarse con las autorizaciones de la API.

### 9.3 API

Se documentan login, candidatos, solicitudes, cambio de etapa, evaluación, consulta de evaluaciones, lista de evaluadores y postulaciones públicas. Salvo login y postulaciones, las rutas requieren `Authorization: Bearer <token>`.

**Pendiente de revisión:** confirmar la ruta de creación de candidatos, que aparece agrupada con las operaciones sobre `/api/candidatos/:id` en la descripción de la API. También deben precisarse las respuestas y los errores de cada operación.

## 10. Validación y estado actual del proyecto

### 10.1 Criterios generales de aceptación

La aceptación del sistema requiere comprobar el flujo completo con datos ficticios: registrar y consultar un candidato, crear su solicitud, asignar evaluador y fecha, avanzar por las etapas permitidas, registrar la evaluación con el rol autorizado y cerrar el seguimiento. Deben comprobarse también los bloqueos del proceso, los filtros, los indicadores y la consulta del historial.

La validación debe distinguir entre pruebas con datos simulados y operaciones con persistencia real. El apoyo con IA requiere criterios adicionales antes de su implementación: información de entrada, categorías de salida, manejo de errores y revisión de la sugerencia por la psicóloga.

### 10.2 Pruebas ejecutadas

Resultado verificado el **31/10/2026** mediante `npm test -- --reporter=verbose`:

```text
Test Files  8 passed (8)
     Tests  72 passed (72)
```

**Estado: verificado en pruebas (VP).** La ejecución finalizó correctamente con 72 casos aprobados en 8 archivos y una duración total de 3,42 segundos. La salida completa está disponible en [Evidencia de pruebas Vitest](evidencias/pruebas-vitest-2026-10-31.txt).

Commit de referencia del repositorio: `b91b94d846a360df48445f7be4dbffb3f3f05ac2`. La ejecución corresponde al contenido local del proyecto; esta referencia no certifica que todos los archivos coincidan con el commit. No se ejecutó el reporte de cobertura: 72/72 expresa casos aprobados, no cobertura del 100%.

| Archivo | Casos aprobados | Comportamiento / utilidad | Relación con requisitos |
| --- | ---: | --- | --- |
| `src/utils/validaciones.test.js` | 25 | Login, candidato, solicitud, evaluación y transiciones; protege reglas compartidas. | RF-01–RF-07, RN-01–RN-09 |
| `src/utils/dashboard.test.js` | 14 | Unión de datos, filtros, conteos, porcentaje de recomendados, promedio de días y carga por evaluador. | RF-08, RF-09 |
| `src/utils/formatters.test.js` | 7 | Fechas, días entre fechas y filtro de candidatos. | RF-08, RF-09 |
| `src/context/DataContext.test.js` | 7 | Agregar, reemplazar y limpiar sin modificar el estado anterior. | RNF-05 |
| `src/pages/Login.test.jsx` | 3 | Validación, credenciales incorrectas y redirección. | RF-01 |
| `src/components/solicitudes/CambioEtapa.test.jsx` | 4 | Bloqueo con motivo, avance con comentario y error del servidor. | RF-06 |
| `src/components/dashboard/TablaSolicitudes.test.jsx` | 2 | Sin resultados y enlaces al detalle. | RF-09, RF-12 |
| `server/api.test.js` | 10 | Login 400/401/token, protección sin token o con token falso, validación, permisos y 404. | RF-01, RF-07, RF-11 |
| **Total** | **72** | **8 archivos de pruebas.** | No equivale a cobertura completa de los RF. |

Se consideran tres tipos de pruebas: unitarias de funciones y reducer; pruebas de componentes con Testing Library y `user-event`; pruebas HTTP contra Express con Supertest. En las pruebas de backend la base de datos se reemplaza por una función simulada y no se requiere Supabase. Por ello, esas pruebas no acreditan conexión, esquema, persistencia ni integridad en la base real.

Las pruebas se ejecutan con `npm test`; `npm run coverage` genera el reporte de cobertura. Para la entrega se debe conservar la fecha, el commit y la salida de ejecución, junto con la cobertura si se utiliza. Estas pruebas no requieren reinicializar la base de datos.

### 10.3 Revisión manual del flujo

Se realizó un recorrido manual con datos ficticios en la aplicación local. El resultado comunicado durante la revisión fue satisfactorio para el registro de candidato, creación de solicitud, asignación de evaluador y fecha, cambio de etapas, registro de evaluación y cierre en Informe enviado.

**Estado: resultado manual reportado (R).** Esta revisión complementa las 72/72 pruebas automatizadas. No sustituye una comprobación exhaustiva de todos los permisos, filtros, indicadores o restricciones de la base de datos. No se adjuntó evidencia individual de cada paso ni una comprobación independiente de la persistencia después de recargar.

**Observación detectada:** fue posible pasar de Entrevista agendada a Entrevista realizada con una fecha de entrevista futura (30/07/2041). La regla actual permite esa transición sin comprobar si la fecha ya llegó. Queda pendiente definir con el equipo si debe bloquearse ese cambio y, si se acuerda, implementar la validación y sus pruebas.

El paso a Entrevista realizada confirma manualmente que la entrevista ocurrió; el formulario de evaluación se completa después, con un usuario de rol evaluador. No se exige una evaluación previa para alcanzar esa etapa.

## 11. Correspondencia con la problemática

| Necesidad del caso | Respuesta documentada | Requisitos |
| --- | --- | --- |
| Solicitudes dispersas en Forms y Excel | Formulario público y registro central de candidatos/solicitudes. | RF-02–RF-04 |
| Movimiento manual y seguimiento fragmentado en Planner | Etapas, asignación e historial consultables. | RF-05, RF-06, RF-10, RF-13 |
| Resultados sin una vista integrada | Registro de evaluación vinculado a solicitud y candidato. | RF-02, RF-03, RF-07 |
| Indicadores en otra herramienta | Panel con filtros y cálculos del proceso. | RF-08, RF-09 |
| Diferentes responsabilidades | Sesión y autorización por rol. | RF-01, RF-11 |

## 12. Pendientes y revisión de aceptación

| Tipo | Acción | Estado |
| --- | --- | --- |
| Desarrollo futuro declarado | Implementar apoyo con IA con decisión humana final. | P, entrega 2/2 |
| Mejora futura declarada | Ajustar diseño y ampliar pruebas según retroalimentación. | P |
| Verificación funcional | Recorrido candidato → solicitud → asignación → entrevista → evaluación → cierre revisado con datos ficticios y resultado satisfactorio comunicado. La comprobación exhaustiva de bloqueos y filtros permanece pendiente. | Flujo R; comprobaciones específicas V. |
| Validación de fecha de entrevista | Definir si se debe impedir marcar como realizada una entrevista con fecha futura; implementar y probar la regla si se aprueba. | Decisión y ajuste pendientes. |
| Verificación técnica | Suite ejecutada el 31/10/2026: 72/72 pruebas aprobadas, con evidencia guardada. Comprobar integración y persistencia de forma no destructiva en el entorno adecuado. | Suite VP; integración y persistencia V. |
| Precisión de requisitos | Confirmar permisos por operación, retrocesos desde cierre, validaciones exactas, filtros y fórmulas de indicadores. | V |
| Precisión documental | Resolver la ruta de creación de candidatos y confirmar qué operación representa el formulario público y el hito Informe enviado. | V |
| Aceptación académica | Revisar el ERS con el equipo y preparar la demostración de los contenidos de Clases 1–9 exigidos en la evaluación. | V |

### 12.1 Mantenimiento del ERS

El ERS debe actualizarse cuando se acuerden cambios en las funciones, los permisos, las reglas del proceso o las restricciones del producto. Cada cambio debe mantener la relación entre el requisito, su criterio de aceptación y las pruebas correspondientes.

**Estado de revisión:** especificación general del proyecto preparada para revisión del equipo. Se verificaron 72/72 pruebas automatizadas el 31/10/2026 y se guardó la evidencia de ejecución. El recorrido manual del flujo principal tuvo un resultado satisfactorio reportado. Permanecen pendientes las comprobaciones específicas de persistencia en Supabase y el tratamiento de entrevistas con fecha futura. Los resultados automatizados corresponden únicamente a los escenarios cubiertos por la suite.
