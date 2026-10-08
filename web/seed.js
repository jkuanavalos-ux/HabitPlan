/* Datos iniciales editables; fechas originales del plan. */
window.HabitSeed = {
  "version": 1,
  "habits": [
    {
      "id": "meditar",
      "name": "Meditar",
      "emoji": "🧘",
      "enabled": true
    },
    {
      "id": "afirmaciones",
      "name": "Decir las afirmaciones (autosugestión)",
      "emoji": "👄",
      "enabled": true
    },
    {
      "id": "visualizar-dinero",
      "name": "Verse en posesión del dinero y realizando las actividades",
      "emoji": "💰",
      "enabled": true
    },
    {
      "id": "yo-ideal",
      "name": "Imaginarme a mi yo ideal",
      "emoji": "🙋",
      "enabled": true
    },
    {
      "id": "videos-desarrollo",
      "name": "Ver videos de desarrollo personal",
      "emoji": "📺",
      "enabled": true
    },
    {
      "id": "plan-dia",
      "name": "Plan del día (3 prioridades, 5 min)",
      "emoji": "📝",
      "enabled": false
    },
    {
      "id": "cierre-dia",
      "name": "Cierre del día en el diario (2 líneas: qué hice y qué aprendí)",
      "emoji": "🌙",
      "enabled": false
    },
    {
      "id": "agua",
      "name": "Tomar agua",
      "emoji": "💧",
      "enabled": false
    },
    {
      "id": "dormir",
      "name": "Dormir a hora fija",
      "emoji": "😴",
      "enabled": false
    }
  ],
  "goals": [
    {
      "id": "ganar-30m",
      "title": "Ganar 30.000.000 Gs",
      "category": "trabajo",
      "dueDate": "2027-03-01",
      "targetAmount": 30000000,
      "progress": 0,
      "done": false,
      "notes": `VENDER SISTEMAS Y WEBS A MEDIDA a organizaciones y personas. 
      landings, webs/catálogos, sistema + Mantenimiento mensual - Primera venta ideal: 8/nov/2026.
      
      Estudiar ruta de desarrollador:
      - Estudiar Ing de software bases para crear sistemas
      - HTML + CSS + JavaScript “puro” y luego React.
      - Frameworks/librerías: React, Vue, Angular, Svelte 
      - TypeScript, Tailwind CSS, Next.js (React plus)
      - JavaScript/Node.js (Express, NestJS)
      - Python (Django, FastAPI, Flask): excelente para empezar y para IA/datos
      - Java (Spring Boot): muy usado en bancos y empresas grandes
      - Otros: PHP (Laravel), C# (.NET), Go
      -  Relacionales (SQL): PostgreSQL, MySQL, SQLite
      - No relacionales: MongoDB, Firebase/Firestore
      - Git hub / Apis Rest
      - App movil> React native + expo 
      - Flutter (dart)
      - Nativo android (kotlin o java)
      - Nativo ios (swift)
`
    },
    {
      "id": "novia",
      "title": "Conseguir novia",
      "category": "social",
      "dueDate": "2026-10-25",
      "targetAmount": 0,
      "progress": 0,
      "done": false,
      "notes": `Conversar para conocer gente de verdad
      
      PRINCIPAL: Leer mis páginas del libro (terminarlo el 20/oct)

      • Semana 1 (6 al 11/oct): saludar, preguntar algo a desconocidos y hacer charlas cortas.
      • Semana 2 (12 al 18/oct): charlas más largas, cumplidos sinceros y una actividad social.
      • Semana 3 (19 al 25/oct): invitar a alguien a un plan, pedir contacto, cita.

    Ver un video de sociabilidad, hamza, 3 veces a la semana (lunes, miércoles y viernes)
    
    `
    },
    {
      "id": "idiomas",
      "title": "Aprender idiomas",
      "category": "estudio",
      "dueDate": "",
      "targetAmount": 0,
      "progress": 0,
      "done": false,
      "notes": `PRACTICAR 3 VECES POR SEMANAS O MAS`
    },
    {
      "id": "musica",
      "title": "Música: cantar y guitarra",
      "category": "musica",
      "dueDate": "",
      "targetAmount": 0,
      "progress": 0,
      "done": false,
      "notes": `Practicar canto y vocalización (lunes, miércoles y viernes)
        Practicar guitarra (martes, jueves, sábado y domingo)
        Aprender 3 a 5 canciones por semana (20 canciones hasta el 6/nov)
        Aprender 2 a x solos por semana
        Avanzar con el curso de guitarra
        Grabarme cantando una vez por semana`
    },
    {
      "id": "facultad",
      "title": "Pasar las materias de la facultad",
      "category": "estudio",
      "dueDate": "2026-11-20",
      "targetAmount": 0,
      "progress": 0,
      "done": false,
      "notes": `Estudiar todos los dias BD2 y IS2 y pasar antes del 20/nov.
      • Semana 1 y 2: 2h al dia
      • Semana 3 a 6: 3h a 4h al dia (e ir inteficando)`
    }
  ],
  "schedule": [
    {
      "id": "schedule-1",
      "days": [
        "mon",
        "tue",
        "wed",
        "thu",
        "fri"
      ],
      "start": "06:00",
      "end": "08:00",
      "title": "Meditar, leer, personal",
      "color": "#00B0F0",
      "suggested": false
    },
    {
      "id": "schedule-2",
      "days": [
        "sat",
        "sun"
      ],
      "start": "06:00",
      "end": "07:00",
      "title": "Libre",
      "color": "#BFBFBF",
      "suggested": false
    },
    {
      "id": "schedule-3",
      "days": [
        "sat",
        "sun"
      ],
      "start": "07:00",
      "end": "09:00",
      "title": "Meditar, leer, personal",
      "color": "#00B0F0",
      "suggested": false
    },
    {
      "id": "schedule-4",
      "days": [
        "mon",
        "tue",
        "wed",
        "thu",
        "fri"
      ],
      "start": "08:00",
      "end": "10:00",
      "title": "Desarrollo",
      "color": "#ED7D31",
      "suggested": false
    },
    {
      "id": "schedule-5",
      "days": [
        "mon",
        "tue",
        "wed",
        "thu",
        "fri"
      ],
      "start": "10:00",
      "end": "12:00",
      "title": "Ventas y prospección",
      "color": "#C55A11",
      "suggested": true
    },
    {
      "id": "schedule-6",
      "days": [
        "mon",
        "tue",
        "wed",
        "thu",
        "fri"
      ],
      "start": "12:00",
      "end": "13:00",
      "title": "Libre / almuerzo",
      "color": "#3A3F5C",
      "suggested": true
    },
    {
      "id": "schedule-7",
      "days": [
        "sat",
        "sun"
      ],
      "start": "09:00",
      "end": "11:00",
      "title": "Desarrollo",
      "color": "#ED7D31",
      "suggested": false
    },
    {
      "id": "schedule-8",
      "days": [
        "sat",
        "sun"
      ],
      "start": "11:00",
      "end": "13:00",
      "title": "Libre",
      "color": "#3A3F5C",
      "suggested": false
    },
    {
      "id": "schedule-9",
      "days": [
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
        "sun"
      ],
      "start": "13:00",
      "end": "16:00",
      "title": "Estudios facu",
      "color": "#FFD966",
      "suggested": false
    },
    {
      "id": "schedule-10",
      "days": [
        "mon",
        "wed",
        "fri",
        "sat",
        "sun"
      ],
      "start": "16:00",
      "end": "18:00",
      "title": "Idiomas",
      "color": "#548235",
      "suggested": false
    },
    {
      "id": "schedule-11",
      "days": [
        "tue",
        "thu"
      ],
      "start": "16:00",
      "end": "18:00",
      "title": "Social / networking (flex)",
      "color": "#7A5BD6",
      "suggested": true
    },
    {
      "id": "schedule-12",
      "days": [
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
        "sun"
      ],
      "start": "18:00",
      "end": "20:00",
      "title": "Ejercicios",
      "color": "#212934",
      "suggested": false
    },
    {
      "id": "schedule-13",
      "days": [
        "mon",
        "wed",
        "fri"
      ],
      "start": "20:00",
      "end": "23:00",
      "title": "Vocalización y cantar",
      "color": "#2F5597",
      "suggested": false
    },
    {
      "id": "schedule-14",
      "days": [
        "tue",
        "thu",
        "sat",
        "sun"
      ],
      "start": "20:00",
      "end": "23:00",
      "title": "Guitarra",
      "color": "#2F5597",
      "suggested": false
    }
  ],
  "logs": {}
};
