# Rincón Fit — rutinas, dieta y evolución personalizadas

Sitio de una sola página (`index.html`) para gestionar tu entrenamiento de
gimnasio de forma personal: rutina según tu objetivo, dieta orientativa y
seguimiento de tu evolución (peso, IMC y perímetros) a lo largo del tiempo.

Sin build step: es HTML/CSS/JS puro + Supabase JS por CDN, así que se puede
abrir tal cual o subir a cualquier hosting estático (GitHub Pages, Netlify,
Vercel...).

## Qué incluye

- **Cuenta propia** (email + contraseña vía Supabase Auth): cada persona
  entra con su cuenta y solo ve sus propios datos.
- **Cuestionario inicial**: sexo, fecha de nacimiento, altura, peso, nivel
  de actividad, objetivo (pérdida de peso / definición / aumento de masa) y
  días de entrenamiento por semana.
- **Rutina generada** a partir de un catálogo de ejercicios con su máquina/
  equipo, grupo muscular e instrucciones, repartida en un split semanal
  según los días disponibles, con series/repeticiones/descanso ajustados al
  objetivo. Se puede regenerar para tener variedad.
- **Dieta orientativa**: calorías y macros calculados con la fórmula de
  Mifflin-St Jeor (específica por sexo), ajustados al objetivo (déficit,
  déficit ligero o superávit), con reparto sugerido por comidas.
- **Evolución guardada**: cada medición (peso, cintura, pecho, brazo,
  pierna) queda registrada con fecha, con gráficos de evolución de peso,
  cintura e IMC, y categorías (IMC, riesgo por perímetro de cintura) que
  usan los umbrales específicos por sexo.
- Todo el contenido es privado por usuario mediante Row Level Security: solo
  tú puedes ver y editar tus propios datos.

## Proyecto Supabase

- **Project ref:** `ztsdkfwnqrlmsirfvoat`
- **Dashboard:** https://supabase.com/dashboard/project/ztsdkfwnqrlmsirfvoat
- La clave `anon` está incrustada en `assets/gym-app.js` — es pública por
  diseño (así funciona cualquier app Supabase) y está protegida por Row
  Level Security.

Este proyecto Supabase también aloja las tablas de otros dos negocios
(la sala de eventos y "Lienzo Blanco"). Las tablas de esta app usan el
prefijo `gym_` y sus políticas de RLS restringen cada fila al usuario
propietario (`auth.uid()`), así que no hay forma de que un usuario vea datos
de otro usuario ni de las otras tablas.

### Tablas (prefijo `gym_`)

- `gym_profiles` — un perfil por usuario: sexo, altura, fecha de
  nacimiento, nivel de actividad, objetivo y días de entrenamiento.
- `gym_measurements` — histórico de mediciones (peso y perímetros) por
  usuario y fecha, una fila por día.
- `gym_exercises` — catálogo de ejercicios/máquinas (lectura pública,
  gestionado solo desde el dashboard/SQL, no editable desde el navegador).

Para añadir o editar ejercicios del catálogo: dashboard → SQL Editor,
`insert`/`update` sobre `gym_exercises`.

Habilita **Authentication → Providers → Email** en el dashboard de Supabase
si no está ya activo, para que el registro con email/contraseña funcione.
Si tu proyecto tiene activada la confirmación por email, el usuario deberá
confirmar su correo antes de poder iniciar sesión.

## Cómo lo pruebas en local

Solo hace falta un servidor estático simple (los módulos ES no funcionan con `file://`):

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```
