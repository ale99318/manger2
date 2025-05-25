const clubes = [ 
  // PERÚ
  {
    id: "51-1",
    nombre: "Alianza Lima",
    presupuesto: 12000000,
    clasico: "51-2",
    estadio: "Estadio Alejandro Villanueva",
    ciudad: "Lima",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Alianza_Lima_logo.svg/800px-Alianza_Lima_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Estadio_Alejandro_Villanueva.jpg/1200px-Estadio_Alejandro_Villanueva.jpg"
  },
  {
    id: "51-2",
    nombre: "Universitario",
    presupuesto: 11000000,
    clasico: "51-1",
    estadio: "Estadio Monumental",
    ciudad: "Lima",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Universitario_de_Deportes_logo.svg/800px-Universitario_de_Deportes_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Estadio_Monumental_U.jpg/1200px-Estadio_Monumental_U.jpg"
  },
  {
    id: "51-3",
    nombre: "Sporting Cristal",
    presupuesto: 9500000,
    clasico: "51-1",
    estadio: "Estadio Alberto Gallardo",
    ciudad: "Lima",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Sporting_Cristal_logo.svg/800px-Sporting_Cristal_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Estadio_Alberto_Gallardo.jpg/1200px-Estadio_Alberto_Gallardo.jpg"
  },
  {
    id: "51-4",
    nombre: "Melgar",
    presupuesto: 8000000,
    clasico: "51-5",
    estadio: "Estadio Monumental de la UNSA",
    ciudad: "Arequipa",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/FBC_Melgar_logo.svg/800px-FBC_Melgar_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Estadio_Monumental_UNSA.jpg/1200px-Estadio_Monumental_UNSA.jpg"
  },
  {
    id: "51-5",
    nombre: "Cienciano",
    presupuesto: 7500000,
    clasico: "51-4",
    estadio: "Estadio Inca Garcilaso de la Vega",
    ciudad: "Cusco",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Club_Cienciano_logo.svg/800px-Club_Cienciano_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Estadio_Garcilaso_Cusco.jpg/1200px-Estadio_Garcilaso_Cusco.jpg"
  },
  {
    id: "51-6",
    nombre: "Cusco FC",
    presupuesto: 5000000,
    clasico: "Ninguno",
    estadio: "Estadio Inca Garcilaso de la Vega",
    ciudad: "Cusco",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Cusco_FC_logo.svg/800px-Cusco_FC_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Estadio_Garcilaso_Cusco.jpg/1200px-Estadio_Garcilaso_Cusco.jpg"
  },
  {
    id: "51-7",
    nombre: "ADT",
    presupuesto: 4000000,
    clasico: "Ninguno",
    estadio: "Estadio Unión Tarma",
    ciudad: "Tarma",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/ADT_Tarma_logo.svg/800px-ADT_Tarma_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Estadio_Union_Tarma.jpg/1200px-Estadio_Union_Tarma.jpg"
  },
  {
    id: "51-8",
    nombre: "Sport Boys",
    presupuesto: 4200000,
    clasico: "51-9",
    estadio: "Estadio Miguel Grau",
    ciudad: "Callao",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Sport_Boys_logo.svg/800px-Sport_Boys_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Estadio_Miguel_Grau_Callao.jpg/1200px-Estadio_Miguel_Grau_Callao.jpg"
  },
  {
    id: "51-9",
    nombre: "Deportivo Binacional Fútbol Club",
    presupuesto: 4500000,
    clasico: "51-8",
    estadio: "Guillermo Briceño Rosamedina",
    ciudad: "Juliaca",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Deportivo_Binacional_logo.svg/800px-Deportivo_Binacional_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Estadio_Guillermo_Briceno_Rosamedina.jpg/1200px-Estadio_Guillermo_Briceno_Rosamedina.jpg"
  },
  {
    id: "51-10",
    nombre: "UTC",
    presupuesto: 3500000,
    clasico: "Ninguno",
    estadio: "Estadio Héroes de San Ramón",
    ciudad: "Cajamarca",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/UTC_Cajamarca_logo.svg/800px-UTC_Cajamarca_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Estadio_Heroes_San_Ramon.jpg/1200px-Estadio_Heroes_San_Ramon.jpg"
  },
  {
    id: "51-11",
    nombre: "Carlos A. Mannucci",
    presupuesto: 4300000,
    clasico: "César Vallejo",
    estadio: "Estadio Mansiche",
    ciudad: "Trujillo",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Carlos_Mannucci_logo.svg/800px-Carlos_Mannucci_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Estadio_Mansiche_Trujillo.jpg/1200px-Estadio_Mansiche_Trujillo.jpg"
  },
  {
    id: "51-12",
    nombre: "Club Deportivo Garcilaso",
    presupuesto: 4800000,
    clasico: "Cienciano",
    estadio: "Estadio Inca Garcilaso de la Vega",
    ciudad: "Cusco",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Real_Garcilaso_logo.svg/800px-Real_Garcilaso_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Estadio_Garcilaso_Cusco.jpg/1200px-Estadio_Garcilaso_Cusco.jpg"
  },
  {
    id: "51-13",
    nombre: "Sport Huancayo",
    presupuesto: 5000000,
    clasico: "Ninguno",
    estadio: "Estadio Huancayo",
    ciudad: "Huancayo",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Sport_Huancayo_logo.svg/800px-Sport_Huancayo_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Estadio_Huancayo.jpg/1200px-Estadio_Huancayo.jpg"
  },
  {
    id: "51-14",
    nombre: "Alianza Atlético",
    presupuesto: 3800000,
    clasico: "Atlético Grau",
    estadio: "Estadio Campeones del 36",
    ciudad: "Sullana",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Alianza_Atletico_logo.svg/800px-Alianza_Atletico_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Estadio_Campeones_del_36.jpg/1200px-Estadio_Campeones_del_36.jpg"
  },
  {
    id: "51-15",
    nombre: "Atlético Grau",
    presupuesto: 4600000,
    clasico: "Alianza Atlético",
    estadio: "Estadio Municipal de Bernal",
    ciudad: "Piura",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Atletico_Grau_logo.svg/800px-Atletico_Grau_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Estadio_Municipal_Bernal.jpg/1200px-Estadio_Municipal_Bernal.jpg"
  },
  {
    id: "51-16",
    nombre: "Juan Pablo II College",
    presupuesto: 3200000,
    clasico: "Ninguno",
    estadio: "Estadio Carlos Vidaurre García",
    ciudad: "Tarapoto",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Juan_Pablo_II_College_logo.svg/800px-Juan_Pablo_II_College_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Estadio_Carlos_Vidaurre_Garcia.jpg/1200px-Estadio_Carlos_Vidaurre_Garcia.jpg"
  },
  {
    id: "51-17",
    nombre: "Los Chankas",
    presupuesto: 3000000,
    clasico: "Ninguno",
    estadio: "Estadio Los Chankas",
    ciudad: "Andahuaylas",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Los_Chankas_logo.svg/800px-Los_Chankas_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Estadio_Los_Chankas.jpg/1200px-Estadio_Los_Chankas.jpg"
  },
  {
    id: "51-18",
    nombre: "Comerciantes Unidos",
    presupuesto: 3100000,
    clasico: "Ninguno",
    estadio: "Estadio Juan Maldonado Gamarra",
    ciudad: "Cutervo",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Comerciantes_Unidos_logo.svg/800px-Comerciantes_Unidos_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Estadio_Juan_Maldonado_Gamarra.jpg/1200px-Estadio_Juan_Maldonado_Gamarra.jpg"
  },

  // ARGENTINA
  {
    id: "54-1",
    nombre: "Aldosivi",
    presupuesto: 5000000,
    clasico: "AR-30",
    estadio: "José María Minella",
    ciudad: "Mar del Plata",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Club_Aldosivi_logo.svg/800px-Club_Aldosivi_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Estadio_Jose_Maria_Minella.jpg/1200px-Estadio_Jose_Maria_Minella.jpg"
  },
  {
    id: "54-2",
    nombre: "Argentinos Juniors",
    presupuesto: 7000000,
    clasico: "54-8",
    estadio: "Diego Armando Maradona",
    ciudad: "Buenos Aires",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Argentinos_Juniors_logo.svg/800px-Argentinos_Juniors_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Estadio_Diego_Armando_Maradona.jpg/1200px-Estadio_Diego_Armando_Maradona.jpg"
  },
  {
    id: "54-3",
    nombre: "Atlético Tucumán",
    presupuesto: 6000000,
    clasico: "54-22",
    estadio: "Monumental José Fierro",
    ciudad: "San Miguel de Tucumán",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Atl%C3%A9tico_Tucum%C3%A1n_logo.svg/800px-Atl%C3%A9tico_Tucum%C3%A1n_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Estadio_Monumental_Jose_Fierro.jpg/1200px-Estadio_Monumental_Jose_Fierro.jpg"
  },
  {
    id: "54-4",
    nombre: "Banfield",
    presupuesto: 6500000,
    clasico: "54-7",
    estadio: "Florencio Sola",
    ciudad: "Banfield",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Club_Atl%C3%A9tico_Banfield_logo.svg/800px-Club_Atl%C3%A9tico_Banfield_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Estadio_Florencio_Sola.jpg/1200px-Estadio_Florencio_Sola.jpg"
  },
  {
    id: "54-5",
    nombre: "Barracas Central",
    presupuesto: 4000000,
    clasico: "54-17",
    estadio: "Julio Humberto Grondona",
    ciudad: "Buenos Aires",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Barracas_Central_logo.svg/800px-Barracas_Central_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Estadio_Julio_Humberto_Grondona.jpg/1200px-Estadio_Julio_Humberto_Grondona.jpg"
  },
  {
    id: "54-6",
    nombre: "Belgrano",
    presupuesto: 7500000,
    clasico: "54-22",
    estadio: "Julio César Villagra",
    ciudad: "Córdoba",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Club_Belgrano_logo.svg/800px-Club_Belgrano_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Estadio_Julio_Cesar_Villagra.jpg/1200px-Estadio_Julio_Cesar_Villagra.jpg"
  },
  {
    id: "54-7",
    nombre: "Boca Juniors",
    presupuesto: 20000000,
    clasico: "54-2",
    estadio: "Alberto J. Armando",
    ciudad: "Buenos Aires",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Boca_Juniors_logo.svg/800px-Boca_Juniors_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/La_Bombonera.jpg/1200px-La_Bombonera.jpg"
  },
  {
    id: "54-8",
    nombre: "Central Córdoba (Santiago del Estero)",
    presupuesto: 5500000,
    clasico: "54-3",
    estadio: "Único Madre de Ciudades",
    ciudad: "Santiago del Estero",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Central_C%C3%B3rdoba_Santiago_del_Estero_logo.svg/800px-Central_C%C3%B3rdoba_Santiago_del_Estero_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Estadio_Unico_Madre_de_Ciudades.jpg/1200px-Estadio_Unico_Madre_de_Ciudades.jpg"
  },
  {
    id: "54-9",
    nombre: "Defensa y Justicia",
    presupuesto: 6000000,
    clasico: "54-5",
    estadio: "Norberto Tomaghello",
    ciudad: "Florencio Varela",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Defensa_y_Justicia_logo.svg/800px-Defensa_y_Justicia_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Estadio_Norberto_Tomaghello.jpg/1200px-Estadio_Norberto_Tomaghello.jpg"
  },
  {
    id: "54-10",
    nombre: "Deportivo Riestra",
    presupuesto: 3500000,
    clasico: "54-5",
    estadio: "Guillermo Laza",
    ciudad: "Buenos Aires",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Deportivo_Riestra_logo.svg/800px-Deportivo_Riestra_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Estadio_Guillermo_Laza.jpg/1200px-Estadio_Guillermo_Laza.jpg"
  },
  {
    id: "54-11",
    nombre: "Estudiantes de La Plata",
    presupuesto: 8000000,
    clasico: "54-6",
    estadio: "Jorge Luis Hirschi",
    ciudad: "La Plata",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Estudiantes_de_La_Plata_logo.svg/800px-Estudiantes_de_La_Plata_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Estadio_Jorge_Luis_Hirschi.jpg/1200px-Estadio_Jorge_Luis_Hirschi.jpg"
  },
  {
    id: "54-12",
    nombre: "Gimnasia y Esgrima La Plata",
    presupuesto: 7000000,
    clasico: "54-11",
    estadio: "Juan Carmelo Zerillo",
    ciudad: "La Plata",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Gimnasia_y_Esgrima_La_Plata_logo.svg/800px-Gimnasia_y_Esgrima_La_Plata_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Estadio_Juan_Carmelo_Zerillo.jpg/1200px-Estadio_Juan_Carmelo_Zerillo.jpg"
  },
  {
    id: "54-13",
    nombre: "Godoy Cruz",
    presupuesto: 6500000,
    clasico: "54-22",
    estadio: "Malvinas Argentinas",
    ciudad: "Godoy Cruz",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Godoy_Cruz_logo.svg/800px-Godoy_Cruz_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Estadio_Malvinas_Argentinas.jpg/1200px-Estadio_Malvinas_Argentinas.jpg"
  },
  {
    id: "54-14",
    nombre: "Huracán",
    presupuesto: 7000000,
    clasico: "54-7",
    estadio: "Tomás Adolfo Ducó",
    ciudad: "Buenos Aires",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hurac%C3%A1n_logo.svg/800px-Hurac%C3%A1n_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Estadio_Tomas_Adolfo_Duco.jpg/1200px-Estadio_Tomas_Adolfo_Duco.jpg"
  },
  {
    id: "54-15",
    nombre: "Independiente",
    presupuesto: 8000000,
    clasico: "54-7",
    estadio: "Libertadores de América",
    ciudad: "Avellaneda",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Independiente_logo.svg/800px-Independiente_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Estadio_Libertadores_de_America.jpg/1200px-Estadio_Libertadores_de_America.jpg"
  },
  {
    id: "54-16",
    nombre: "Independiente Rivadavia",
    presupuesto: 4000000,
    clasico: "54-13",
    estadio: "Bautista Gargantini",
    ciudad: "Mendoza",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Independiente_Rivadavia_logo.svg/800px-Independiente_Rivadavia_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Estadio_Bautista_Gargantini.jpg/1200px-Estadio_Bautista_Gargantini.jpg"
  },
  {
    id: "54-17",
    nombre: "Instituto",
    presupuesto: 5000000,
    clasico: "AR-22",
    estadio: "Juan Domingo Perón",
    ciudad: "Córdoba",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Instituto_logo.svg/800px-Instituto_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Estadio_Juan_Domingo_Peron.jpg/1200px-Estadio_Juan_Domingo_Peron.jpg"
  },
  {
    id: "54-18",
    nombre: "Lanús",
    presupuesto: 7500000,
    clasico: "54-4",
    estadio: "Ciudad de Lanús - Néstor Díaz Pérez",
    ciudad: "Lanús",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Lan%C3%BAs_logo.svg/800px-Lan%C3%BAs_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Estadio_Ciudad_de_Lanus.jpg/1200px-Estadio_Ciudad_de_Lanus.jpg"
  },
  {
    id: "54-19",
    nombre: "Newell's Old Boys",
    presupuesto: 7000000,
    clasico: "54-22",
    estadio: "Marcelo Bielsa",
    ciudad: "Rosario",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Newell%27s_Old_Boys_logo.svg/800px-Newell%27s_Old_Boys_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Estadio_Marcelo_Bielsa.jpg/1200px-Estadio_Marcelo_Bielsa.jpg"
  },
  {
    id: "54-20",
    nombre: "Platense",
    presupuesto: 6000000,
    clasico: "54-4",
    estadio: "Ciudad de Vicente López",
    ciudad: "Florida",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Platense_logo.svg/800px-Platense_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Estadio_Ciudad_de_Vicente_Lopez.jpg/1200px-Estadio_Ciudad_de_Vicente_Lopez.jpg"
  },
  {
    id: "54-21",
    nombre: "Racing Club",
    presupuesto: 8000000,
    clasico: "54-15",
    estadio: "Presidente Perón",
    ciudad: "Avellaneda",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Racing_Club_logo.svg/800px-Racing_Club_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Estadio_Presidente_Peron.jpg/1200px-Estadio_Presidente_Peron.jpg"
  },
  {
    id: "54-22",
    nombre: "River Plate",
    presupuesto: 25000000,
    clasico: "54-7",
    estadio: "Más Monumental",
    ciudad: "Buenos Aires",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/River_Plate_logo.svg/800px-River_Plate_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Estadio_Monumental_Antonio_Vespucio_Liberti.jpg/1200px-Estadio_Monumental_Antonio_Vespucio_Liberti.jpg"
  },
  {
    id: "54-23",
    nombre: "Rosario Central",
    presupuesto: 7000000,
    clasico: "54-19",
    estadio: "Gigante de Arroyito",
    ciudad: "Rosario",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Rosario_Central_logo.svg/800px-Rosario_Central_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Estadio_Gigante_de_Arroyito.jpg/1200px-Estadio_Gigante_de_Arroyito.jpg"
  },
  {
    id: "54-24",
    nombre: "San Lorenzo",
    presupuesto: 8000000,
    clasico: "54-14",
    estadio: "Pedro Bidegain",
    ciudad: "Buenos Aires",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/San_Lorenzo_logo.svg/800px-San_Lorenzo_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Estadio_Pedro_Bidegain.jpg/1200px-Estadio_Pedro_Bidegain.jpg"
  },
  {
    id: "54-25",
    nombre: "Talleres",
    presupuesto: 7500000,
    clasico: "54-6",
    estadio: "Mario Alberto Kempes",
    ciudad: "Córdoba",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Talleres_logo.svg/800px-Talleres_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Estadio_Mario_Alberto_Kempes.jpg/1200px-Estadio_Mario_Alberto_Kempes.jpg"
  },
  {
    id: "54-26",
    nombre: "Tigre",
    presupuesto: 6000000,
    clasico: "54-20",
    estadio: "José Dellagiovanna",
    ciudad: "Victoria",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Tigre_logo.svg/800px-Tigre_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Estadio_Jose_Dellagiovanna.jpg/1200px-Estadio_Jose_Dellagiovanna.jpg"
  },
  {
    id: "54-27",
    nombre: "Unión",
    presupuesto: 5500000,
    clasico: "54-28",
    estadio: "15 de Abril",
    ciudad: "Santa Fe",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Union_Santa_Fe_logo.svg/800px-Union_Santa_Fe_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Estadio_15_de_Abril.jpg/1200px-Estadio_15_de_Abril.jpg"
  },
  {
    id: "54-28",
    nombre: "Vélez Sarsfield",
    presupuesto: 8500000,
    clasico: "54-27",
    estadio: "José Amalfitani",
    ciudad: "Buenos Aires",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Velez_Sarsfield_logo.svg/800px-Velez_Sarsfield_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Estadio_Jose_Amalfitani.jpg/1200px-Estadio_Jose_Amalfitani.jpg"
  },

  //VENEZUELA
{
    id: "58-1",
    nombre: "D. La Guaira",
    presupuesto: 3800000,
    clasico: "58-9",
    estadio: "Estadio Olímpico de la UCV",
    ciudad: "La Guaira",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Deportivo_La_Guaira_logo.svg/800px-Deportivo_La_Guaira_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Estadio_Ol%C3%ADmpico_de_la_UCV_-_Caracas_1.jpg/1200px-Estadio_Ol%C3%ADmpico_de_la_UCV_-_Caracas_1.jpg"
  },
  {
    id: "58-2",
    nombre: "Carabobo",
    presupuesto: 3500000,
    clasico: "58-3",
    estadio: "Estadio Misael Delgado",
    ciudad: "Valencia",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Carabobo_FC_logo.svg/800px-Carabobo_FC_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Estadio_Misael_Delgado_Valencia.JPG/1200px-Estadio_Misael_Delgado_Valencia.JPG"
  },
  {
    id: "58-3",
    nombre: "Universidad Central",
    presupuesto: 3000000,
    clasico: "58-1",
    estadio: "Estadio Olímpico de la UCV",
    ciudad: "Caracas",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Universidad_Central_de_Venezuela_FC_logo.svg/800px-Universidad_Central_de_Venezuela_FC_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Estadio_Ol%C3%ADmpico_de_la_UCV_-_Caracas_1.jpg/1200px-Estadio_Ol%C3%ADmpico_de_la_UCV_-_Caracas_1.jpg"
  },
  {
    id: "58-4",
    nombre: "Deportivo Táchira",
    presupuesto: 6000000,
    clasico: "58-1",
    estadio: "Estadio Pueblo Nuevo",
    ciudad: "San Cristóbal",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Deportivo_T%C3%A1chira_FC_logo.svg/800px-Deportivo_T%C3%A1chira_FC_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Estadio_Pueblo_Nuevo.jpg/1200px-Estadio_Pueblo_Nuevo.jpg"
  },
  {
    id: "58-5",
    nombre: "Puerto Cabello",
    presupuesto: 2800000,
    clasico: "58-7",
    estadio: "Estadio José Antonio Anzoátegui",
    ciudad: "Puerto Cabello",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Deportivo_Puerto_Cabello_logo.svg/800px-Deportivo_Puerto_Cabello_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Estadio_José_Antonio_Anzoátegui.JPG/1200px-Estadio_José_Antonio_Anzoátegui.JPG"
  },
  {
    id: "58-6",
    nombre: "Academia Anzoátegui",
    presupuesto: 2500000,
    clasico: "58-7",
    estadio: "Estadio José Antonio Anzoátegui",
    ciudad: "Puerto La Cruz",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Academia_Anzo%C3%A1tegui_logo.svg/800px-Academia_Anzo%C3%A1tegui_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Estadio_José_Antonio_Anzoátegui.JPG/1200px-Estadio_José_Antonio_Anzoátegui.JPG"
  },
  {
    id: "58-7",
    nombre: "Portuguesa",
    presupuesto: 2400000,
    clasico: "58-5",
    estadio: "Estadio José Antonio Páez",
    ciudad: "Acarigua",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Portuguesa_FC_logo.svg/800px-Portuguesa_FC_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Estadio_José_Antonio_Páez.jpg/1200px-Estadio_José_Antonio_Páez.jpg"
  },
  {
    id: "58-8",
    nombre: "Metropolitanos FC",
    presupuesto: 2200000,
    clasico: "58-9",
    estadio: "Estadio Brígido Iriarte",
    ciudad: "Caracas",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Metropolitanos_FC_logo.svg/800px-Metropolitanos_FC_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Estadio_Brígido_Iriarte_2017.jpg/1200px-Estadio_Brígido_Iriarte_2017.jpg"
  },
  {
    id: "58-9",
    nombre: "Caracas",
    presupuesto: 6000000,
    clasico: "58-1",
    estadio: "Estadio Olímpico de la UCV",
    ciudad: "Caracas",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Caracas_FC_logo.svg/800px-Caracas_FC_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Estadio_Ol%C3%ADmpico_de_la_UCV_-_Caracas_1.jpg/1200px-Estadio_Ol%C3%ADmpico_de_la_UCV_-_Caracas_1.jpg"
  },
  {
    id: "58-10",
    nombre: "Monagas",
    presupuesto: 2300000,
    clasico: "58-12",
    estadio: "Estadio Monumental de Maturín",
    ciudad: "Maturín",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Monagas_SC_logo.svg/800px-Monagas_SC_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Estadio_Monumental_de_Matur%C3%ADn_2019.jpg/1200px-Estadio_Monumental_de_Matur%C3%ADn_2019.jpg"
  },
  {
    id: "58-11",
    nombre: "Rayo Zuliano",
    presupuesto: 1800000,
    clasico: "58-13",
    estadio: "Estadio José Encarnación Romero",
    ciudad: "Maracaibo",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Rayo_Zuliano_logo.svg/800px-Rayo_Zuliano_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Estadio_José_Encarnación_Romero_2015.jpg/1200px-Estadio_José_Encarnación_Romero_2015.jpg"
  },
  {
    id: "58-12",
    nombre: "Estudiantes de Mérida",
    presupuesto: 2500000,
    clasico: "58-10",
    estadio: "Estadio Metropolitano de Mérida",
    ciudad: "Mérida",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Estudiantes_de_Merida_logo.svg/800px-Estudiantes_de_Merida_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Estadio_Metropolitano_de_Merida_2017.jpg/1200px-Estadio_Metropolitano_de_Merida_2017.jpg"
  },
  {
    id: "58-13",
    nombre: "Zamora",
    presupuesto: 2200000,
    clasico: "58-11",
    estadio: "Estadio Agustín Tovar",
    ciudad: "Barinas",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Zamora_FC_logo.svg/800px-Zamora_FC_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Estadio_Agustín_Tovar_2017.jpg/1200px-Estadio_Agustín_Tovar_2017.jpg"
  },
  {
    id: "58-14",
    nombre: "Yaracuyanos",
    presupuesto: 2100000,
    clasico: "Ninguno",
    estadio: "Estadio Florentino Oropeza",
    ciudad: "San Felipe",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Estadio_Agustín_Tovar_2017.jpg/1200px-Estadio_Agustín_Tovar_2017.jpg"
 },

  //COLOMBIA
  {
    id: "57-1",
    nombre: "América",
    clasico: "57-4", // ejemplo clásico con Millonarios
    estadio: "Estadio Olímpico Pascual Guerrero",
    ciudad: "Cali",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/en/3/37/Am%C3%A9rica_de_Cali_logo.svg",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Estadio_Pascual_Guerrero_2014.jpg/1200px-Estadio_Pascual_Guerrero_2014.jpg"
  },
  {
    id: "57-2",
    nombre: "Tolima",
    clasico: "57-8", // ejemplo clásico con Deportes Tolima - Atlético Huila (puedes corregir)
    estadio: "Estadio Manuel Murillo Toro",
    ciudad: "Ibagué",
    escudoUrl: "",
    estadioUrl: ""
  },
  {
    id: "57-3",
    nombre: "Atlético Nacional",
    clasico: "57-7", // clásico con Medellín
    estadio: "Estadio Atanasio Girardot",
    ciudad: "Medellín",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/Atletico_Nacional_2017_logo.svg/1200px-Atletico_Nacional_2017_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Estadio_Atanasio_Girardot.JPG/1200px-Estadio_Atanasio_Girardot.JPG"
  },
  {
    id: "57-4",
    nombre: "Millonarios",
    clasico: "57-1", // clásico con América
    estadio: "Estadio El Campín",
    ciudad: "Bogotá",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Millonarios_FC_logo.svg/1200px-Millonarios_FC_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Estadio_El_Camp%C3%ADn_2018.jpg/1200px-Estadio_El_Camp%C3%ADn_2018.jpg"
  },
  {
    id: "57-5",
    nombre: "Junior",
    clasico: "57-6", // clásico con Santa Fe (puedes ajustar)
    estadio: "Estadio Metropolitano Roberto Meléndez",
    ciudad: "Barranquilla",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Junior_de_Barranquilla_logo.svg/1200px-Junior_de_Barranquilla_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Estadio_Metropolitano_Roberto_Mel%C3%A9ndez_2019.jpg/1200px-Estadio_Metropolitano_Roberto_Mel%C3%A9ndez_2019.jpg"
  },
  {
    id: "57-6",
    nombre: "Santa Fe",
    clasico: "57-5", // clásico con Junior
    estadio: "Estadio El Campín",
    ciudad: "Bogotá",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/2/21/Independiente_Santa_Fe_logo.svg/1200px-Independiente_Santa_Fe_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Estadio_El_Camp%C3%ADn_2018.jpg/1200px-Estadio_El_Camp%C3%ADn_2018.jpg"
  },
  {
    id: "57-7",
    nombre: "Medellín",
    clasico: "57-3", // clásico con Atlético Nacional
    estadio: "Estadio Atanasio Girardot",
    ciudad: "Medellín",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Deportivo_Medell%C3%ADn_logo.svg/1200px-Deportivo_Medell%C3%ADn_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Estadio_Atanasio_Girardot.JPG/1200px-Estadio_Atanasio_Girardot.JPG"
  },
  {
    id: "57-8",
    nombre: "Once Caldas",
    clasico: "",
    estadio: "Estadio Palogrande",
    ciudad: "Manizales",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/Once_Caldas_logo.svg/1200px-Once_Caldas_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Estadio_Palogrande.jpg/1200px-Estadio_Palogrande.jpg"
  },
  {
    id: "57-9",
    nombre: "Pasto",
    clasico: "",
    estadio: "Estadio Departamental Libertad",
    ciudad: "Pasto",
    escudoUrl: "",
    estadioUrl: ""
  },
  {
    id: "57-10",
    nombre: "Deportivo Pereira",
    clasico: "",
    estadio: "Estadio Hernán Ramírez Villegas",
    ciudad: "Pereira",
    escudoUrl: "",
    estadioUrl: ""
  },
  {
    id: "57-11",
    nombre: "Bucaramanga",
    clasico: "",
    estadio: "Estadio Alfonso López",
    ciudad: "Bucaramanga",
    escudoUrl: "",
    estadioUrl: ""
  },
  {
    id: "57-12",
    nombre: "Alianza",
    clasico: "",
    estadio: "Estadio Municipal",
    ciudad: "Puerto Bogotá",
    escudoUrl: "",
    estadioUrl: ""
  },
  {
    id: "57-13",
    nombre: "Deportivo Cali",
    clasico: "57-1", // clásico con América
    estadio: "Estadio Deportivo Cali",
    ciudad: "Cali",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/Deportivo_Cali_Logo.svg/1200px-Deportivo_Cali_Logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Estadio_Deportivo_Cali.jpg/1200px-Estadio_Deportivo_Cali.jpg"
  },
  {
    id: "57-14",
    nombre: "Llaneros",
    clasico: "",
    estadio: "Estadio Bello Horizonte",
    ciudad: "Villavicencio",
    escudoUrl: "",
    estadioUrl: ""
  },
  {
    id: "57-15",
    nombre: "Fortaleza",
    clasico: "",
    estadio: "Estadio Metropolitano de Techo",
    ciudad: "Bogotá",
    escudoUrl: "",
    estadioUrl: ""
  },
  {
    id: "57-16",
    nombre: "Boyacá Chicó",
    clasico: "",
    estadio: "Estadio La Independencia",
    ciudad: "Tunja",
    escudoUrl: "",
    estadioUrl: ""
  },
  {
    id: "57-17",
    nombre: "Águilas Doradas",
    clasico: "",
    estadio: "Estadio Alberto Grisales",
    ciudad: "Rionegro",
    escudoUrl: "",
    estadioUrl: ""
  },
  {
    id: "57-18",
    nombre: "Envigado",
    clasico: "",
    estadio: "Estadio Polideportivo Sur",
    ciudad: "Envigado",
    escudoUrl: "",
    estadioUrl: ""
  },
  {
    id: "57-19",
    nombre: "Unión Magdalena",
    clasico: "",
    estadio: "Estadio Sierra Nevada",
    ciudad: "Santa Marta",
    escudoUrl: "",
    estadioUrl: ""
  },
  {
    id: "57-20",
    nombre: "La Equidad",
    clasico: "",
    estadio: "Estadio Metropolitano de Techo",
    ciudad: "Bogotá",
    escudoUrl: "",
    estadioUrl: ""
  },

   {
    id: "595-1",
    nombre: "Libertad",
    presupuesto: 7500000,
    clasico: "595-3",
    estadio: "Estadio Dr. Nicolás Leoz",
    ciudad: "Asunción",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Club_Libertad_logo.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Estadio_Nicolas_Leoz.jpg"
  },

  //PARAGUAY
  {
    id: "595-2",
    nombre: "Guaraní",
    presupuesto: 7200000,
    clasico: "595-3",
    estadio: "Estadio Rogelio Livieres",
    ciudad: "Asunción",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Club_Guarani.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Estadio_Rogelio_Livieres.jpg"
  },
  {
    id: "595-3",
    nombre: "Cerro Porteño",
    presupuesto: 8000000,
    clasico: "595-4",
    estadio: "La Nueva Olla",
    ciudad: "Asunción",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cerro_Porte%C3%B1o_logo.svg",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Estadio_Cerro_Porte%C3%B1o_-_La_Nueva_Olla.jpg"
  },
  {
    id: "595-4",
    nombre: "Olimpia",
    presupuesto: 8000000,
    clasico: "595-3",
    estadio: "Estadio Manuel Ferreira",
    ciudad: "Asunción",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/75/Club_Olimpia_logo.svg",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/Estadio_Manuel_Ferreira.jpg"
  },
  {
    id: "595-5",
    nombre: "Sportivo Trinidense",
    presupuesto: 4200000,
    clasico: "",
    estadio: "Estadio Martín Torres",
    ciudad: "Asunción",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/54/Sportivo_Trinidense.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/18/Estadio_Mart%C3%ADn_Torres.jpg"
  },
  {
    id: "595-6",
    nombre: "Deportivo Recoleta",
    presupuesto: 3900000,
    clasico: "",
    estadio: "Estadio Roberto Bettega",
    ciudad: "Asunción",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Deportivo_Recoleta_logo.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Estadio_Roberto_Bettega.jpg"
  },
  {
    id: "595-7",
    nombre: "Sportivo Ameliano",
    presupuesto: 4100000,
    clasico: "",
    estadio: "Estadio Luis Alfonso Giagni",
    ciudad: "Villa Elisa",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Sportivo_Ameliano.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Estadio_Luis_Alfonso_Giagni.jpg"
  },
  {
    id: "595-8",
    nombre: "General Caballero JLM",
    presupuesto: 3700000,
    clasico: "",
    estadio: "Estadio Ka'arendy",
    ciudad: "Juan León Mallorquín",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/General_Caballero_JLM_logo.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Estadio_Kaarendy.jpg"
  },
  {
    id: "595-9",
    nombre: "Nacional",
    presupuesto: 4300000,
    clasico: "",
    estadio: "Estadio Arsenio Erico",
    ciudad: "Asunción",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/06/Nacional_Asuncion.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Estadio_Arsenio_Erico.jpg"
  },
  {
    id: "595-10",
    nombre: "Sportivo Luqueño",
    presupuesto: 4500000,
    clasico: "",
    estadio: "Estadio Feliciano Cáceres",
    ciudad: "Luque",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Sportivo_Luque%C3%B1o_logo.svg",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/Estadio_Feliciano_Caceres.jpg"
  },
  {
    id: "595-11",
    nombre: "Atlético Tembetary",
    presupuesto: 3000000,
    clasico: "",
    estadio: "Estadio Tembetary",
    ciudad: "Ypané",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Club_Tembetary.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Estadio_Tembetary.jpg"
  },
  {
    id: "595-12",
    nombre: "2 de Mayo",
    presupuesto: 3800000,
    clasico: "",
    estadio: "Estadio Río Parapití",
    ciudad: "Pedro Juan Caballero",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Club_2_de_Mayo.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Estadio_R%C3%ADo_Parapit%C3%AD.jpg"
  },

  //CHILE
   {
    id: "56-1",
    nombre: "Palestino",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio Municipal de La Cisterna",
    ciudad: "Santiago",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/CD_Palestino_badge.svg",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Estadio_Municipal_de_La_Cisterna.jpg"
  },
  {
    id: "56-2",
    nombre: "Coquimbo Unido",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio Francisco Sánchez Rumoroso",
    ciudad: "Coquimbo",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Escudo_Coquimbo_Unido.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/42/Estadio_S%C3%A1nchez_Rumoroso_2010.jpg"
  },
  {
    id: "56-3",
    nombre: "Audax Italiano",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio Bicentenario de La Florida",
    ciudad: "Santiago",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/Audax_Italiano_2018.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/Estadio_Bicentenario_de_La_Florida.jpg"
  },
  {
    id: "56-4",
    nombre: "Universidad de Chile",
    presupuesto: 7000000,
    clasico: "56-10",
    estadio: "Estadio Nacional",
    ciudad: "Santiago",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/52/Escudo_de_la_Universidad_de_Chile.svg",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/EstadioNacionaldeChilevistaAerea.jpg"
  },
  {
    id: "56-5",
    nombre: "Cobresal",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio El Cobre",
    ciudad: "El Salvador",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Escudo_del_Club_de_Deportes_Cobresal.svg",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Estadio_El_Cobre.jpg"
  },
  {
    id: "56-6",
    nombre: "Universidad Católica",
    presupuesto: 7000000,
    clasico: "56-4",
    estadio: "Estadio San Carlos de Apoquindo",
    ciudad: "Santiago",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Escudo_UC_2018.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Estadio_San_Carlos_de_Apoquindo_-_panoramica.jpg"
  },
  {
    id: "56-7",
    nombre: "O'Higgins",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio El Teniente",
    ciudad: "Rancagua",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Escudo_O%27Higgins_F.C..svg",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Estadio_El_Teniente_2014.jpg"
  },
  {
    id: "56-8",
    nombre: "Huachipato",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio CAP",
    ciudad: "Talcahuano",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Huachipato_badge.svg",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Estadio_CAP_Acero.jpg"
  },
  {
    id: "56-9",
    nombre: "Unión La Calera",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio Nicolás Chahuán",
    ciudad: "La Calera",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Escudo_Union_La_Calera.svg",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Estadio_Nicol%C3%A1s_Chahu%C3%A1n_Nazar.jpg"
  },
  {
    id: "56-10",
    nombre: "Colo-Colo",
    presupuesto: 7000000,
    clasico: "56-4",
    estadio: "Estadio Monumental David Arellano",
    ciudad: "Santiago",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/8/88/Colo-Colo_logo.svg/800px-Colo-Colo_logo.svg.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/Estadio_Monumental_David_Arellano_-_panoramica.jpg"
  },
  {
    id: "56-11",
    nombre: "La Serena",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio La Portada",
    ciudad: "La Serena",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/Club_Deportes_La_Serena.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/Estadio_La_Portada_2015.jpg"
  },
  {
    id: "56-12",
    nombre: "Ñublense",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio Nelson Oyarzún",
    ciudad: "Chillán",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/Logo_Nublense.svg",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Estadio_Nelson_Oyarzun_arenas.jpg"
  },
  {
    id: "56-13",
    nombre: "Deportes Limache",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio Municipal Lucio Fariña",
    ciudad: "Limache",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Escudo_Deportes_Limache.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Estadio_Lucio_Fari%C3%B1a_Fern%C3%A1ndez.jpg"
  },
  {
    id: "56-14",
    nombre: "Everton",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio Sausalito",
    ciudad: "Viña del Mar",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/Escudo_de_Everton_de_Vi%C3%B1a_del_Mar.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Estadio_Sausalito_2015.jpg"
  },
  {
    id: "56-15",
    nombre: "Unión Española",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio Santa Laura",
    ciudad: "Santiago",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Escudo_Unión_Española.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Estadio_Santa_Laura_U_SeK_2010.jpg"
  },
  {
    id: "56-16",
    nombre: "Deportes Iquique",
    presupuesto: 7000000,
    clasico: "",
    estadio: "Estadio Tierra de Campeones",
    ciudad: "Iquique",
    escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Escudo_CD_Iquique.png",
    estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Estadio_Tierra_de_Campeones_2013.jpg"
  },

  //BOLIVIA
  {
  id: "591-1",
  nombre: "Always Ready",
  presupuesto: 7500000,
  clasico: "Bolívar",
  estadio: "Estadio Municipal de El Alto",
  ciudad: "El Alto",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/84/Escudo_del_Club_Always_Ready.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Estadio_Municipal_de_El_Alto.jpg"
},
{
  id: "591-2",
  nombre: "Bolívar",
  presupuesto: 8000000,
  clasico: "The Strongest",
  estadio: "Estadio Hernando Siles",
  ciudad: "La Paz",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Escudo_del_Club_Bol%C3%ADvar.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Estadio_Hernando_Siles.jpg"
},
{
  id: "591-3",
  nombre: "Blooming",
  presupuesto: 7200000,
  clasico: "Oriente Petrolero",
  estadio: "Estadio Ramón Tahuichi Aguilera",
  ciudad: "Santa Cruz",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Escudo_Club_Blooming.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/84/Estadio_Tahuichi_Aguilera.jpg"
},
{
  id: "591-4",
  nombre: "The Strongest",
  presupuesto: 7800000,
  clasico: "Bolívar",
  estadio: "Estadio Hernando Siles",
  ciudad: "La Paz",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/85/Escudo_del_Club_The_Strongest.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Estadio_Hernando_Siles.jpg"
},
{
  id: "591-5",
  nombre: "ABB",
  presupuesto: 4000000,
  clasico: "",
  estadio: "Estadio Hernando Siles",
  ciudad: "La Paz",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Escudo_ABB_La_Paz.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Estadio_Hernando_Siles.jpg"
},
{
  id: "591-6",
  nombre: "Universitario de Vinto",
  presupuesto: 4200000,
  clasico: "",
  estadio: "Estadio Félix Capriles",
  ciudad: "Cochabamba",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Escudo_Universitario_de_Vinto.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Estadio_F%C3%A9lix_Capriles_Cochabamba.jpg"
},
{
  id: "591-7",
  nombre: "Guabirá",
  presupuesto: 5000000,
  clasico: "",
  estadio: "Estadio Gilberto Parada",
  ciudad: "Montero",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Escudo_Club_Guabira.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Estadio_Gilberto_Parada.jpg"
},
{
  id: "591-8",
  nombre: "Independiente Petrolero",
  presupuesto: 4600000,
  clasico: "",
  estadio: "Estadio Patria",
  ciudad: "Sucre",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Escudo_Independiente_Petrolero.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Estadio_Olimpico_Patria.jpg"
},
{
  id: "591-9",
  nombre: "San Antonio Bulo Bulo",
  presupuesto: 3500000,
  clasico: "",
  estadio: "Estadio Municipal de Entre Ríos",
  ciudad: "Bulo Bulo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Escudo_San_Antonio_Bulo_Bulo.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Estadio_Bulo_Bulo.jpg"
},
{
  id: "591-10",
  nombre: "Nacional Potosí",
  presupuesto: 4700000,
  clasico: "Real Potosí",
  estadio: "Estadio Víctor Agustín Ugarte",
  ciudad: "Potosí",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/42/Escudo_Nacional_Potos%C3%AD.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Estadio_Victor_Agustin_Ugarte.jpg"
},
{
  id: "591-11",
  nombre: "Real Tomayapo",
  presupuesto: 3800000,
  clasico: "",
  estadio: "Estadio IV Centenario",
  ciudad: "Tarija",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Escudo_Real_Tomayapo.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/14/Estadio_IV_Centenario_Tarija.jpg"
},
{
  id: "591-12",
  nombre: "Real Oruro",
  presupuesto: 3600000,
  clasico: "",
  estadio: "Estadio Jesús Bermúdez",
  ciudad: "Oruro",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/Escudo_Real_Oruro.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/15/Estadio_Jesus_Bermudez.jpg"
},
{
  id: "591-13",
  nombre: "Gualberto Villarroel San José",
  presupuesto: 3400000,
  clasico: "",
  estadio: "Estadio Jesús Bermúdez",
  ciudad: "Oruro",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Escudo_San_Jos%C3%A9_Bolivia.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/15/Estadio_Jesus_Bermudez.jpg"
},
{
  id: "591-14",
  nombre: "Oriente Petrolero",
  presupuesto: 5000000,
  clasico: "Blooming",
  estadio: "Estadio Ramón Tahuichi Aguilera",
  ciudad: "Santa Cruz",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Escudo_Oriente_Petrolero.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/84/Estadio_Tahuichi_Aguilera.jpg"
},
{
  id: "591-15",
  nombre: "Wilstermann",
  presupuesto: 4300000,
  clasico: "",
  estadio: "Estadio Félix Capriles",
  ciudad: "Cochabamba",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Escudo_Wilstermann.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Estadio_F%C3%A9lix_Capriles_Cochabamba.jpg"
},
{
  id: "591-16",
  nombre: "Aurora",
  presupuesto: 3900000,
  clasico: "",
  estadio: "Estadio Félix Capriles",
  ciudad: "Cochabamba",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Escudo_Club_Aurora.png",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Estadio_F%C3%A9lix_Capriles_Cochabamba.jpg"
},

//BRASIL  
  {
  id: "55-1",
  nombre: "Palmeiras",
  presupuesto: 12000000,
  clasico: "Corinthians",
  estadio: "Allianz Parque",
  ciudad: "São Paulo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/5/5c/Sociedade_Esportiva_Palmeiras_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/Allianz_Parque_2014.jpg"
},
{
  id: "55-2",
  nombre: "Flamengo",
  presupuesto: 12500000,
  clasico: "Vasco da Gama",
  estadio: "Maracanã",
  ciudad: "Rio de Janeiro",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/6/6b/Clube_de_Regatas_do_Flamengo_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/94/Maracana_Stadium_-_Rio_de_Janeiro.jpg"
},
{
  id: "55-3",
  nombre: "Cruzeiro",
  presupuesto: 8500000,
  clasico: "Atlético Mineiro",
  estadio: "Mineirão",
  ciudad: "Belo Horizonte",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7a/Cruzeiro_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/32/Estadio_Mineirao.jpg"
},
{
  id: "55-4",
  nombre: "Bragantino",
  presupuesto: 6000000,
  clasico: "",
  estadio: "Nabi Abi Chedid",
  ciudad: "Bragança Paulista",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/8/8f/Red_Bull_Bragantino_logo.svg",
  estadioUrl: ""
},
{
  id: "55-5",
  nombre: "Fluminense",
  presupuesto: 9000000,
  clasico: "Vasco da Gama",
  estadio: "Maracanã",
  ciudad: "Rio de Janeiro",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7e/Fluminense_FC_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/9/94/Maracana_Stadium_-_Rio_de_Janeiro.jpg"
},
{
  id: "55-6",
  nombre: "Ceará",
  presupuesto: 5500000,
  clasico: "Fortaleza",
  estadio: "Arena Castelão",
  ciudad: "Fortaleza",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/6/6f/Cear%C3%A1_Sporting_Club_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Arena_Castel%C3%A3o.jpg"
},
{
  id: "55-7",
  nombre: "Bahía",
  presupuesto: 5200000,
  clasico: "Vitória",
  estadio: "Arena Fonte Nova",
  ciudad: "Salvador",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f4/Esporte_Clube_Bahia_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/14/Arena_Fonte_Nova_2014.jpg"
},
{
  id: "55-8",
  nombre: "Corinthians",
  presupuesto: 11000000,
  clasico: "Palmeiras",
  estadio: "Arena Corinthians",
  ciudad: "São Paulo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/4/44/SC_Corinthians_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Arena_Corinthians_02.jpg"
},
{
  id: "55-9",
  nombre: "Mirassol",
  presupuesto: 3500000,
  clasico: "",
  estadio: "Estádio José Maria de Campos Maia",
  ciudad: "Mirassol",
  escudoUrl: "",
  estadioUrl: ""
},
{
  id: "55-10",
  nombre: "Atlético Mineiro",
  presupuesto: 9500000,
  clasico: "Cruzeiro",
  estadio: "Mineirão",
  ciudad: "Belo Horizonte",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f0/Clube_Atl%C3%A9tico_Mineiro_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/32/Estadio_Mineirao.jpg"
},
{
  id: "55-11",
  nombre: "Botafogo",
  presupuesto: 7000000,
  clasico: "Vasco da Gama",
  estadio: "Estádio Nilton Santos",
  ciudad: "Rio de Janeiro",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/9/92/Botafogo_de_Futebol_e_Regatas_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Estadio_Nilton_Santos_3.jpg"
},
{
  id: "55-12",
  nombre: "São Paulo",
  presupuesto: 9000000,
  clasico: "",
  estadio: "Morumbi",
  ciudad: "São Paulo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/4/44/Sao_Paulo_FC_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Estadio_do_Morumbi_2022.jpg"
},
{
  id: "55-13",
  nombre: "Vasco da Gama",
  presupuesto: 6500000,
  clasico: "Flamengo, Botafogo, Fluminense",
  estadio: "São Januário",
  ciudad: "Rio de Janeiro",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0f/CR_Vasco_da_Gama_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Estadio_Sao_Januario.jpg"
},
{
  id: "55-14",
  nombre: "Fortaleza",
  presupuesto: 5300000,
  clasico: "Ceará",
  estadio: "Castelão",
  ciudad: "Fortaleza",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7c/Fortaleza_Esporte_Clube_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Arena_Castel%C3%A3o.jpg"
},
{
  id: "55-15",
  nombre: "Internacional",
  presupuesto: 9200000,
  clasico: "Grêmio",
  estadio: "Estádio Beira-Rio",
  ciudad: "Porto Alegre",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/7/72/SC_Internacional_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Beira_Rio_Stadium_-_Porto_Alegre.jpg"
},
{
  id: "55-16",
  nombre: "Vitória",
  presupuesto: 4800000,
  clasico: "Bahía",
  estadio: "Estádio Barradão",
  ciudad: "Salvador",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/9/98/EC_Vit%C3%B3ria_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Estadio_Barrad%C3%A3o.jpg"
},
{
  id: "55-17",
  nombre: "Grêmio",
  presupuesto: 9300000,
  clasico: "Internacional",
  estadio: "Arena do Grêmio",
  ciudad: "Porto Alegre",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/7/79/Gremio_FBPA_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Arena_do_Gr%C3%AAmio.jpg"
},
{
  id: "55-18",
  nombre: "Juventude",
  presupuesto: 4000000,
  clasico: "",
  estadio: "Estádio Alfredo Jaconi",
  ciudad: "Caxias do Sul",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0b/Esporte_Clube_Juventude_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Estadio_Alfredo_Jaconi.jpg"
},
{
  id: "55-19",
  nombre: "Santos",
  presupuesto: 8500000,
  clasico: "",
  estadio: "Vila Belmiro",
  ciudad: "Santos",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/c/c9/Santos_FC_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/Vila_Belmiro_August_2013.jpg"
},
{
  id: "55-20",
  nombre: "Sport Recife",
  presupuesto: 4600000,
  clasico: "",
  estadio: "Estádio Ilha do Retiro",
  ciudad: "Recife",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/9/9d/Sport_Recife_logo.svg",
  estadioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/Estadio_Ilha_do_Retiro_2007.jpg"
},

  //ECUADOR
  {
  id: "593-1",
  nombre: "Independiente del Valle",
  presupuesto: 7000000,
  clasico: "",
  estadio: "Estadio Banco Guayaquil",
  ciudad: "Sangolquí",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/f/fd/Independiente_del_Valle_logo.svg",
  estadioUrl: ""
},
{
  id: "593-2",
  nombre: "Barcelona SC",
  presupuesto: 12000000,
  clasico: "Emelec",
  estadio: "Estadio Monumental Isidro Romero Carbo",
  ciudad: "Guayaquil",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f8/Barcelona_SC_logo.svg",
  estadioUrl: ""
},
{
  id: "593-3",
  nombre: "Orense",
  presupuesto: 4000000,
  clasico: "",
  estadio: "Estadio 9 de Mayo",
  ciudad: "Machala",
  escudoUrl: "",
  estadioUrl: ""
},
{
  id: "593-4",
  nombre: "Aucas",
  presupuesto: 5000000,
  clasico: "LDU Quito",
  estadio: "Estadio Gonzalo Pozo Ripalda",
  ciudad: "Quito",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/3/34/S.D._Aucas_logo.svg",
  estadioUrl: ""
},
{
  id: "593-5",
  nombre: "U. Católica",
  presupuesto: 4500000,
  clasico: "",
  estadio: "Estadio Olímpico Atahualpa",
  ciudad: "Quito",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/2/20/Universidad_Catolica_logo.svg",
  estadioUrl: ""
},
{
  id: "593-6",
  nombre: "LDU Quito",
  presupuesto: 9000000,
  clasico: "Aucas",
  estadio: "Estadio Rodrigo Paz Delgado",
  ciudad: "Quito",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/4/44/Liga_de_Quito_logo.svg",
  estadioUrl: ""
},
{
  id: "593-7",
  nombre: "Dep. Cuenca",
  presupuesto: 4000000,
  clasico: "",
  estadio: "Estadio Alejandro Serrano Aguilar",
  ciudad: "Cuenca",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/8/89/Deportivo_Cuenca_logo.svg",
  estadioUrl: ""
},
{
  id: "593-8",
  nombre: "Cuniburo",
  presupuesto: 3000000,
  clasico: "",
  estadio: "Estadio Olímpico Atahualpa",
  ciudad: "Quito",
  escudoUrl: "",
  estadioUrl: ""
},
{
  id: "593-9",
  nombre: "Libertad FC",
  presupuesto: 3500000,
  clasico: "",
  estadio: "Estadio Reina del Cisne",
  ciudad: "Machala",
  escudoUrl: "",
  estadioUrl: ""
},
{
  id: "593-10",
  nombre: "Mushuc Runa",
  presupuesto: 3200000,
  clasico: "",
  estadio: "Estadio Bellavista",
  ciudad: "Ambato",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7e/Mushuc_Runa_S.C._logo.svg",
  estadioUrl: ""
},
{
  id: "593-11",
  nombre: "Manta",
  presupuesto: 2800000,
  clasico: "",
  estadio: "Estadio Jocay",
  ciudad: "Manta",
  escudoUrl: "",
  estadioUrl: ""
},
{
  id: "593-12",
  nombre: "Delfín",
  presupuesto: 3500000,
  clasico: "",
  estadio: "Estadio Jocay",
  ciudad: "Manta",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7d/Delf%C3%ADn_Sporting_Club_logo.svg",
  estadioUrl: ""
},
{
  id: "593-13",
  nombre: "El Nacional",
  presupuesto: 4000000,
  clasico: "LDU Quito",
  estadio: "Estadio Olímpico Atahualpa",
  ciudad: "Quito",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/4/48/Club_Deportivo_El_Nacional_logo.svg",
  estadioUrl: ""
},
{
  id: "593-14",
  nombre: "Emelec",
  presupuesto: 11000000,
  clasico: "Barcelona SC",
  estadio: "Estadio George Capwell",
  ciudad: "Guayaquil",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/3/33/Club_Emelec_logo.svg",
  estadioUrl: ""
},
{
  id: "593-15",
  nombre: "Macará",
  presupuesto: 3000000,
  clasico: "",
  estadio: "Estadio Bellavista",
  ciudad: "Ambato",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7c/Macara_logo.svg",
  estadioUrl: ""
},
{
  id: "593-16",
  nombre: "Técnico Universitario",
  presupuesto: 2500000,
  clasico: "",
  estadio: "Estadio Bellavista",
  ciudad: "Ambato",
  escudoUrl: "",
  estadioUrl: ""
},

  //uruguay
{
  id: "598-1",
  nombre: "Peñarol",
  presupuesto: 9000000,
  clasico: "Nacional",
  estadio: "Estadio Campeón del Siglo",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7a/Club_Atl%C3%A9tico_Pe%C3%B1arol_logo.svg",
  estadioUrl: ""
},
{
  id: "598-2",
  nombre: "Defensor Sporting",
  presupuesto: 4000000,
  clasico: "",
  estadio: "Estadio Luis Franzini",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/2/2c/Defensor_Sporting_logo.svg",
  estadioUrl: ""
},
{
  id: "598-3",
  nombre: "Cerro",
  presupuesto: 3000000,
  clasico: "",
  estadio: "Estadio Luis Tróccoli",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/e/e2/C.A._Cerro_logo.svg",
  estadioUrl: ""
},
{
  id: "598-4",
  nombre: "Liverpool",
  presupuesto: 3500000,
  clasico: "",
  estadio: "Estadio Belvedere",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7e/Liverpool_FC_Uruguay_logo.svg",
  estadioUrl: ""
},
{
  id: "598-5",
  nombre: "River Plate",
  presupuesto: 3000000,
  clasico: "",
  estadio: "Estadio Saroldi",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/8/81/Club_Atl%C3%A9tico_River_Plate_logo.svg",
  estadioUrl: ""
},
{
  id: "598-6",
  nombre: "Wanderers",
  presupuesto: 3500000,
  clasico: "",
  estadio: "Parque Viera",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/1/11/Wanderers_FC_logo.svg",
  estadioUrl: ""
},
{
  id: "598-7",
  nombre: "Cerro Largo",
  presupuesto: 2500000,
  clasico: "",
  estadio: "Estadio Arquitecto Antonio Eleuterio Ubilla",
  ciudad: "Melo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/2/2f/Cerro_Largo_FC_logo.svg",
  estadioUrl: ""
},
{
  id: "598-8",
  nombre: "Plaza Colonia",
  presupuesto: 2200000,
  clasico: "",
  estadio: "Estadio Profesor Alberto Suppici",
  ciudad: "Colonia del Sacramento",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f4/Plaza_Colonia_logo.svg",
  estadioUrl: ""
},

{
  id: "598-9",
  nombre: "Racing",
  presupuesto: 2800000,
  clasico: "",
  estadio: "Estadio Parque Alfredo Víctor Viera",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/6/6b/Racing_Club_Montevideo_logo.svg",
  estadioUrl: ""
},
{
  id: "598-10",
  nombre: "Juventud",
  presupuesto: 2400000,
  clasico: "",
  estadio: "Estadio Parque Artigas",
  ciudad: "Las Piedras",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/0/04/Juventud_de_Las_Piedras_logo.svg",
  estadioUrl: ""
},
{
  id: "598-11",
  nombre: "Nacional",
  presupuesto: 10000000,
  clasico: "Peñarol",
  estadio: "Estadio Gran Parque Central",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/2/2e/Club_Nacional_de_Football_logo.svg",
  estadioUrl: ""
},
{
  id: "598-12",
  nombre: "Danubio",
  presupuesto: 2800000,
  clasico: "",
  estadio: "Estadio Jardines del Hipódromo",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/5/5f/Danubio_FC_logo.svg",
  estadioUrl: ""
},
{
  id: "598-13",
  nombre: "Miramar Misiones",
  presupuesto: 1500000,
  clasico: "",
  estadio: "Parque Paladino",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/2/2f/Miramar_Misiones_logo.svg",
  estadioUrl: ""
},
{
  id: "598-14",
  nombre: "Torque",
  presupuesto: 2300000,
  clasico: "",
  estadio: "Estadio Charrúa",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/e/e3/Montpellier_HSC_logo.svg", // No oficial, por ahora
  estadioUrl: ""
},
{
  id: "598-15",
  nombre: "Progreso",
  presupuesto: 2000000,
  clasico: "",
  estadio: "Parque Paladino",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/3/34/Club_Atl%C3%A9tico_Progreso_logo.svg",
  estadioUrl: ""
},
{
  id: "598-16",
  nombre: "Boston River",
  presupuesto: 1900000,
  clasico: "",
  estadio: "Estadio Paladino",
  ciudad: "Montevideo",
  escudoUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Boston_River_logo.svg",
  estadioUrl: ""
}

  
];

window.clubes = clubes;
