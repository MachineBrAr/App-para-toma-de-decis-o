# ⚖️ The Tiebreaker — App para toma de decisiones

Aplicación web que ayuda a definir los **pros y contras** de cada decisión importante. Describes tu dilema, indicas las opciones que estás considerando y la app, apoyada en la API de **Google Gemini**, genera un análisis estructurado y un veredicto claro para ayudarte a "desempatar".

> ⚠️ **Estado del proyecto:** prototipo / prueba de concepto. Las pruebas continúan y puede haber cambios.

---

## ✨ Funcionalidades

Para cada decisión, la app genera:

1. **Resumen ejecutivo** del dilema en 2–3 frases.
2. **Pros y contras ponderados** por opción, con peso de impacto (1–5), categoría temática, explicación y sugerencia de mitigación para los contras.
3. **Matriz comparativa multicriterio** con notas de 1 a 10 y una justificación breve por criterio (por ejemplo: retorno a largo plazo, estrés/bienestar, reversibilidad, alineación con valores personales, velocidad de ejecución).
4. **Análisis SWOT (FODA)** — fortalezas, debilidades, oportunidades y amenazas — para cada opción.
5. **Veredicto del Tiebreaker**:
   - Opción recomendada y nivel de confianza.
   - El factor decisivo ("The Clincher").
   - Pregunta de intuición (*gut check*).
   - Puntos ciegos y sesgos cognitivos.
   - Plan de acción inmediato en 3 pasos, con plazos.

Además:

- **Sugerencia de opciones:** si no sabes qué alternativas considerar, la app propone 2–3 caminos concretos a partir del título de tu dilema.
- **Preguntas de seguimiento:** puedes consultar dudas adicionales al Tiebreaker una vez emitido el veredicto.
- **Opciones vagas:** si una opción expresa duda o inercia (ej. "no sé", "dejar pasar"), la IA está instruida para cuestionarla y mostrar el costo oculto de no decidir.
- **Multilenguaje:** análisis en portugués (`pt`, por defecto) e inglés (`en`).
- **Modo de respaldo (fallback):** si el servicio de IA está ocupado, limitado o falla, el servidor devuelve un análisis estratégico genérico generado localmente (marcado con `isFallback: true`), para que la app siga funcionando.

---

## 🧰 Tecnologías

| Área | Herramientas |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, Motion (animaciones), Lucide React (íconos), canvas-confetti |
| Backend | Node.js + Express, ejecutado con `tsx` |
| IA | Google Gemini mediante el SDK `@google/genai` |
| Lenguaje | TypeScript |
| Gestor de paquetes | Bun (`bun.lock`); también funciona con npm |

---

## 📁 Estructura del repositorio

```
.
├── src/             # Código del frontend (React)
├── server.ts        # Servidor Express: API + integración con Gemini + Vite
├── index.html       # Punto de entrada HTML de la app
├── vite.config.ts   # Configuración de Vite
├── tsconfig.json    # Configuración de TypeScript
├── package.json     # Dependencias y scripts
├── bun.lock         # Lockfile de Bun
├── metadata.json    # Metadatos de la aplicación
├── .env.example     # Plantilla de variables de entorno
└── .gitignore
```

---

## 🚀 Instalación y uso local

### Requisitos

- [Bun](https://bun.sh) o [Node.js](https://nodejs.org) (v18 o superior recomendado)
- Una API key de Gemini ([Google AI Studio](https://aistudio.google.com/apikey))

### Pasos

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/MachineBrAr/App-para-toma-de-decis-o.git
   cd App-para-toma-de-decis-o
   ```

2. **Instala las dependencias**

   ```bash
   bun install
   # o
   npm install
   ```

3. **Configura las variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Edita `.env` y completa tus valores:

   ```env
   GEMINI_API_KEY="tu_api_key_de_gemini"
   APP_URL="http://localhost:3000"
   ```

4. **Inicia el servidor de desarrollo**

   ```bash
   bun run dev
   # o
   npm run dev
   ```

   La app queda disponible en **http://localhost:3000** (puedes cambiar el puerto con la variable `PORT`).

> Sin `GEMINI_API_KEY` el servidor arranca igualmente, pero los endpoints de análisis responderán con error o con contenido de respaldo.

---

## 🔐 Variables de entorno

| Variable | Descripción | Obligatoria |
| --- | --- | --- |
| `GEMINI_API_KEY` | Clave de la API de Gemini para el análisis con IA | Sí |
| `APP_URL` | URL donde se aloja la app (enlaces propios, callbacks) | No (local) |
| `PORT` | Puerto del servidor (por defecto `3000`) | No |
| `DISABLE_HMR` | Si vale `true`, desactiva el hot reload de Vite en desarrollo | No |

⚠️ **Nunca subas tu archivo `.env` al repositorio.** La clave se usa solo en el servidor y no se expone al navegador.

---

## 📜 Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `dev` | Inicia el servidor con Vite en modo desarrollo |
| `build` | Genera el build de producción en `dist/` |
| `start` | Inicia el servidor en modo producción (sirve `dist/`) |
| `preview` | Previsualiza el build con Vite |
| `lint` | Verifica los tipos con TypeScript (`tsc --noEmit`) |
| `clean` | Elimina `dist` y `server.js` |

Para producción:

```bash
bun run build
bun run start
```

---

## 🔌 API

Todos los endpoints son `POST` con cuerpo JSON, salvo el *health check*.

### `GET /api/health`
Verifica que el servidor esté activo e indica si hay API key configurada.

```json
{ "status": "ok", "hasApiKey": true }
```

### `POST /api/analyze-decision`
Genera el análisis completo de una decisión.

```json
{
  "title": "¿Cambiar de trabajo o quedarme donde estoy?",
  "context": "Contexto adicional (opcional)",
  "options": ["Cambiar de trabajo", "Quedarme"],
  "priorities": ["Estabilidad", "Crecimiento"],
  "language": "pt"
}
```

- `title` es obligatorio.
- Si se envían menos de 2 opciones válidas, se usan dos opciones por defecto ("seguir adelante" / "mantener el status quo").
- Respuesta: `summary`, `optionsAnalysis`, `comparisonMatrix` y `verdict`.

### `POST /api/suggest-options`
Sugiere 2–3 opciones concretas a partir del título del dilema.

```json
{ "title": "¿Debo mudarme de ciudad?", "context": "", "language": "pt" }
```

Respuesta: `{ "options": ["...", "..."] }`

### `POST /api/ask-tiebreaker`
Responde una pregunta de seguimiento sobre la decisión y su veredicto.

```json
{
  "decisionTitle": "...",
  "currentVerdict": "...",
  "question": "¿Y si el salario baja un 10%?",
  "language": "pt"
}
```

Respuesta: `{ "answer": "..." }`

---

## ⚠️ Aviso

Las recomendaciones generadas por IA son una **ayuda para reflexionar**, no un sustituto del criterio propio ni de asesoramiento profesional (financiero, legal, médico, etc.). La decisión final siempre es tuya.

---

## 📄 Licencia

Este proyecto es de **dominio público**. Cualquier persona puede copiarlo, modificarlo, distribuirlo y usarlo, con fines personales o comerciales, sin necesidad de pedir permiso ni dar atribución.

Se distribuye "tal cual", sin garantía de ningún tipo.

## 👤 Autor

Desarrollado por [MachineBrAr](https://github.com/MachineBrAr).
