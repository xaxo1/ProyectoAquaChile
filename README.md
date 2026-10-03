# MVP Evaluación Psicolaboral | AquaChile

Aplicación web para gestionar candidatos, solicitudes y evaluaciones psicolaborales del área de Reclutamiento y Selección de AquaChile. Proyecto VcM de la asignatura DSY1104 Desarrollo Full Stack II, Duoc UC.

> Etapa actual: **frontend con datos simulados** (todos los datos son ficticios).

## Tecnologías

- React 18 + Vite
- React Router 6
- Bootstrap 5 + Bootstrap Icons

## Cómo ejecutarlo

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev
```

Abre la dirección que muestra la terminal (normalmente http://localhost:5173).

## Estructura

```
src/
├── App.jsx                  Rutas de la aplicación
├── main.jsx                 Punto de entrada
├── context/DataContext.jsx  Estado global y acciones (único acceso a los datos)
├── data/mockData.js         Datos simulados y catálogos (etapas, familias, etc.)
├── utils/
│   ├── validaciones.js      Reglas de validación de formularios
│   ├── formatters.js        Fechas, ids y nombres
│   └── dashboard.js         Cálculos del panel
├── components/
│   ├── layout/              Navbar y Layout
│   ├── common/              Componentes compartidos (badges, encabezados)
│   ├── dashboard/           Componentes del panel        (Integrante 1)
│   ├── candidatos/          Componentes de candidatos    (Integrante 2)
│   └── solicitudes/         Componentes de solicitudes   (Integrante 3)
├── pages/
│   ├── Dashboard.jsx                                     (Integrante 1)
│   ├── candidatos/                                       (Integrante 2)
│   └── solicitudes/                                      (Integrante 3)
└── styles/global.css
```

## Reglas del equipo

- Los datos se leen y modifican **solo** con el hook `useData()`.
- Los archivos compartidos (`context/`, `data/`, `utils/`, `App.jsx`, `components/common`, `components/layout`, `styles/global.css`) solo se cambian avisando al equipo.
- Cada integrante trabaja en su rama y abre un Pull Request hacia `main`.

## Documentación

- `docs/AVANCE.md`: resumen del avance, modelo de datos y decisiones técnicas.
