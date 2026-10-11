# RE-FRAME · Sitio de validación (MVP «puerta falsa»)

Proyecto académico · Grupo 7 · Taller Práctico Profesional I (ICA3902) · Universidad de O'Higgins.
Sitio estático (HTML + CSS + JS), sin compilación ni dependencias. Foco: fabricantes/talleres que fabrican y cortan perfiles de PVC en la Región de O'Higgins.

> RE-FRAME NO es un servicio de retiro garantizado ni una recicladora operativa. El formulario mide **interés y contacto**, no disposición a pagar.

## Archivos
`index.html` · `styles.css` · `script.js` · `gracias.html` · `assets/` · `README.md`
Al extraer el ZIP, `index.html` se ve correctamente sin servidor (el diseño carga con rutas relativas). El **envío del formulario solo funciona publicado en Netlify**.

## Imágenes y procedencia
- `assets/hero.jpg`, `assets/despuntes.jpg`, `assets/perfil.jpg` son recortes (con retoque para quitar texto) de la **imagen de referencia aportada por el equipo** (perfil de PVC y despuntes en un taller). Parece una imagen generada/ilustrativa: **no es evidencia del proyecto ni de instalaciones reales**, y el sitio la rotula como «imagen referencial».
- **Pendiente:** confirmar el origen y la licencia de esa imagen antes de publicar con pauta. Procedencia: `PENDIENTE`. Para usar fotos con licencia clara (propias, Unsplash/Pexels, etc.), reemplazar los tres archivos conservando nombre y proporción aproximada (hero ≈ 860×630, despuntes ≈ 662×272, perfil ≈ 434×588) y anotar autor y licencia aquí.
- `assets/favicon.svg`: propio. Íconos SVG: propios. Tipografías Manrope e Inter (Google Fonts, con respaldo del sistema).
- Inspiración visual general: sector industrial/corporativo (p. ej. deceuninck.cl); no se copia marca, texto ni imágenes, y no es aliado.
- La página pública ya **no** incluye hipótesis, indicadores ni resultados de entrevistas; eso va en la bitácora (sección 7 de este README).

## 1. Publicar en GitHub + Netlify
1. Crear repositorio (p. ej. `reframe-web`) y subir los archivos a la raíz. **No subir datos de formularios.**
2. Netlify → *Add new project → Import from Git*. Build command: vacío. Publish directory: `.`
3. Tras el deploy, abrir la URL pública sin iniciar sesión y confirmar que carga.
4. Netlify → *Forms*: debe aparecer `solicitudes-reframe`. Si no aparece, verificar *Forms → Enable form detection* y volver a desplegar.

## 2. Aviso por correo de nuevos envíos
Netlify → *Project configuration → Notifications → Emails and webhooks → Add notification → Email notification*
- Evento: **New form submission** · Formulario: `solicitudes-reframe` · Correo: el del equipo.
- Prueba: enviar el formulario desde la URL publicada, confirmar que el registro aparece en *Forms → Submissions* y que llega el correo. Guardar capturas de ambos.
- Marcar los envíos de prueba (p. ej. nombre «PRUEBA») para no confundirlos con leads reales.

## 3. Registro automático en Google Sheets — **PASO PENDIENTE**
Exportar CSV desde Netlify es manual y **no** equivale a una captura automática. Opciones (ninguna está activada; no afirmar que funciona hasta probarla):
- **Webhook + Make/Zapier:** Netlify → *Notifications → Outgoing webhook* (evento *New form submission*) hacia un webhook de Make/Zapier que agregue una fila a la hoja.
- **Apps Script:** publicar un script web que reciba el POST y haga `appendRow`; apuntar el webhook de Netlify a su URL.
- **Alternativa:** Google Forms + Sheets (reemplaza el formulario de Netlify).
Estado: `PENDIENTE DE PROBAR` · Captura de la fila recibida: `PENDIENTE`.

## 4. Google Analytics 4
La etiqueta `G-PRWCV5HMJY` está en el `<head>` de `index.html` y `gracias.html`; `script.js` solo envía eventos. Falta **verificar** en GA4 (Informes → Tiempo real, o DebugView) que lleguen los datos.
- `page_view`: automático en ambas páginas.
- `cta_click`: botones «Solicitar evaluación de retiro» (menú, hero). Parámetro `cta_location`. Los enlaces de navegación no cuentan.
- `form_submit_success` y `generate_lead`: solo en `gracias.html`, tras un envío confirmado por Netlify, con token de un solo uso (recargar no repite el evento). La fuente de verdad de los leads es Netlify Forms / Sheet.
- En GA4 → Administrar → Eventos, marca `form_submit_success` (o `generate_lead`) como evento clave cuando aparezca.
- CTR = clics `cta_click` ÷ visitas × 100 · Tasa de registro = formularios válidos ÷ visitas × 100.

## 5. UTMs por canal
Base: `https://TU-SITIO.netlify.app/`
- WhatsApp: `?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=reframe_mvp`
- Correo: `?utm_source=correo&utm_medium=email&utm_campaign=reframe_mvp`
- LinkedIn: `?utm_source=linkedin&utm_medium=social&utm_campaign=reframe_mvp`
Opcional: `utm_content=` para variantes. Los UTMs se guardan en la sesión y viajan en campos ocultos del formulario (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`); sin UTM se registra `directo`.

## 6. Formulario
`name="solicitudes-reframe"`, `data-netlify="true"`, campo oculto `form-name`, honeypot `bot-field`. Campos: nombre, empresa/taller, comuna, correo y/o teléfono (se exige al menos un canal válido), rango aproximado de despuntes, consentimiento y 4 UTMs. El envío se hace por `fetch` y solo si Netlify responde OK se redirige a `/gracias.html` (sin `alert()` ni `localStorage` como almacenamiento de datos). Sin JavaScript, el formulario sigue enviando de forma nativa a `/gracias.html`, pero no se contabiliza `generate_lead`.

## 7. Hipótesis del experimento (el equipo debe aprobarla)
«En 7 días, al menos 10% de las visitas calificadas de fabricantes de ventanas PVC de O'Higgins enviará una solicitud de evaluación.»
Es un **umbral elegido** para decidir, no una tasa validada. Contexto previo: 3 hipótesis (dolor relevante, alternativas insuficientes, viabilidad económica); solo 2 entrevistas exploratorias; la viabilidad económica sigue **pendiente**.

## 8. Checklist de evidencias (cuarta nota) — completar solo con datos reales
- [ ] URL pública sin login: `PENDIENTE`
- [ ] Captura hero + propuesta de valor + CTA único: `PENDIENTE`
- [ ] Descripción del experimento MVP (humo / fake door) en bitácora: `PENDIENTE`
- [ ] Hipótesis falsable aprobada por el equipo + segmento + umbral numérico: `PENDIENTE`
- [ ] Netlify Forms configurado, captura del panel *Forms*: `PENDIENTE`
- [ ] Aviso por correo activado, captura del correo recibido: `PENDIENTE`
- [ ] Integración a Sheets probada, captura de la fila: `PENDIENTE`
- [ ] GA4 conectado, captura de Realtime/DebugView con `page_view`, `cta_click`, `generate_lead`: `PENDIENTE`
- [ ] UTMs probados por canal (whatsapp / correo / linkedin): `PENDIENTE`
- [ ] Prueba extremo a extremo (envío → panel → correo → hoja → GA4), con fecha: `PENDIENTE`
- [ ] Fecha/hora de lanzamiento real y canales usados: `PENDIENTE`
- [ ] Monitoreo diario (visitas, clics CTA, envíos), una fila por día: `PENDIENTE`
- [ ] Mínimo 5 visitas **reales** de personas externas al equipo: `0 / 5`
- [ ] Análisis final: ¿se cumplió el umbral? ¿qué se decide?: `PENDIENTE`

Nunca crear visitas, registros ni capturas falsas. Distinguir siempre registros de prueba de leads reales.

## 9. Contenido y reglas de honestidad
No hay clientes, alianzas, certificaciones, testimonios, precios ni cifras de mercado inventados. Las cifras del caso piloto (merma y kg/semana) **no** se publican en el sitio. Los rangos del formulario son opciones de respuesta, no datos del mercado.
