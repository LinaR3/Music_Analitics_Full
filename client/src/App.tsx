import React, { useState, useEffect, useCallback, memo } from 'react';
import { Home, BarChartHorizontalBig, Sparkles, Music, ArrowUp, ArrowDown, TrendingUp, Layers, Send, Linkedin, Github, Twitter, Zap, Facebook, Instagram, Sun, Moon, AlertTriangle, CheckCircle, Star, Clock, ThumbsDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie, Tooltip as RechartsTooltip } from 'recharts';



// --- DATOS SIMULADOS (AJUSTADOS 1980-2020) ---
const dataByDecade = [
    { decade: '1980s', avg_popularity: 48.3, avg_energy: 0.62 },
    { decade: '1990s', avg_popularity: 52.1, avg_energy: 0.61 },
    { decade: '2000s', avg_popularity: 58.9, avg_energy: 0.65 },
    { decade: '2010s', avg_popularity: 65.2, avg_energy: 0.63 },
    { decade: '2020s', avg_popularity: 70.1, avg_energy: 0.60 },
];
const firstDecade = dataByDecade[0]?.decade || '1980s';
const lastDecade = dataByDecade[dataByDecade.length - 1]?.decade || '2020s';
const popularityDistribution = [
    { range: '0-20', count: 5000, color: '#48CA34'},
    { range: '21-40', count: 15000, color: '#90E0EF'},
    { range: '41-60', count: 40000, color: '#0077B6'},
    { range: '61-80', count: 55000, color: '#005f99'},
    { range: '81-100', count: 15000, color: '#00FFFF'},
];
const totalSongs = popularityDistribution.reduce((sum, item) => sum + item.count, 0);
const kpiMetricsUpdated = [
  { title: 'Canciones Analizadas', value: totalSongs.toLocaleString(), change: `(${firstDecade} - ${lastDecade})`, icon: Music, trend: 'neutral', description: 'Total canciones dataset (1980-2020).', metricId: 'total_songs' },
  { title: 'Popularidad Promedio (2020s)', value: dataByDecade[dataByDecade.length - 1]?.avg_popularity.toFixed(1) ?? 'N/A', change: dataByDecade.length > 1 ? `+${(dataByDecade[dataByDecade.length - 1].avg_popularity - dataByDecade[dataByDecade.length - 2].avg_popularity).toFixed(1)} vs ${dataByDecade[dataByDecade.length - 2].decade}` : '', icon: Star, trend: 'up', description: 'Promedio popularidad (0-100) Spotify.', metricId: 'avg_popularity' },
  { title: 'Energía Promedio (2020s)', value: dataByDecade[dataByDecade.length - 1]?.avg_energy.toFixed(2) ?? 'N/A', change: dataByDecade.length > 1 ? `${(dataByDecade[dataByDecade.length - 1].avg_energy - dataByDecade[dataByDecade.length - 2].avg_energy).toFixed(2)} vs ${dataByDecade[dataByDecade.length - 2].decade}` : '', icon: Zap, trend: dataByDecade.length > 1 && (dataByDecade[dataByDecade.length - 1].avg_energy - dataByDecade[dataByDecade.length - 2].avg_energy) > 0 ? 'up' : 'down', description: 'Nivel de energía promedio (0-1).', metricId: 'avg_energy' },
  { title: 'Duración Promedio (2020s)', value: '3:25 min', change: '-10 seg vs 2010s', icon: Clock, trend: 'down', description: 'Duración promedio de las canciones.', metricId: 'avg_duration' },
];
// Mock Data para Hallazgos
const teamMembers = [
    { name: 'Jacobo', title: 'Desarrollador Web Frontend', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Member1' },
    { name: 'Lina G', title: 'Ingeniero de Datos', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Member2' },
    { name: 'Lina R', title: 'Desarrollador Web Front y Backend', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Member3' },
    { name: 'Juan', title: 'Pendiente UX/UI', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Member4' },
    { name: 'Luis', title: ' Pendiente', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Member5' },
];
const teamSocials = [
    { name: 'LinkedIn', icon: Linkedin, url: '#' }, { name: 'GitHub', icon: Github, url: '#' }, { name: 'Twitter', icon: Twitter, url: '#' }, { name: 'Facebook', icon: Facebook, url: '#' }, { name: 'Instagram', icon: Instagram, url: '#' },
];

// --- NUEVOS DATOS SIMULADOS ---
const loudnessByDecade = [
    { decade: '1980s', avg_loudness: -11.5 },
    { decade: '1990s', avg_loudness: -9.8 },
    { decade: '2000s', avg_loudness: -7.2 },
    { decade: '2010s', avg_loudness: -6.5 },
    { decade: '2020s', avg_loudness: -6.8 },
];
const explicitByDecade = [
    { decade: '1980s', percentage: 2.5, color: '#90E0EF' },
    { decade: '1990s', percentage: 8.0, color: '#0077B6' },
    { decade: '2000s', percentage: 15.0, color: '#005f99' },
    { decade: '2010s', percentage: 22.0, color: '#00FFFF' },
    { decade: '2020s', percentage: 25.0, color: '#48CA34' },
];
const topArtists = [
    { name: 'The Beatles', count: 120, color: '#00FFFF' },
    { name: 'Queen', count: 95, color: '#0077B6' },
    { name: 'Taylor Swift', count: 92, color: '#48CA34' },
    { name: 'Led Zeppelin', count: 88, color: '#90E0EF' },
    { name: 'Michael Jackson', count: 85, color: '#FF6B6B' },
];
const outlierSongs = [
    { title: 'La Más Larga', icon: Clock, value: '15:20 min', name: 'Song for My Father', artist: 'Horace Silver', color: 'text-blue-400' },
    { title: 'La Más Popular', icon: Star, value: '100 Pop.', name: 'Blinding Lights', artist: 'The Weeknd', color: 'text-yellow-400' },
    { title: 'La Más Triste (Baja Valencia)', icon: ThumbsDown, value: '0.05 Valencia', name: 'Someone You Loved', artist: 'Lewis Capaldi', color: 'text-gray-400' },
    { title: 'La Más Energética', icon: TrendingUp, value: '0.98 Energía', name: 'Smells Like Teen Spirit', artist: 'Nirvana', color: 'text-red-400' },
];


// --- UTILITIES ---
const getThemeClass = (isDark, darkClass, lightClass) => (isDark ? darkClass : lightClass);

const callGeminiApi = async (payload) => {
    const apiKey = ""; // Canvas proporcionará la clave API en tiempo de ejecución
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    let attempt = 0;
    const maxAttempts = 5;

    while (attempt < maxAttempts) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.status === 429) {
                const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                await new Promise(res => setTimeout(res, delay));
                attempt++;
                continue;
            }

            if (!response.ok) {
                const errorBody = await response.text();
                let errorDetails = errorBody;
                try {
                    const parsedError = JSON.parse(errorBody);
                    errorDetails = parsedError.error?.message || errorBody;
                } catch (e) { /* No era JSON */ }
                throw new Error(`API error ${response.status}: ${response.statusText}. Detalles: ${errorDetails}`);
            }

            const result = await response.json();
            const candidate = result.candidates?.[0];

            if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
                 if (candidate.finishReason === 'SAFETY') {
                     throw new Error("Contenido bloqueado por seguridad.");
                 } else {
                     throw new Error(`Generación incompleta: ${candidate.finishReason}`);
                 }
             }

            if (candidate?.content?.parts?.[0]?.text) {
                const text = candidate.content.parts[0].text;
                let sources = [];
                const groundingMetadata = candidate.groundingMetadata;
                if (groundingMetadata && groundingMetadata.groundingAttributions) {
                    sources = groundingMetadata.groundingAttributions
                        .map(attribution => ({ uri: attribution.web?.uri, title: attribution.web?.title }))
                        .filter(source => source.uri && source.title);
                }
                return { text, sources };
            }

            throw new Error("Respuesta inesperada o sin contenido.");

        } catch (error) {
            console.error(`Intento ${attempt + 1} fallido llamando a Gemini:`, error.message);
            if (attempt === maxAttempts - 1) {
                 throw new Error(`Error API Gemini tras ${maxAttempts} intentos: ${error.message}`);
             }
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
            await new Promise(res => setTimeout(res, delay));
            attempt++;
        }
    }
     throw new Error(`Se superó el máximo de reintentos (${maxAttempts}) para la API.`);
};

// Helper para formatear Tooltip de Pie Chart
const renderCustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Acceder a los datos originales anidados en payload[0].payload.payload
      const data = payload[0]?.payload?.payload;
      if (data) {
          return (
            <div className="custom-pie-tooltip">
              <p className="label">{`Rango Popularidad: ${data.range}`}</p>
              <p>{`Canciones: ${data.count.toLocaleString()}`}</p>
            </div>
          );
      }
    }
    return null;
  };

// Helper para renderizar gráficos con tema y onClick
const renderChartWithTheme = (chartElement, isDark, onBarClick) => {
    const tickColor = isDark ? '#A0AEC0' : '#4B5563';
    if (!React.isValidElement(chartElement) || !chartElement.props || !chartElement.props.children) {
        return chartElement;
    }
    try {
        return React.cloneElement(chartElement, {
         children: React.Children.map(chartElement.props.children, child => {
           if (!React.isValidElement(child)) return child;
           if (child.type === XAxis || child.type === YAxis) {
             return React.cloneElement(child, { tick: { fill: tickColor, fontSize: 11 } });
           }
            if (child.type === Tooltip) {
                if (child.props.content) { return React.cloneElement(child); }
                return React.cloneElement(child, {
                     contentStyle: { backgroundColor: 'var(--card-bg-color)', border: '1px solid var(--glass-border)', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }
                 });
             }
           // Lógica onClick para Bar
           if (child.type === Bar && onBarClick) {
               if (Array.isArray(child.props.children)) { // Si Bar tiene Cells como children
                   return React.cloneElement(child, {
                       children: child.props.children.map((cell, index) => {
                           if (React.isValidElement(cell) && cell.type === Cell) {
                               const dataPoint = child.props.data?.[index];
                               return React.cloneElement(cell, { key: `cell-${index}`, onClick: dataPoint ? () => onBarClick(dataPoint) : undefined, className: 'recharts-cell-cursor-pointer' });
                           }
                           return cell;
                       })
                   });
               } else { // Si Bar no tiene Cells (fill directo)
                   return React.cloneElement(child, { onClick: (data, index) => { if (onBarClick && data) { onBarClick(data.payload ?? data); } }, className: `${child.props.className || ''} recharts-bar-cursor-pointer`, });
               }
           }
            // Lógica onClick para Pie
            if (child.type === Pie && onBarClick) {
                 return React.cloneElement(child, {
                      onClick: (data, index) => { if (onBarClick && data) { onBarClick(data.payload.payload); } }, // data.payload.payload tiene los datos originales
                      // Asegurarse de que las Cells dentro del Pie tengan la clase cursor
                      children: React.Children.map(child.props.children, (pieChild) => {
                          if(React.isValidElement(pieChild) && pieChild.type === Cell) {
                              return React.cloneElement(pieChild, { className: 'recharts-cell-cursor-pointer' });
                          }
                          return pieChild;
                      })
                  });
            }
           return child;
         })
       });
    } catch (error) { console.error("Error cloning chart element:", error, chartElement); return chartElement; }
 };


// --- DASHBOARD COMPONENTS ---

// Logo
const MusicAnalyticsLogo = memo(({ isDark }) => (
  <div className="flex items-center gap-3 transform hover:scale-105 transition-transform duration-200 cursor-pointer h-8">
    <div className="flex items-center justify-center h-full" style={{ minWidth: '32px' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <defs>
            <linearGradient id="hexGradientOuter" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor={getThemeClass(isDark, '#0077B6', '#004D80')} />
              <stop offset="1" stopColor={getThemeClass(isDark, '#00FFFF', '#0077B6')} />
            </linearGradient>
            <linearGradient id="hexGradientInner" x1="12" y1="6.5" x2="12" y2="17.5" gradientUnits="userSpaceOnUse">
               <stop stopColor={getThemeClass(isDark, '#004D80', '#90E0EF')} />
               <stop offset="1" stopColor={getThemeClass(isDark, '#0077B6', '#CAF0F8')} />
            </linearGradient>
          </defs>
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="url(#hexGradientOuter)" stroke="var(--accent-color)" strokeWidth="1"/>
          <path d="M12 6.5L6.5 9.5V14.5L12 17.5L17.5 14.5V9.5L12 6.5Z" fill="url(#hexGradientInner)" stroke="var(--primary-color)" strokeWidth="0.5"/>
       </svg>
    </div>
    <div className={`h-full border-l ${getThemeClass(isDark, 'border-gray-600/50', 'border-gray-400/50')}`} style={{ height: '24px' }}></div>
    <div className="flex flex-col justify-center h-full">
        <span className="text-lg font-logo-text text-[var(--text-color)]">
          Music
        </span>
        <span className="text-lg font-logo-text mt-[-4px] text-[var(--text-color)]">
          Analytics
        </span>
    </div>
  </div>
));

// MetricCard
const MetricCard = memo(({ isDark, title, value, change, icon: Icon, trend, description, metricId }) => {
  const isUp = trend === 'up';
  const changeColorClass = isUp ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-[var(--text-muted)]';
  const IconComponent = Icon;
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalysis = useCallback(async () => {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    const userQuery = `Contexto: Analizando KPIs de la industria musical basados en datos hasta 2020. Métrica Específica: ${title} (${value}). Pregunta: Usando Google Search, proporciona un resumen conciso (máximo 3 frases en español) sobre la tendencia MÁS RECIENTE (post-2020) para ${title.toLowerCase()} en el mercado musical global. ¿Ha continuado la tendencia indicada por los datos de 2020 (${change}) o ha cambiado? Menciona brevemente la fuente principal si es posible.`;
    const payload = { contents: [{ parts: [{ text: userQuery }] }], tools: [{ "google_search": {} }], systemInstruction: { parts: [{ text: "Eres un analista experto en la industria musical. Tu respuesta debe ser concisa, estar en español y enfocarse en la tendencia global MÁS RECIENTE (posterior a 2020) de la métrica solicitada, usando información de Google Search." }] } };
    try {
        const { text, sources } = await callGeminiApi(payload);
        setAnalysisResult({ text, sources });
    } catch (err) {
        console.error("Gemini API Error en MetricCard:", err);
        setError(`Error al obtener análisis: ${err.message || 'Inténtalo de nuevo.'}`);
        setAnalysisResult(null);
    } finally {
        setIsLoading(false);
    }
  }, [value, title, change]);


  const cardClasses = `p-4 rounded-lg shadow-md border bg-[var(--card-bg-color)] border-[var(--glass-border)] hover:border-[var(--accent-color)] hover:shadow-lg hover:shadow-[var(--accent-color)]/10 transition-all duration-300 flex flex-col`;

  const loadingIndicator = (
    <div className="h-1 rounded-full overflow-hidden mt-2 bg-gray-300 dark:bg-gray-600">
        <div className={`h-full animate-pulse w-1/3 bg-[var(--accent-color)]`}></div>
    </div>
   );

   const ErrorDisplay = ({ message }) => (
    <div className="mt-2 p-2 rounded-lg bg-red-900/40 border border-red-500/50 text-red-300 text-xs font-body-sintony flex items-center gap-2">
       <AlertTriangle className="w-4 h-4 flex-shrink-0" />
       <span>{message}</span>
     </div>
  );


  return (
    <div className={cardClasses}>
       <div className="flex items-center justify-between"> <h3 className="text-sm font-body-sintony text-[var(--text-muted)] uppercase tracking-wider">{title}</h3> <IconComponent className={`w-5 h-5 text-[var(--accent-color)]`} /> </div>
      <div className="mt-2 flex flex-col sm:flex-row sm:items-end justify-between"> <p className={`text-3xl font-title-display text-[var(--primary-color)]`}> {value} </p> <div className="flex items-center mt-1 sm:mt-0"> <span className={`text-sm font-body-sintony ${changeColorClass}`}> {change} </span> {trend !== 'neutral' && (isUp ? <ArrowUp className={`w-4 h-4 ml-1 ${changeColorClass}`} /> : <ArrowDown className={`w-4 h-4 ml-1 ${changeColorClass}`} /> )} </div> </div>
      <p className="text-xs text-[var(--text-muted)] mt-1 font-body-sintony flex-grow">{description}</p>
      {metricId === 'global_streams' && (
        <div className="mt-3 border-t border-[var(--glass-border)] pt-2">
          <button onClick={fetchAnalysis} disabled={isLoading} className="w-full px-3 py-2 font-body-sintony rounded-lg shadow-sm inline-flex items-center justify-center gap-2 text-sm btn-glass" aria-live="polite">
             {isLoading ? (<> <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div> Analizando... </> )
               : error ? ( <> <AlertTriangle className="w-4 h-4 mr-1 text-red-400"/> Reintentar Análisis </> )
               : analysisResult ? ( <> <CheckCircle className="w-4 h-4 mr-1 text-green-400"/> Análisis Reciente </> )
               : ( <> <Zap className="w-4 h-4" /> Analizar Contexto </> )
             }
          </button>
          {isLoading && loadingIndicator} {error && !isLoading && <ErrorDisplay message={error} />}
          {analysisResult && !isLoading && !error && ( <div className={`mt-2 p-3 rounded-lg border bg-gray-100 dark:bg-gray-900/50 border-[var(--accent-color)]/20 animate-fadeInUp`}> <p className="text-xs text-[var(--text-color)] font-body-sintony italic">{analysisResult.text}</p> {analysisResult.sources?.length > 0 && ( <div className="mt-2 text-[10px] text-[var(--text-muted)] space-y-1"> <strong>Fuente(s):</strong> {analysisResult.sources.slice(0, 2).map((s, i) => ( <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="block underline hover:text-[var(--accent-color)] truncate" title={s.title}>{s.title || (s.uri ? new URL(s.uri).hostname : 'Fuente desconocida')}</a> ))} </div> )} </div> )}
        </div>
      )}
    </div>
  );
});

// ChartContainer
const ChartContainer = memo(({ isDark, title, children, className = '', onBarClick }) => {
  const cardClasses = `relative p-4 rounded-lg shadow-md border col-span-1 bg-[var(--card-bg-color)] border-[var(--glass-border)] hover:border-[var(--accent-color)] hover:shadow-lg hover:shadow-[var(--accent-color)]/10 transition-all duration-300 ${className}`;
  return (
    <div className={cardClasses}>
      <h2 className={`text-lg font-title-display text-[var(--text-color)] mb-4 border-b border-[var(--glass-border)] pb-2`}>{title}</h2>
       <span title="Opción (sin implementar)" className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--accent-color)] cursor-pointer opacity-50"> <Layers className="w-4 h-4"/> </span>
      <div className="h-[280px] md:h-[350px]">
          {React.isValidElement(children) ? renderChartWithTheme(children, isDark, onBarClick) : children}
       </div>
    </div>
  );
});

// --- NUEVO: HomeCarousel ---
const HomeCarousel = memo(({ isDark, setActiveTab }) => {
    const placeholderUrl = (width, height, text) => {
      const bgColor = isDark ? '1c2541' : 'e5e7eb';
      const textColor = isDark ? 'a0aec0' : '4b5563';
      return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
    };

    // Definición de los slides
    const slides = [
        {
            id: 'inicio',
            title: 'El Ritmo de los Datos Musicales',
            description: 'Tu viaje por la analítica musical (1980-2020) empieza aquí. Explora las tendencias, juega con los datos o conoce los hallazgos clave.',
            // CORRECCIÓN: Usar ruta pública
            imageSrc: 'Music hero 1.jpg', // Asume que está en /public/Music hero 1.jpg
            imageAlt: 'Visualización abstracta de analítica musical',
            buttonText: 'Explorar Datos',
            buttonIcon: BarChartHorizontalBig,
            onClick: () => setActiveTab('explorar')
        },
        {
            id: 'explorar',
            title: 'Popularidad y Energía por Década',
            description: 'Observa cómo la popularidad promedio ha subido y la energía ha fluctuado. Sumérgete en los gráficos completos en la sección "Explorar Datos".',
            imageSrc: placeholderUrl(800, 600, 'AI: Gráfico Popularidad'),
            imageAlt: 'Placeholder de gráfico de popularidad y energía',
            buttonText: 'Ver Gráficos',
            buttonIcon: TrendingUp,
            onClick: () => setActiveTab('explorar')
        },
        {
            id: 'hallazgos',
            title: 'Conclusiones y Hallazgos Clave',
            description: 'Descubre los "outliers", los artistas más frecuentes y las conclusiones principales de nuestro análisis de 40 años de música.',
            imageSrc: placeholderUrl(800, 600, 'AI: Hallazgos Clave'),
            imageAlt: 'Placeholder de visualización de hallazgos',
            buttonText: 'Ver Hallazgos',
            buttonIcon: Layers,
            onClick: () => setActiveTab('lab') // 'lab' es el id de Hallazgos
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const goToSlide = useCallback((index) => {
        setCurrentSlide((index + slides.length) % slides.length);
    }, [slides.length]);

    const goToNext = useCallback(() => {
        goToSlide(currentSlide + 1);
    }, [currentSlide, goToSlide]);

    // Timer para auto-avance
    useEffect(() => {
        const intervalId = setInterval(goToNext, 6000); // 6 segundos por slide
        return () => clearInterval(intervalId);
    }, [goToNext]);

    const currentSlideData = slides[currentSlide];

     return (
        <div className={`relative w-full max-w-7xl mx-auto rounded-xl shadow-2xl overflow-hidden ${getThemeClass(isDark, 'bg-gray-900', 'bg-white')}`}>
            {/* Contenedor del Slide actual con animación fade */}
            <div key={currentSlide} className="animate-fadeIn" style={{animationDuration: '0.8s'}}>
                <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] md:min-h-[600px]">
                    {/* Columna Izquierda: Texto */}
                    <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 text-center md:text-left order-2 md:order-1">
                        <h1 className={`text-4xl lg:text-5xl font-title-display tracking-tight ${getThemeClass(isDark, 'text-white', 'text-gray-900')}`}>
                            {currentSlideData.title}
                        </h1>
                        <p className={`mt-6 text-lg leading-8 ${getThemeClass(isDark, 'text-gray-300', 'text-gray-600')} font-body-sintony`}>
                            {currentSlideData.description}
                        </p>
                        <div className="mt-10 flex items-center justify-center md:justify-start gap-x-6">
                            <button
                                onClick={currentSlideData.onClick}
                                className={`rounded-md px-4 py-3 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 flex items-center gap-2 ${getThemeClass(isDark, 'bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500', 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600')}`}
                            >
                                {React.createElement(currentSlideData.buttonIcon, {className: "w-5 h-5"})}
                                {currentSlideData.buttonText}
                            </button>
                        </div>
                    </div>
                    {/* Columna Derecha: Imagen */}
                    <div className="order-1 md:order-2">
                        <img
                            src={currentSlideData.imageSrc}
                            alt={currentSlideData.imageAlt}
                            className="w-full h-64 md:h-full object-cover md:min-h-[600px]"
                            onError={(e) => { e.target.onerror = null; e.target.src = placeholderUrl(800, 600, 'Error de Imagen'); }}
                        />
                    </div>
                </div>
            </div>

            {/* Controles de Navegación (Flechas eliminadas) */}

            {/* Indicadores de Puntos */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-[var(--accent-color)] scale-125 shadow-lg' : 'bg-gray-600/50 hover:bg-gray-400'}`}
                        aria-label={`Ir a slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
});


// --- NUEVOS COMPONENTES PARA HALLAZGOS ---
const TopArtistsChart = memo(({ isDark }) => {
    const tickColor = getThemeClass(isDark, '#A0AEC0', '#4B5563');
    return (
        <div className={`p-4 rounded-lg shadow-md border h-full ${getThemeClass(isDark, 'bg-[var(--card-bg-color)] border-[var(--glass-border)]', 'bg-white border-gray-200')}`}>
            <h3 className="text-lg font-title-display text-[var(--text-color)] mb-4">Top 5 Artistas (por Nro. Canciones)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topArtists} layout="vertical" margin={{ top: 0, right: 10, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={getThemeClass(isDark, '#374151', '#E5E7EB')} />
                    <XAxis type="number" tick={{ fill: tickColor, fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: tickColor, fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg-color)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                    <Bar dataKey="count" name="Canciones" radius={[0, 4, 4, 0]}>
                        {topArtists.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
});

const OutlierCards = memo(({ isDark }) => {
    return (
        <div className="space-y-4 h-full">
            <h3 className={`text-lg font-title-display text-[var(--text-color)] mb-4 px-4 ${getThemeClass(isDark, '', 'text-gray-900')}`}>Joyas Ocultas (Outliers)</h3>
            {outlierSongs.map((song) => {
                const Icon = song.icon;
                return (
                    <div key={song.title} className={`p-3 rounded-lg border flex items-center gap-4 ${getThemeClass(isDark, 'bg-[var(--card-bg-color)] border-[var(--glass-border)]', 'bg-white border-gray-200 shadow-sm')}`}>
                        <Icon className={`w-8 h-8 flex-shrink-0 ${song.color}`} />
                        <div>
                            <p className={`text-sm font-body-sintony ${getThemeClass(isDark, 'text-gray-400', 'text-gray-500')}`}>{song.title}: <span className={`font-semibold ${song.color}`}>{song.value}</span></p>
                            <p className={`text-base font-semibold font-body-sintony truncate ${getThemeClass(isDark, 'text-white', 'text-gray-800')}`} title={`${song.name} - ${song.artist}`}>
                                {song.name} - <span className="font-normal opacity-80">{song.artist}</span>
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
});


// --- COMPONENTES DE PÁGINAS COMPLETAS ---

// NUEVO: ExplorarDatosPage
const ExplorarDatosPage = memo(({ isDark }) => {
    const [selectedRange, setSelectedRange] = useState(null);
    const handlePieClick = (data) => { if (data && data.range) { setSelectedRange(data.range); } else { console.warn("onClick Pie inválido:", data); } };
    const tooltipLineContentStyle = { backgroundColor: 'var(--card-bg-color)', border: '1px solid var(--accent-color)', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
            <h1 className="text-3xl font-title-display text-[var(--text-color)]">Explorar Datos (1980 - 2020)</h1>
             {selectedRange && ( <div className={`p-3 rounded-md bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-sm text-center animate-fadeInUp flex justify-between items-center`}> <span>Seleccionado Rango Popularidad: <strong className="font-semibold">{selectedRange}</strong></span> <button onClick={() => setSelectedRange(null)} className="text-xs opacity-70 hover:opacity-100 bg-transparent border-none cursor-pointer p-1 leading-none rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]">(Limpiar)</button> </div> )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"> {kpiMetricsUpdated.map((metric, index) => ( <MetricCard key={index} {...metric} isDark={isDark} /> ))} </div>
            {/* Gráficos de Popularidad y Distribución */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ChartContainer title="Popularidad y Energía Promedio por Década" isDark={isDark}>
                     <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={dataByDecade} margin={{ top: 10, right: 30, left: 5, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke={getThemeClass(isDark, '#374151', '#E5E7EB')} />
                             <XAxis dataKey="decade" />
                             <YAxis yAxisId="left" label={{ value: 'Popularidad', angle: -90, position: 'insideLeft', fill: getThemeClass(isDark, '#A0AEC0', '#4B5563'), fontSize: 12 }}/>
                             <YAxis yAxisId="right" orientation="right" domain={[0, 1]} label={{ value: 'Energía', angle: -90, position: 'insideRight', fill: getThemeClass(isDark, '#A0AEC0', '#4B5563'), fontSize: 12 }} />
                             <Tooltip contentStyle={tooltipLineContentStyle} />
                             <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />
                             <Line yAxisId="left" type="monotone" dataKey="avg_popularity" name="Popularidad Prom." stroke="#00FFFF" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                             <Line yAxisId="right" type="monotone" dataKey="avg_energy" name="Energía Prom." stroke="#48CA34" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                         </LineChart>
                     </ResponsiveContainer>
                </ChartContainer>
                <ChartContainer title="Distribución de Popularidad (Click)" isDark={isDark} onBarClick={handlePieClick}>
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                         <Pie data={popularityDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={110} innerRadius={40} fill="#8884d8" dataKey="count" nameKey="range" >
                            {popularityDistribution.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.color} /> ))}
                         </Pie>
                          <RechartsTooltip content={renderCustomPieTooltip} />
                          <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
                     </PieChart>
                   </ResponsiveContainer>
                </ChartContainer>
            </div>
            {/* NUEVO: Gráficos de Loudness y Explícito */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ChartContainer title="La 'Guerra del Volumen' (Loudness Prom.)" isDark={isDark}>
                     <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={loudnessByDecade} margin={{ top: 10, right: 30, left: 5, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke={getThemeClass(isDark, '#374151', '#E5E7EB')} />
                             <XAxis dataKey="decade" />
                             <YAxis domain={[-14, -5]} label={{ value: 'Loudness (dB)', angle: -90, position: 'insideLeft', fill: getThemeClass(isDark, '#A0AEC0', '#4B5563'), fontSize: 12 }}/>
                             <Tooltip contentStyle={tooltipLineContentStyle} />
                             <Line type="monotone" dataKey="avg_loudness" name="Loudness Prom." stroke="#FF6B6B" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                         </LineChart>
                     </ResponsiveContainer>
                </ChartContainer>
                <ChartContainer title="Tendencia Contenido Explícito (%)" isDark={isDark}>
                   <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={explicitByDecade} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                           <CartesianGrid strokeDasharray="3 3" stroke={getThemeClass(isDark, '#374151', '#E5E7EB')} />
                           <XAxis dataKey="decade" />
                           <YAxis label={{ value: '% Explícito', angle: -90, position: 'insideLeft', fill: getThemeClass(isDark, '#A0AEC0', '#4B5563'), fontSize: 12 }}/>
                           <Tooltip formatter={(value) => `${value.toFixed(1)}%`} contentStyle={tooltipLineContentStyle} />
                           <Bar dataKey="percentage" name="% Explícito" radius={[4, 4, 0, 0]}>
                               {explicitByDecade.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                           </Bar>
                       </BarChart>
                   </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>
    );
});


// InicioPage (Ahora renderiza el nuevo carrusel)
const InicioPage = memo(({ isDark, setActiveTab }) => {
    return (
        // Centramos el carrusel en la página de inicio
        <div className="h-full overflow-y-auto custom-scrollbar flex items-center justify-center p-4 md:p-8">
             <HomeCarousel isDark={isDark} setActiveTab={setActiveTab} />
        </div>
    );
});


// InteractivePage
const InteractivePage = memo(({ isDark }) => {
    const [bailability, setBailability] = useState(0.70);
    const [duration, setDuration] = useState(3.5);
    const [decadeResult, setDecadeResult] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const discoverDecade = useCallback(() => {
        setIsLoading(true); setShowResult(false); setDecadeResult('');
        setTimeout(() => {
            const decadeAverages = {
                '1980s': { dance: 0.60, dur: 3.92 },
                '1990s': { dance: 0.64, dur: 4.05 },
                '2000s': { dance: 0.69, dur: 3.90 },
                '2010s': { dance: 0.71, dur: 3.77 },
                '2020s': { dance: 0.73, dur: 3.45 },
            };
            let bestMatch = '2010s'; let minDifference = Infinity;
            for (const decade in decadeAverages) {
                const avg = decadeAverages[decade]; const diffDance = Math.abs(bailability - avg.dance) * 1.5; const diffDur = Math.abs(duration - avg.dur); const totalDifference = diffDance + diffDur;
                if (totalDifference < minDifference) { minDifference = totalDifference; bestMatch = decade; }
            }
            let reasoning = `(${bestMatch === '2020s' ? 'canciones más cortas y bailables' : bestMatch === '1990s' ? 'canciones más largas' : 'una mezcla'}).`;
            setDecadeResult(`Tus preferencias (bailabilidad: ${bailability.toFixed(2)}, duración: ${duration.toFixed(1)} min) se asemejan más a la música de los **${bestMatch}** ${reasoning} ¡Prueba una playlist de esa época!`);
            setShowResult(true); setIsLoading(false);
        }, 600);
     }, [bailability, duration]);

    const cardClasses = `bg-[var(--card-bg-color)] border-[var(--glass-border)]`;
    const textClasses = 'text-[var(--text-color)]'; const labelClasses = 'text-[var(--text-muted)]'; const accentClasses = 'text-[var(--accent-color)]';

     return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 text-[var(--text-color)] h-full overflow-y-auto custom-scrollbar">
            <h1 className={`text-3xl font-title-display mb-4 ${textClasses}`}>¡A Jugar!</h1>
            <p className={`mb-8 font-body-sintony ${labelClasses}`}> Ajusta tus preferencias y descubre qué década musical podría gustarte más según los datos (1980-2020). </p>
            <div className={`${cardClasses} p-6 rounded-xl shadow-md border`}>
                <div className="flex items-center gap-3 mb-6"> <Sparkles className={`w-6 h-6 ${accentClasses}`} /> <h2 className={`text-xl font-title-display ${textClasses}`}>Descubre tu Década Musical</h2> </div>
                <div className="space-y-8">
                    {/* Sliders */}
                    <div>
                        <label htmlFor="bailabilityRange" className={`block text-sm font-body-sintony mb-2 ${labelClasses}`}> Nivel de Bailabilidad: <span className={`${accentClasses} font-semibold`}>{bailability.toFixed(2)}</span> </label>
                        <input id="bailabilityRange" type="range" min="0.4" max="0.9" step="0.01" value={bailability} onChange={(e) => setBailability(parseFloat(e.target.value))} className="w-full cursor-pointer" aria-label="Selector de Bailabilidad" />
                        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1"> <span>Menos Bailable (0.4)</span> <span>Más Bailable (0.9)</span> </div>
                    </div>
                    <div>
                         <label htmlFor="durationRange" className={`block text-sm font-body-sintony mb-2 ${labelClasses}`}> Duración Promedio (minutos): <span className={`${accentClasses} font-semibold`}>{duration.toFixed(1)} min</span> </label>
                         <input id="durationRange" type="range" min="2.5" max="4.5" step="0.1" value={duration} onChange={(e) => setDuration(parseFloat(e.target.value))} className="w-full cursor-pointer" aria-label="Selector de Duración" />
                        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1"> <span>Más Corta (2.5 min)</span> <span>Más Larga (4.5 min)</span> </div>
                    </div>
                    {/* Botón */}
                    <button onClick={discoverDecade} disabled={isLoading} className={`w-full px-5 py-3 font-body-sintony font-semibold rounded-lg shadow-sm inline-flex items-center justify-center gap-2 text-base btn-glass ${accentClasses} disabled:opacity-50 disabled:cursor-not-allowed`} aria-live="polite">
                        {isLoading ? ( <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div> ) : ( 'Descubrir Mi Década' )}
                    </button>
                    {/* Resultado */}
                    {showResult && !isLoading && ( <div className={`mt-6 p-4 rounded-lg text-center border-l-4 animate-fadeInUp ${getThemeClass(isDark, 'bg-gray-800/60 border-[var(--accent-color)]/80', 'bg-blue-50/90 border-[var(--accent-color)]/80')}`} style={{ animation: 'fade 0.5s ease-out' }} > <p className={`text-base font-body-sintony ${textClasses}`} dangerouslySetInnerHTML={{ __html: decadeResult.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--accent-color)]">$1</strong>') }} /> </div> )}
                </div>
            </div>
             <div className={`${cardClasses} p-6 rounded-xl shadow-md border mt-8 opacity-60`}> <h2 className={`text-xl font-title-display ${textClasses} mb-3`}>Próximamente...</h2> <p className={`font-body-sintony ${labelClasses}`}>Más herramientas interactivas.</p> </div>
        </div>
    );
});

// HallazgosPage (Actualizada)
const HallazgosPage = memo(({ isDark }) => {
    const textClasses = 'text-[var(--text-color)]'; const labelClasses = 'text-[var(--text-muted)]'; const cardClasses = `bg-[var(--card-bg-color)] border-[var(--glass-border)]`; const accentColor = isDark ? '#00FFFF' : '#0077B6';
    const findings = [ { title: 'Pico de Energía (2000s)', text: 'La energía promedio alcanzó su pico en los 2000s, antes de descender ligeramente.', color: '#00FFFF' }, { title: 'Popularidad en Auge (2010s-20s)', text: 'La popularidad promedio en Spotify muestra un crecimiento constante, especialmente post-2010.', color: '#0077B6' }, { title: 'Duración Estable (con picos)', text: 'Aunque con picos (90s), la duración tiende a disminuir post-2000.', color: '#48CA34' } ];
    const decades = dataByDecade.map((d, i) => ({ decade: d.decade, color: ['#00FFFF', '#0077B6', '#48CA34', '#90E0EF', '#FF6B6B'][i % 5], text: `Pop: ${d.avg_popularity.toFixed(1)}, Energía: ${d.avg_energy.toFixed(2)}` }));
    const conclusions = [ { title: '1. Auge de la Popularidad Digital', text: 'El crecimiento post-2000 refleja el impacto de plataformas digitales.', color: '#00FFFF' }, { title: '2. Energía y Ritmo Cambiantes', text: 'La energía musical fluctúa, posiblemente ligada a géneros dominantes por década.', color: '#0077B6' }, { title: '3. Adaptación al Streaming', text: 'La ligera tendencia a menor duración post-2000 podría indicar adaptación a nuevos formatos de consumo.', color: '#48CA34' } ];

     return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 h-full overflow-y-auto custom-scrollbar">
            <div> <h1 className={`text-3xl font-title-display mb-2 ${textClasses}`}>Hallazgos Clave & Equipo</h1> <p className={`mb-8 font-body-sintony ${labelClasses}`}> Resumen de tendencias (1980-2020) y las personas detrás del análisis. </p> </div>
            {/* Sección Hallazgos y Conclusiones */}
            <section className="space-y-6"> <h2 className={`text-2xl font-title-display mb-4 ${textClasses}`}>Principales Descubrimientos</h2> <div className="grid grid-cols-1 md:grid-cols-3 gap-5"> {findings.map(item => ( <div key={item.title} className={`p-5 rounded-lg border shadow-md ${cardClasses} transition-transform transform hover:scale-[1.03]`}> <h3 className={`text-lg font-title-display`} style={{ color: item.color }}>{item.title}</h3> <p className={`text-sm font-body-sintony ${labelClasses} mt-2`}>{item.text}</p> </div> ))} </div> <h2 className={`text-2xl font-title-display mb-4 mt-10 ${textClasses}`}>Resumen por Década</h2> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"> {decades.map(item => ( <div key={item.decade} className={`p-4 rounded-lg border shadow-sm ${cardClasses}`}> <h4 className={`text-xl font-title-display`} style={{ color: item.color }}>{item.decade}</h4> <p className={`text-sm font-body-sintony ${labelClasses} mt-1`}>{item.text}</p> </div> ))} </div> <h2 className={`text-2xl font-title-display mb-4 mt-10 ${textClasses}`}>Conclusiones del Análisis</h2> <div className="space-y-5"> {conclusions.map(item => ( <div key={item.title} className={`p-5 rounded-lg border-l-4 shadow ${cardClasses}`} style={{ borderColor: item.color }}> <h3 className={`text-lg font-title-display ${textClasses}`}>{item.title}</h3> <p className={`text-sm font-body-sintony ${labelClasses} mt-1 leading-relaxed`}>{item.text}</p> </div> ))} </div> </section>
            
            {/* NUEVO: Sección Artistas y Outliers */}
             <section className="mt-16">
                 <h2 className={`text-3xl font-title-display text-center mb-10 ${getThemeClass(isDark, 'text-white', 'text-gray-900')}`}>Datos Destacados</h2>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <TopArtistsChart isDark={isDark} />
                     <OutlierCards isDark={isDark} />
                 </div>
             </section>

            {/* Sección Equipo */}
            <section className="mt-16 text-center"> <h2 className={`text-3xl font-title-display mb-10 text-[var(--accent-color)] ${isDark ? 'logo-shadow-glow' : ''}`}> Integrantes del Proyecto </h2> <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8"> {teamMembers.map((member, index) => ( <div key={index} className={`flex flex-col items-center text-center p-4 rounded-lg border ${cardClasses} transition-shadow hover:shadow-xl hover:shadow-[var(--accent-color)]/15`}> <img src={member.avatar} alt={member.name} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/80x80/374151/E5E7EB?text=?'; }} className="w-20 h-20 rounded-full mb-4 border-2 object-cover" style={{ borderColor: accentColor }} /> <h4 className={`text-base font-title-display ${textClasses} font-semibold`}>{member.name}</h4> <p className={`text-xs font-body-sintony ${labelClasses} mt-1`}>{member.title}</p> </div> ))} </div> </section>
            
            {/* Sección Contacto */}
             <section className="mt-16 text-center bg-gradient-to-t from-[var(--card-bg-color)] to-transparent p-8 rounded-lg border-t border-[var(--glass-border)]" style={{ boxShadow: getThemeClass(isDark, '0 -10px 25px -15px rgba(0, 255, 255, 0.15)', '0 -10px 25px -15px rgba(0, 119, 182, 0.1)') }} > <h2 className={`text-2xl font-title-display mb-3 ${textClasses}`}>Contáctanos</h2> <p className={`mb-6 max-w-2xl mx-auto font-body-sintony ${labelClasses}`}> Conecta para colaboraciones, consultas o para hablar de música y datos. </p> <button className="px-6 py-3 font-body-sintony font-semibold rounded-lg shadow-sm inline-flex items-center gap-2 text-base btn-glass text-[var(--accent-color)] hover:scale-105 transition-transform"> <Send className="w-4 h-4" /> Enviar Mensaje </button> <div className="mt-8"> <h3 className="text-lg font-title-display mb-4 text-[var(--accent-color)]">Síguenos en Redes</h3> <div className="flex justify-center gap-6"> {teamSocials.map((social, index) => { const Icon = social.icon; return ( <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-all duration-200 transform hover:scale-125 hover:rotate-[-5deg]" aria-label={`Visitar ${social.name}`} title={social.name} > <Icon className="w-7 h-7" /> </a> ); })} </div> </div> </section>
        </div>
    );
});


// --- COMPONENTE PRINCIPAL APP ---
function App() {
  const [activeTab, setActiveTab] = useState('inicio'); // Inicia en 'inicio'
  const prefersDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDark, setIsDark] = useState(prefersDarkMode);

  useEffect(() => {
     const root = document.documentElement;
     root.classList.remove(isDark ? 'light' : 'dark');
     root.classList.add(isDark ? 'dark' : 'light');
     document.body.className = isDark ? 'dark' : 'light';
  }, [isDark]);

  // Navegación actualizada
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'explorar', label: 'Explorar Datos', icon: BarChartHorizontalBig },
    { id: 'interactive', label: 'Interactivo', icon: Sparkles },
    { id: 'lab', label: 'Hallazgos', icon: Layers },
  ];

  // Mapeo de componentes actualizado
  const pageComponents = {
      inicio: InicioPage,
      explorar: ExplorarDatosPage,
      interactive: InteractivePage,
      lab: HallazgosPage,
  };

  const CurrentPage = pageComponents[activeTab] || InicioPage; // Fallback a InicioPage


  return (
    <div className={`flex flex-col h-screen font-body-sintony bg-[var(--bg-color)] text-[var(--text-color)]`}>
       {/* Header */}
       <header aria-label="Navegación principal y controles" className={`sticky top-0 z-20 flex items-center justify-between p-4 border-b shadow-md backdrop-blur-lg ${getThemeClass(isDark, 'bg-[#0b132b]/85 border-gray-700/50', 'bg-white/85 border-gray-200/80')}`}>
        <button onClick={() => setActiveTab('inicio')} className="bg-transparent border-none p-0 cursor-pointer">
           <MusicAnalyticsLogo isDark={isDark} />
        </button>
        <nav role="navigation" aria-label="Secciones del dashboard" className="flex items-center space-x-1 sm:space-x-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-color)] focus:ring-[var(--accent-color)] ${
                activeTab === item.id
                  ? 'bg-[var(--accent-color)]/15 text-[var(--text-color)] shadow-inner shadow-[var(--accent-color)]/10'
                  : 'text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10'
              }`}
               title={item.label}
               aria-current={activeTab === item.id ? 'page' : undefined}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{item.label}</span>
               <span className="sr-only sm:hidden">{item.label}</span>
            </button>
          ))}
          <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 transition-colors duration-200 ml-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-color)] focus:ring-[var(--accent-color)]"
              aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
               title={isDark ? "Modo Claro" : "Modo Oscuro"}
          >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Main */}
       <main role="main" className="flex-grow overflow-hidden relative">
          <div key={activeTab} className="absolute inset-0 h-full animate-fadeInUp">
             {/* Pasar props necesarios */}
            <CurrentPage setActiveTab={setActiveTab} isDark={isDark} />
          </div>
       </main>

       {/* Footer */}
       <footer role="contentinfo" className={`flex-shrink-0 p-3 text-center text-xs border-t ${getThemeClass(isDark, 'bg-[#0b132b]/60 border-gray-700/40 text-gray-500', 'bg-gray-100/90 border-gray-200/90 text-gray-500')}`}>
         Music Analytics Dashboard © {new Date().getFullYear()} - Datos 1980-2020.
       </footer>
    </div>
  );
}

export default App;

