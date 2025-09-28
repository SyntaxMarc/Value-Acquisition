// translations.js - Language dictionary for the dashboard

const languageDictionary = {
    headerTitle: { en: 'Bases Loaded: EV Strategy Dashboard', es: 'Bases Llenas: Panel de Estrategia EV' },
    langSelectLabel: { en: 'Language:', es: 'Idioma:' },
    fetchDataBtn: { en: 'Fetch New Data', es: 'Obtener Nuevos Datos' },
    adminCodeLabel: { en: 'Admin Code for API Fetch:', es: 'Código de Admin para API:' },
    gamesHeader: { en: "Today's EV Games", es: 'Juegos EV de Hoy' },
    loadingMessage: { en: 'Loading EV data...', es: 'Cargando datos EV...' },
    noBestPlay: { en: 'Analyzing for best play...', es: 'Analizando la mejor apuesta...' },

    // Game Card Labels
    oddsLabel: { en: 'Odds', es: 'Cuota' },
    evLabel: { en: 'EV', es: 'VE' },
    stakeLabel: { en: 'Stake', es: 'Apuesta' },
    lineupLabel: { en: 'Lineup', es: 'Alineación' },
    confidenceLabel: { en: 'Market Confidence', es: 'Confianza del Mercado' },
    buttonAdd: { en: 'Add to Portfolio', es: 'Añadir a Cartera' },
    buttonAdded: { en: 'ADDED', es: 'AÑADIDO' },
    
    // NEW PESO UNIT DEFINITION
    unitDefinition: { 
        en: '1 U = 1% of Bankroll (e.g., ₱50 if Bankroll is ₱5,000)', 
        es: '1 U = 1% del Capital (ej. ₱50 si el Capital es ₱5,000)' 
    },

    // Dynamic Messages
    impactfulLineup: { en: 'Impactful Change (Alert)', es: 'Cambio Impactante (Alerta)' },
    expectedLineup: { en: 'Expected (Normal)', es: 'Esperada (Normal)' },
    confidenceHigh: { en: 'High (Sharp)', es: 'Alta (Ajustada)' },
    confidenceMedium: { en: 'Medium (Standard)', es: 'Media (Estándar)' },
    confidenceLow: { en: 'Low (Soft)', es: 'Baja (Suave)' },

    // Calculator Labels and Verdicts
    manualCalcHeader: { en: 'Manual EV/Prop Calculator (0 API Cost)', es: 'Calculadora EV/Prop Manual (0 Costo API)' },
    manualCalcInstructions: { en: 'Use for Player Props or Alt Lines: Input Book Odds and Your Projected Probability.', es: 'Usar para Props o Líneas Alt: Ingrese Cuotas de Casa y Probabilidad Proyectada.' },
    oddsInputLabel: { en: 'Book Odds (Decimal, e.g., 2.10)', es: 'Cuotas de Casa (Decimal, ej. 2.10)' },
    probInputLabel: { en: 'Your Probability (%)', es: 'Tu Probabilidad (%)' },
    calculateBtn: { en: 'Calculate EV', es: 'Calcular EV' },
    evResultLabel: { en: 'EV:', es: 'VE:' },
    actionVerdictLabel: { en: 'Action:', es: 'Acción:' },
    verdictInput: { en: 'Enter Values', es: 'Ingrese Valores' },
    verdictAvoid: { en: 'Avoid (Negative/Low EV)', es: 'Evitar (EV Negativa/Baja)' },
    verdictMarginal: { en: 'Marginal Value (0.5 U)', es: 'Valor Marginal (0.5 U)' },
    verdictGoodValue: { en: 'Good Value Bet (1.0 U)', es: 'Buena Apuesta de Valor (1.0 U)' },
    verdictStrongBuy: { en: 'Strong Buy (2.0+ U)', es: 'Compra Fuerte (2.0+ U)' }
};
