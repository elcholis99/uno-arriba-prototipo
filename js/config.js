/**
 * CONFIGURACIÓN GLOBAL Y VARIABLES DE PLACEHOLDER - UNO ARRIBA
 * 
 * Modifique los valores de este archivo para actualizar la información de contacto,
 * links de pago de Mercado Pago, mapa y catálogo de canchas / buffet.
 */

// ==========================================
// 1. DATOS DE CONTACTO Y REDES
// ==========================================
const WHATSAPP_COMPLEJO = "5491100000000"; // Reemplazar por número real (ej: 5491112345678)
const GOOGLE_MAPS_URL = "https://maps.google.com/?q=UNO+ARRIBA+Complejo+de+Canchas";
const GOOGLE_MAPS_EMBED_URL = "https://maps.google.com/maps?q=Buenos%20Aires%20Argentina&t=&z=15&ie=UTF8&iwloc=&output=embed";

const DIRECCION = "DIRECCIÓN_PENDIENTE";
const TELEFONO = "TELEFONO_PENDIENTE";
const INSTAGRAM_URL = "https://instagram.com/unoarriba_canchas";

// ==========================================
// 2. LINKS DE MERCADO PAGO POR CANCHA
// ==========================================
const MERCADO_PAGO_LINK_CANCHA_1 = "https://mpago.la/pos/cancha1";
const MERCADO_PAGO_LINK_CANCHA_2 = "https://mpago.la/pos/cancha2";
const MERCADO_PAGO_LINK_CANCHA_3 = "https://mpago.la/pos/cancha3";
const MERCADO_PAGO_LINK_CANCHA_4 = "https://mpago.la/pos/cancha4";
const MERCADO_PAGO_LINK_CANCHA_5 = "https://mpago.la/pos/cancha5";

// Mapa de referencia de links de Mercado Pago
const PAYMENT_LINKS = {
    1: MERCADO_PAGO_LINK_CANCHA_1,
    2: MERCADO_PAGO_LINK_CANCHA_2,
    3: MERCADO_PAGO_LINK_CANCHA_3,
    4: MERCADO_PAGO_LINK_CANCHA_4,
    5: MERCADO_PAGO_LINK_CANCHA_5
};

// ==========================================
// 3. CATALOGO DE CANCHAS
// ==========================================
const COURTS_DATA = [
    {
        id: 1,
        name: "Cancha 1",
        category: "Fútbol 5",
        price: 26000,
        formattedPrice: "$26.000",
        image: "assets/images/cancha_f5.svg",
        description: "Césped sintético premium de última generación. Iluminación LED pro.",
        paymentLinkKey: "MERCADO_PAGO_LINK_CANCHA_1"
    },
    {
        id: 2,
        name: "Cancha 2",
        category: "Fútbol 5",
        price: 26000,
        formattedPrice: "$26.000",
        image: "assets/images/cancha_f5.svg",
        description: "Superficie de alto rendimiento, ideal para partidos rápidos y técnicos.",
        paymentLinkKey: "MERCADO_PAGO_LINK_CANCHA_2"
    },
    {
        id: 3,
        name: "Cancha 3",
        category: "Fútbol 6",
        price: 30000,
        formattedPrice: "$30.000",
        image: "assets/images/cancha_f5.svg",
        description: "Medidas amplias para 6 vs 6, excelente rebote de pelota y drenaje.",
        paymentLinkKey: "MERCADO_PAGO_LINK_CANCHA_3"
    },
    {
        id: 4,
        name: "Cancha 4",
        category: "Fútbol 7",
        price: 36000,
        formattedPrice: "$36.000",
        image: "assets/images/cancha_f7.svg",
        description: "Cancha de 7 jugadores, dimensiones oficiales para partidos de torneo.",
        paymentLinkKey: "MERCADO_PAGO_LINK_CANCHA_4"
    },
    {
        id: 5,
        name: "Cancha 5",
        category: "Fútbol 7",
        price: 36000,
        formattedPrice: "$36.000",
        image: "assets/images/cancha_f7.svg",
        description: "Cancha pro de Fútbol 7 con iluminación de alta potencia y red perimetral.",
        paymentLinkKey: "MERCADO_PAGO_LINK_CANCHA_5"
    }
];

// ==========================================
// 4. CARTA DIGITAL DEL BUFFET
// ==========================================
const BUFFET_DATA = {
    drinks: [
        { name: "Cerveza Tirada / Lata 473ml", price: "$X.XXX", formattedPrice: "$3.500", image: "assets/images/buffet_drink.svg" },
        { name: "Gaseosa 500ml", price: "$X.XXX", formattedPrice: "$2.000", image: "assets/images/buffet_drink.svg" },
        { name: "Agua Mineral / Isotónica", price: "$X.XXX", formattedPrice: "$1.800", image: "assets/images/buffet_drink.svg" }
    ],
    food: [
        { name: "Hamburguesa Completa con Papas", price: "$X.XXX", formattedPrice: "$7.500", image: "assets/images/buffet_food.svg" },
        { name: "Choripán Criollo Especial", price: "$X.XXX", formattedPrice: "$4.500", image: "assets/images/buffet_food.svg" },
        { name: "Pizza Mozzarella Grande", price: "$X.XXX", formattedPrice: "$8.000", image: "assets/images/buffet_food.svg" }
    ]
};

// Horarios predeterminados diarios (16:00 a 23:00 hs)
const TIME_SLOTS = [
    { start: "16:00", end: "17:00", label: "16:00 - 17:00 hs" },
    { start: "17:00", end: "18:00", label: "17:00 - 18:00 hs" },
    { start: "18:00", end: "19:00", label: "18:00 - 19:00 hs" },
    { start: "19:00", end: "20:00", label: "19:00 - 20:00 hs" },
    { start: "20:00", end: "21:00", label: "20:00 - 21:00 hs" },
    { start: "21:00", end: "22:00", label: "21:00 - 22:00 hs" },
    { start: "22:00", end: "23:00", label: "22:00 - 23:00 hs" }
];
