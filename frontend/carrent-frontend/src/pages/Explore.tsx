import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Car, Waves, Mountain, Building2, Utensils, Hotel, Hospital, Fuel,
  ShoppingBag, TreePine, Camera, Heart, Share2, QrCode, MessageCircle, X, Star,
  Landmark, Clock, Phone, DollarSign, Compass, Plus, Bookmark, Shield, Sparkles,
  Sun, Cloud, Droplets, AlertTriangle, Bike, Music, Briefcase, Navigation, Train, Bus,
  Church, Moon, Flower, Apple, Coffee, Film, Gamepad, Dumbbell, Footprints,
  Bird, Fish, Leaf, Ship, Umbrella, Sunset, Anchor, Volume2, VolumeX, Play, Pause,
  Thermometer, Wifi, Battery, Smartphone, Tablet, Laptop, Watch, Headphones, Mic,
  Video, Image, FileText, Folder, Archive, Trash2, Edit, Settings, User, LogOut,
  HelpCircle, Info, AlertCircle, CheckCircle, XCircle, ChevronDown, ChevronUp,
  ArrowLeft, ArrowRight, Move, ZoomIn, ZoomOut, Maximize, Minimize, RotateCw,
  RefreshCw, Copy, Clipboard, Download, Upload, Save, Printer, EyeOff, Lock, Unlock,
  Key, Fingerprint, Bell, BellOff, MessageSquare, Mail, Send, Inbox, BookOpen, Tag,
  Hash, AtSign, Percent, Divide, Equal, Minus, Slash, Asterisk, Circle, Square, Triangle,
  Calendar, Stethoscope, Ambulance, Pill, Syringe, Bandage, HeartPulse, GlassWater,
  PartyPopper, Music4, Film as FilmIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

// Import Leaflet for free maps (no API key needed)
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

type Place = {
  id: number;
  name: string;
  category: string;
  area: string;
  description: string;
  image: string;
  distance: number;
  rating: number;
  openingHours?: string;
  phone?: string;
  price?: number;
  bestTime?: string;
  address: string;
  tips?: string;
  whatToWear?: string;
  entryFee?: number;
  parking?: string;
  wheelchair?: boolean;
  lat: number;
  lng: number;
  website?: string;
  email?: string;
};

// ==================== DISTRICT EMERGENCY CONTACTS ====================
const districtEmergencies = [
  { district: "Port Louis", police: "999", hospital: "Wellkin +230 605 1000", fire: "115", ambulance: "114" },
  { district: "Plaines Wilhems", police: "999", hospital: "Apollo Bramwell +230 605 2000", fire: "115", ambulance: "114" },
  { district: "Moka", police: "999", hospital: "Wellkin +230 605 1000", fire: "115", ambulance: "114" },
  { district: "Flacq", police: "999", hospital: "Flacq Hospital +230 413 2000", fire: "115", ambulance: "114" },
  { district: "Grand Port", police: "999", hospital: "Mahebourg Hospital +230 631 2000", fire: "115", ambulance: "114" },
  { district: "Savanne", police: "999", hospital: "Souillac Hospital +230 625 2000", fire: "115", ambulance: "114" },
  { district: "Black River", police: "999", hospital: "Flic en Flac Clinic +230 453 2000", fire: "115", ambulance: "114" },
  { district: "Rivière du Rempart", police: "999", hospital: "Flacq Hospital +230 413 2000", fire: "115", ambulance: "114" },
  { district: "Pamplemousses", police: "999", hospital: "SSR National +230 206 1000", fire: "115", ambulance: "114" },
];

// ==================== MEDICAL CLINICS ====================
const medicalClinics = [
  { name: "Mediclinic Mauritius", area: "Moka", phone: "+230 605 1000", address: "Moka, Mauritius", emergency: true, lat: -20.234, lng: 57.501 },
  { name: "Apollo Bramwell Hospital", area: "Moka", phone: "+230 605 2000", address: "Moka, Mauritius", emergency: true, lat: -20.231, lng: 57.498 },
  { name: "SSR National Hospital", area: "Pamplemousses", phone: "+230 206 1000", address: "Pamplemousses, Mauritius", emergency: true, lat: -20.098, lng: 57.563 },
  { name: "Victoria Hospital", area: "Quatre Bornes", phone: "+230 404 5000", address: "Quatre Bornes, Mauritius", emergency: true, lat: -20.268, lng: 57.478 },
  { name: "Flacq Hospital", area: "Flacq", phone: "+230 413 2000", address: "Flacq, Mauritius", emergency: true, lat: -20.231, lng: 57.723 },
  { name: "Jeetoo Hospital", area: "Port Louis", phone: "+230 212 3201", address: "Port Louis, Mauritius", emergency: true, lat: -20.168, lng: 57.502 },
  { name: "Mahebourg Hospital", area: "Mahebourg", phone: "+230 631 2000", address: "Mahebourg, Mauritius", emergency: true, lat: -20.407, lng: 57.702 },
  { name: "Souillac Hospital", area: "Souillac", phone: "+230 625 2000", address: "Souillac, Mauritius", emergency: true, lat: -20.516, lng: 57.518 },
  { name: "Wellkin Hospital", area: "Moka", phone: "+230 605 1000", address: "Moka, Mauritius", emergency: true, lat: -20.233, lng: 57.500 },
  { name: "City Clinic", area: "Port Louis", phone: "+230 210 1234", address: "Port Louis, Mauritius", emergency: false, lat: -20.166, lng: 57.504 },
];

// ==================== LOCAL MARKETS ====================
const localMarkets = [
  { name: "Port Louis Central Market", area: "Port Louis", days: "Everyday except Sunday", hours: "05:00-17:00", specialty: "Fruits, vegetables, spices, souvenirs", lat: -20.166, lng: 57.505 },
  { name: "Quatre Bornes Market", area: "Quatre Bornes", days: "Thursday and Sunday", hours: "06:00-15:00", specialty: "Fresh produce, textiles, local crafts", lat: -20.268, lng: 57.478 },
  { name: "Flacq Market", area: "Flacq", days: "Sunday", hours: "06:00-16:00", specialty: "Largest market, everything available", lat: -20.231, lng: 57.723 },
  { name: "Curepipe Market", area: "Curepipe", days: "Monday-Saturday", hours: "07:00-17:00", specialty: "Vegetables, fruits, meat, fish", lat: -20.317, lng: 57.520 },
  { name: "Mahebourg Market", area: "Mahebourg", days: "Monday-Saturday", hours: "06:00-15:00", specialty: "Seafood, local products", lat: -20.407, lng: 57.702 },
];

// ==================== RELIGIOUS PLACES - NO BEER/ALCOHOL ====================
const religiousPlaces = [
  { name: "Jummah Mosque", type: "Mosque", area: "Port Louis", description: "Beautiful mosque built in 1850s, Islamic architecture", hours: "09:00-17:00", dressCode: "Conservative, head covering for women", lat: -20.165, lng: 57.506 },
  { name: "Ganga Talao", type: "Hindu Temple", area: "Grand Bassin", description: "Sacred lake, important pilgrimage site for Maha Shivaratri. One of the most sacred Hindu sites in Mauritius.", hours: "24/7", dressCode: "Conservative, remove shoes near temples", lat: -20.417, lng: 57.489 },
  { name: "St Louis Cathedral", type: "Catholic Church", area: "Port Louis", description: "Historic Catholic cathedral in the heart of Port Louis", hours: "08:00-17:00", dressCode: "Respectful, no shorts", lat: -20.164, lng: 57.504 },
  { name: "Marie Reine de la Paix", type: "Catholic Church", area: "Curepipe", description: "Iconic church with panoramic city views", hours: "07:00-19:00", dressCode: "Modest attire", lat: -20.315, lng: 57.518 },
  { name: "Tamil Surya Oudaya Sangam", type: "Hindu Temple", area: "Quatre Bornes", description: "South Indian style temple", hours: "06:00-20:00", dressCode: "Conservative", lat: -20.266, lng: 57.476 },
  { name: "Mahadev Temple", type: "Hindu Temple", area: "Ganga Talao", description: "Main Shiva temple at Ganga Talao sacred site", hours: "24/7", dressCode: "Conservative, remove shoes", lat: -20.418, lng: 57.488 },
  { name: "St Joseph's Church", type: "Catholic Church", area: "Curepipe", description: "Beautiful church in Curepipe city center", hours: "08:00-18:00", dressCode: "Respectful attire", lat: -20.316, lng: 57.519 },
  { name: "Notre Dame de Lourdes", type: "Catholic Church", area: "Curepipe", description: "Historic church in central Curepipe", hours: "07:00-19:00", dressCode: "Modest", lat: -20.318, lng: 57.521 },
];

// ==================== NIGHTLIFE PLACES ====================
const nightlifePlaces = [
  { name: "Big Willy's", type: "Bar & Club", area: "Grand Baie", description: "Popular nightclub with international DJs", hours: "22:00-06:00", lat: -20.017, lng: 57.578, address: "Grand Baie, Mauritius" },
  { name: "Banana Beach Club", type: "Club", area: "Grand Baie", description: "Beachfront nightclub", hours: "21:00-05:00", lat: -20.015, lng: 57.580, address: "Grand Baie, Mauritius" },
  { name: "Le Suffren", type: "Lounge Bar", area: "Port Louis", description: "Elegant lounge with harbor views", hours: "17:00-02:00", lat: -20.160, lng: 57.505, address: "Port Louis, Mauritius" },
  { name: "La Rhumerie", type: "Bar", area: "Grand Baie", description: "Rum bar with live music", hours: "18:00-02:00", lat: -20.018, lng: 57.579, address: "Grand Baie, Mauritius" },
  { name: "The Roof", type: "Rooftop Bar", area: "Grand Baie", description: "Rooftop bar with panoramic views", hours: "17:00-01:00", lat: -20.016, lng: 57.577, address: "Grand Baie, Mauritius" },
  { name: "Shooters Bar", type: "Sports Bar", area: "Grand Baie", description: "Sports bar with big screens", hours: "12:00-03:00", lat: -20.019, lng: 57.581, address: "Grand Baie, Mauritius" },
  { name: "La Canne à Sucre", type: "Lounge Bar", area: "Flic en Flac", description: "Beachfront lounge bar", hours: "16:00-00:00", lat: -20.285, lng: 57.368, address: "Flic en Flac, Mauritius" },
  { name: "The Beach Club", type: "Club", area: "Flic en Flac", description: "Beach club with DJs", hours: "20:00-04:00", lat: -20.283, lng: 57.366, address: "Flic en Flac, Mauritius" },
  { name: "Sunset Lounge", type: "Lounge", area: "Tamarin", description: "Sunset views with cocktails", hours: "16:00-00:00", lat: -20.325, lng: 57.378, address: "Tamarin, Mauritius" },
  { name: "Le Barachois", type: "Bar", area: "Port Louis", description: "Waterfront bar", hours: "12:00-23:00", lat: -20.158, lng: 57.503, address: "Port Louis, Mauritius" },
];

// ==================== PUBLIC HOLIDAYS ====================
const publicHolidays = [
  { name: "New Year's Day", date: "January 1", type: "Public" },
  { name: "Thaipoosam Cavadee", date: "January/February", type: "Tamil" },
  { name: "Chinese Spring Festival", date: "January/February", type: "Chinese" },
  { name: "Maha Shivaratri", date: "February/March", type: "Hindu" },
  { name: "Independence Day", date: "March 12", type: "National" },
  { name: "Ugadi", date: "March/April", type: "Telugu" },
  { name: "Eid-Ul-Fitr", date: "Variable", type: "Muslim" },
  { name: "Labour Day", date: "May 1", type: "Public" },
  { name: "Ganesh Chaturthi", date: "August/September", type: "Hindu" },
  { name: "Diwali", date: "October/November", type: "Hindu" },
  { name: "Christmas Day", date: "December 25", type: "Christian" },
];

// ==================== COMPLETE MAURITIUS PLACES ====================
const places: Place[] = [
  // BEACHES
  { id: 1, name: "Le Morne Beach", category: "beach", area: "South West", description: "UNESCO World Heritage site with stunning lagoon and mountain backdrop. Famous for kitesurfing.", image: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=600", distance: 56, rating: 4.9, openingHours: "24/7", price: 0, bestTime: "April-December", address: "Le Morne, Mauritius", tips: "Bring sunscreen, kite surfing gear available for rent", whatToWear: "Swimwear, hat, sunglasses", parking: "Free parking available", lat: -20.443, lng: 57.325 },
  { id: 2, name: "Flic en Flac Beach", category: "beach", area: "West", description: "Beautiful white sand beach with calm turquoise waters and spectacular sunsets.", image: "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?w=600", distance: 48, rating: 4.8, openingHours: "24/7", price: 0, bestTime: "May-November", address: "Flic en Flac, Mauritius", tips: "Great for families, sunset views amazing", parking: "Free", lat: -20.285, lng: 57.368 },
  { id: 3, name: "Belle Mare Beach", category: "beach", area: "East", description: "Long stretch of white sand, perfect for walking, swimming, and water sports.", image: "https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?w=600", distance: 63, rating: 4.7, openingHours: "24/7", price: 0, address: "Belle Mare, Mauritius", tips: "Water sports available, luxury resorts nearby", parking: "Free", lat: -20.185, lng: 57.775 },
  { id: 4, name: "Grand Baie Beach", category: "beach", area: "North", description: "Popular beach with restaurants, shops, nightlife and water sports.", image: "https://images.pexels.com/photos/2577277/pexels-photo-2577277.jpeg?w=600", distance: 72, rating: 4.6, openingHours: "24/7", price: 0, address: "Grand Baie, Mauritius", tips: "Nightlife hub, many restaurants", parking: "Paid parking available", lat: -20.017, lng: 57.580 },
  { id: 5, name: "Trou aux Biches", category: "beach", area: "North West", description: "Family-friendly beach with shallow calm waters, ideal for children.", image: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?w=600", distance: 65, rating: 4.7, openingHours: "24/7", price: 0, address: "Trou aux Biches, Mauritius", tips: "Very safe for children", parking: "Free", lat: -20.045, lng: 57.545 },
  { id: 6, name: "Blue Bay Beach", category: "beach", area: "South East", description: "Marine park with excellent snorkeling and glass-bottom boat tours.", image: "https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg?w=600", distance: 48, rating: 4.8, openingHours: "24/7", price: 0, bestTime: "September-December", address: "Blue Bay, Mauritius", tips: "Bring snorkel gear, entry fee for marine park", entryFee: 200, parking: "Free", lat: -20.455, lng: 57.706 },
  { id: 7, name: "Pereybere Beach", category: "beach", area: "North", description: "Small sandy beach with good snorkeling and local restaurants nearby.", image: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?w=600", distance: 70, rating: 4.5, openingHours: "24/7", price: 0, address: "Pereybere, Mauritius", tips: "Local food nearby", parking: "Free", lat: -20.029, lng: 57.595 },
  { id: 8, name: "Mont Choisy Beach", category: "beach", area: "North", description: "Long white sand beach with calm waters, popular with locals.", image: "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?w=600", distance: 68, rating: 4.6, openingHours: "24/7", price: 0, address: "Mont Choisy, Mauritius", tips: "Less crowded weekdays", parking: "Free", lat: -20.035, lng: 57.556 },
  { id: 9, name: "Tamarin Beach", category: "beach", area: "West", description: "Surfer's paradise with consistent waves and black sand.", image: "https://images.pexels.com/photos/457881/pexels-photo-457881.jpeg?w=600", distance: 52, rating: 4.5, openingHours: "24/7", price: 0, bestTime: "June-August", address: "Tamarin, Mauritius", tips: "Experienced surfers only", parking: "Free", lat: -20.325, lng: 57.378 },
  { id: 10, name: "Palmar Beach", category: "beach", area: "East", description: "Beautiful white sand beach lined with casuarina trees.", image: "https://images.pexels.com/photos/2980785/pexels-photo-2980785.jpeg?w=600", distance: 64, rating: 4.6, openingHours: "24/7", price: 0, address: "Palmar, Mauritius", tips: "Luxury resorts nearby", parking: "Free", lat: -20.200, lng: 57.780 },
  { id: 11, name: "Pointe d'Esny", category: "beach", area: "South East", description: "Calm lagoon with excellent snorkeling opportunities.", image: "https://images.pexels.com/photos/2872295/pexels-photo-2872295.jpeg?w=600", distance: 49, rating: 4.5, openingHours: "24/7", price: 0, address: "Pointe d'Esny, Mauritius", tips: "Bring snorkel mask", parking: "Free", lat: -20.435, lng: 57.715 },
  { id: 12, name: "Poste Lafayette", category: "beach", area: "East", description: "Secluded beach with natural beauty and coral reefs.", image: "https://images.pexels.com/photos/2161448/pexels-photo-2161448.jpeg?w=600", distance: 66, rating: 4.4, openingHours: "24/7", price: 0, address: "Poste Lafayette, Mauritius", tips: "Quiet and peaceful", parking: "Free", lat: -20.178, lng: 57.800 },
  { id: 13, name: "St Felix Beach", category: "beach", area: "South", description: "Wild beach with dramatic cliffs and big waves.", image: "https://images.pexels.com/photos/2611870/pexels-photo-2611870.jpeg?w=600", distance: 58, rating: 4.3, openingHours: "24/7", price: 0, address: "St Felix, Mauritius", tips: "Not for swimming, great views", parking: "Free", lat: -20.485, lng: 57.550 },
  { id: 14, name: "La Cuvette Beach", category: "beach", area: "Grand Baie", description: "Small sheltered beach with clear waters, perfect for families.", image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=600", distance: 71, rating: 4.4, openingHours: "24/7", price: 0, address: "Grand Baie, Mauritius", tips: "Shaded areas available", parking: "Free", lat: -20.010, lng: 57.575 },
  { id: 15, name: "La Preneuse Beach", category: "beach", area: "West", description: "Historic beach with old French cannon and beautiful sunsets.", image: "https://images.pexels.com/photos/1624492/pexels-photo-1624492.jpeg?w=600", distance: 50, rating: 4.4, openingHours: "24/7", price: 0, address: "Black River, Mauritius", tips: "Historical cannon on beach", parking: "Free", lat: -20.345, lng: 57.375 },
  { id: 16, name: "Rivière Noire Beach", category: "beach", area: "West", description: "Black sand beach, famous for dolphin watching tours.", image: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=600", distance: 51, rating: 4.5, openingHours: "24/7", price: 0, bestTime: "Morning", address: "Black River, Mauritius", tips: "Dolphin tours available", parking: "Free", lat: -20.360, lng: 57.370 },
  { id: 17, name: "Cap Malheureux", category: "beach", area: "North", description: "Famous red-roofed church beach with stunning views.", image: "https://images.pexels.com/photos/2577277/pexels-photo-2577277.jpeg?w=600", distance: 73, rating: 4.6, openingHours: "24/7", price: 0, address: "Cap Malheureux, Mauritius", tips: "Photo opportunity at church", parking: "Free", lat: -20.000, lng: 57.615 },
  { id: 18, name: "Pointe aux Canonniers", category: "beach", area: "North", description: "Quiet beach with calm waters, ideal for swimming.", image: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?w=600", distance: 70, rating: 4.3, openingHours: "24/7", price: 0, address: "Pointe aux Canonniers, Mauritius", tips: "Local restaurants nearby", parking: "Free", lat: -20.015, lng: 57.585 },
  { id: 19, name: "Anse la Raie", category: "beach", area: "North", description: "Secluded beach, popular for kitesurfing.", image: "https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?w=600", distance: 74, rating: 4.4, openingHours: "24/7", price: 0, bestTime: "June-September", address: "Anse la Raie, Mauritius", tips: "Kitesurfing school nearby", parking: "Free", lat: -20.005, lng: 57.630 },
  { id: 20, name: "Bain des Dames", category: "beach", area: "Port Louis", description: "Popular local beach near capital.", image: "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?w=600", distance: 46, rating: 4.0, openingHours: "24/7", price: 0, address: "Port Louis, Mauritius", tips: "Close to city", parking: "Limited", lat: -20.155, lng: 57.500 },

  // MOUNTAINS & HIKING
  { id: 21, name: "Le Morne Brabant", category: "mountain", area: "South West", description: "UNESCO World Heritage mountain with slavery history and breathtaking views. Challenging hike.", image: "https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg?w=600", distance: 56, rating: 4.9, openingHours: "06:00-16:00", price: 0, bestTime: "Early morning", address: "Le Morne, Mauritius", tips: "Hiking boots required, guided tour recommended", whatToWear: "Hiking boots, long pants, hat, sunscreen", parking: "Free", lat: -20.450, lng: 57.320 },
  { id: 22, name: "Pieter Both Mountain", category: "mountain", area: "Moka", description: "Second highest mountain with distinctive rock formation at peak.", image: "https://images.pexels.com/photos/3873862/pexels-photo-3873862.jpeg?w=600", distance: 45, rating: 4.6, openingHours: "24/7", price: 0, address: "Moka, Mauritius", tips: "Experienced climbers only", whatToWear: "Hiking gear", parking: "Free", lat: -20.200, lng: 57.500 },
  { id: 23, name: "Piton de la Petite Rivière Noire", category: "mountain", area: "Black River", description: "Highest mountain in Mauritius at 828m, challenging hike.", image: "https://images.pexels.com/photos/2233470/pexels-photo-2233470.jpeg?w=600", distance: 44, rating: 4.7, openingHours: "24/7", price: 0, address: "Black River, Mauritius", tips: "Guide recommended", whatToWear: "Proper hiking shoes", parking: "Free", lat: -20.390, lng: 57.420 },
  { id: 24, name: "Black River Gorges", category: "nature", area: "South West", description: "National park with hiking trails, waterfalls and endemic wildlife.", image: "https://images.pexels.com/photos/3873862/pexels-photo-3873862.jpeg?w=600", distance: 43, rating: 4.8, openingHours: "06:00-18:00", price: 0, bestTime: "May-October", address: "Black River, Mauritius", tips: "Wear hiking shoes, bring water", parking: "Free", lat: -20.400, lng: 57.400 },
  { id: 25, name: "Chamarel Waterfall", category: "nature", area: "South West", description: "Stunning 100m waterfall in lush jungle setting.", image: "https://images.pexels.com/photos/13255681/pexels-photo-13255681.jpeg?w=600", distance: 47, rating: 4.8, openingHours: "09:00-17:00", price: 250, address: "Chamarel, Mauritius", tips: "Combine with Seven Colored Earths", entryFee: 250, parking: "Free", lat: -20.430, lng: 57.370 },
  { id: 26, name: "Seven Colored Earths", category: "nature", area: "Chamarel", description: "Unique geological formation with colored sand dunes in Chamarel, Mauritius.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Seven_Coloured_Earths%2C_Chamarel%2C_Mauritius.jpg/640px-Seven_Coloured_Earths%2C_Chamarel%2C_Mauritius.jpg", distance: 48, rating: 4.7, openingHours: "09:00-17:00", price: 250, address: "Chamarel, Mauritius", tips: "Best viewed in sunlight", entryFee: 250, parking: "Free", lat: -20.435, lng: 57.365 },  { id: 27, name: "SSR Botanical Garden", category: "garden", area: "Pamplemousses", description: "Historic garden with giant water lilies and giant tortoises.", image: "https://images.pexels.com/photos/147688/pexels-photo-147688.jpeg?w=600", distance: 58, rating: 4.6, openingHours: "08:30-17:30", price: 200, address: "Pamplemousses, Mauritius", tips: "Arrive early to avoid heat", entryFee: 200, parking: "Free", lat: -20.100, lng: 57.560 },
  { id: 28, name: "La Vallée des Couleurs", category: "nature", area: "South", description: "Nature park with 23 colored earth, waterfalls and zip lines.", image: "https://images.pexels.com/photos/1192550/pexels-photo-1192550.jpeg?w=600", distance: 52, rating: 4.5, openingHours: "09:00-17:00", price: 300, address: "South Mauritius", tips: "Try the zip line", entryFee: 300, parking: "Free", lat: -20.470, lng: 57.570 },
  { id: 29, name: "Ebony Forest", category: "nature", area: "South West", description: "Protected forest with endangered ebony trees and pink pigeons.", image: "https://images.pexels.com/photos/164338/pexels-photo-164338.jpeg?w=600", distance: 54, rating: 4.6, openingHours: "09:00-17:00", price: 350, address: "Chamarel, Mauritius", tips: "Spot the pink pigeon", entryFee: 350, parking: "Free", lat: -20.440, lng: 57.380 },
  { id: 30, name: "Gris Gris Beach", category: "nature", area: "South", description: "Dramatic cliffs and wild waves, spectacular views.", image: "https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?w=600", distance: 55, rating: 4.5, openingHours: "24/7", price: 0, address: "Souillac, Mauritius", tips: "Great photo opportunities", parking: "Free", lat: -20.520, lng: 57.520 },
  { id: 31, name: "Rochester Falls", category: "nature", area: "South", description: "Waterfall with unique rectangular rock formations.", image: "https://images.pexels.com/photos/13255681/pexels-photo-13255681.jpeg?w=600", distance: 51, rating: 4.3, openingHours: "24/7", price: 0, address: "Souillac, Mauritius", tips: "Off the beaten path", parking: "Free", lat: -20.510, lng: 57.530 },
  { id: 32, name: "Domaine de l'Etoile", category: "nature", area: "East", description: "Nature reserve with quad biking, horse riding and zip lines.", image: "https://images.pexels.com/photos/2639593/pexels-photo-2639593.jpeg?w=600", distance: 62, rating: 4.4, openingHours: "09:00-17:00", price: 500, address: "East Mauritius", tips: "Quad biking adventure", entryFee: 500, parking: "Free", lat: -20.230, lng: 57.720 },
  { id: 33, name: "Ile aux Aigrettes", category: "nature", area: "South East", description: "Nature reserve with rare endemic species.", image: "https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg?w=600", distance: 49, rating: 4.7, openingHours: "09:00-16:00", price: 600, address: "Mahebourg, Mauritius", entryFee: 600, parking: "Free", lat: -20.420, lng: 57.710 },
  { id: 34, name: "Ferney Valley", category: "nature", area: "East", description: "Wildlife reserve with hiking and endemic birds.", image: "https://images.pexels.com/photos/164338/pexels-photo-164338.jpeg?w=600", distance: 50, rating: 4.5, openingHours: "08:00-16:00", price: 400, address: "Ferney, Mauritius", entryFee: 400, parking: "Free", lat: -20.240, lng: 57.740 },
  { id: 35, name: "Trou aux Cerfs", category: "nature", area: "Curepipe", description: "Dormant volcano crater with panoramic views.", image: "https://images.pexels.com/photos/3873862/pexels-photo-3873862.jpeg?w=600", distance: 45, rating: 4.6, openingHours: "24/7", price: 0, address: "Curepipe, Mauritius", tips: "Great views of the city", parking: "Free", lat: -20.320, lng: 57.520 },

  // MONUMENTS & HISTORIC
  { id: 36, name: "Aapravasi Ghat", category: "monument", area: "Port Louis", description: "UNESCO World Heritage immigration depot.", image: "https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?w=600", distance: 47, rating: 4.5, openingHours: "09:00-16:00", price: 0, address: "Port Louis, Mauritius", tips: "Free entry", parking: "Limited", lat: -20.162, lng: 57.505 },
  { id: 37, name: "Citadel Fort Adelaide", category: "monument", area: "Port Louis", description: "19th-century fort with panoramic city views.", image: "https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?w=600", distance: 47, rating: 4.4, openingHours: "09:00-17:00", price: 0, address: "Port Louis, Mauritius", tips: "Best at sunset", parking: "Limited", lat: -20.158, lng: 57.503 },
  { id: 38, name: "Eureka House", category: "monument", area: "Moka", description: "Colonial Creole mansion museum.", image: "https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?w=600", distance: 41, rating: 4.4, openingHours: "09:00-17:00", price: 350, address: "Moka, Mauritius", entryFee: 350, parking: "Free", lat: -20.220, lng: 57.495 },
  { id: 39, name: "Martello Towers", category: "monument", area: "Rivière Noire", description: "Historic fortifications from British colonial era.", image: "https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?w=600", distance: 52, rating: 4.2, openingHours: "09:00-16:00", price: 150, address: "Rivière Noire, Mauritius", entryFee: 150, parking: "Free", lat: -20.350, lng: 57.365 },
  { id: 40, name: "Ganga Talao", category: "religious", area: "Savanne", description: "Sacred lake and important Hindu pilgrimage site. One of the holiest places in Mauritius.", image: "/ganga-talao.jpg", distance: 58, rating: 4.7, openingHours: "24/7", price: 0, address: "Grand Bassin, Mauritius", tips: "Visit during Maha Shivaratri for the festival", whatToWear: "Conservative dress, remove shoes near temples", parking: "Free", lat: -20.417, lng: 57.489 },  { id: 43, name: "L'aventure du Sucre", category: "monument", area: "Pamplemousses", description: "Sugar museum in former factory.", image: "https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?w=600", distance: 57, rating: 4.5, openingHours: "09:00-17:00", price: 300, address: "Pamplemousses, Mauritius", entryFee: 300, parking: "Free", lat: -20.095, lng: 57.565 },
  { id: 44, name: "Domaine des Aubineaux", category: "monument", area: "Curepipe", description: "Colonial house turned museum with tea tasting.", image: "https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?w=600", distance: 45, rating: 4.3, openingHours: "09:30-16:30", price: 250, address: "Curepipe, Mauritius", entryFee: 250, parking: "Free", lat: -20.315, lng: 57.515 },

  // CITIES
  { id: 45, name: "Port Louis", category: "city", area: "Capital", description: "Capital with Caudan Waterfront, Central Market and historic sites.", image: "https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg?w=600", distance: 47, rating: 4.4, openingHours: "24/7", price: 0, address: "Port Louis, Mauritius", tips: "Visit Central Market on Saturday", parking: "Paid parking available", lat: -20.165, lng: 57.505 },
  { id: 46, name: "Curepipe", category: "city", area: "Plaines Wilhems", description: "Central town with gardens and colonial architecture.", image: "https://images.pexels.com/photos/1662132/pexels-photo-1662132.jpeg?w=600", distance: 45, rating: 4.3, openingHours: "24/7", price: 0, address: "Curepipe, Mauritius", parking: "Free", lat: -20.317, lng: 57.520 },
  { id: 47, name: "Quatre Bornes", category: "city", area: "Plaines Wilhems", description: "Known for its famous covered market.", image: "https://images.pexels.com/photos/1662132/pexels-photo-1662132.jpeg?w=600", distance: 43, rating: 4.2, openingHours: "24/7", price: 0, address: "Quatre Bornes, Mauritius", tips: "Famous market on Thursdays and Sundays", parking: "Free", lat: -20.268, lng: 57.478 },
  { id: 48, name: "Moka", category: "city", area: "Moka", description: "Smart city with shopping malls and business centers.", image: "https://images.pexels.com/photos/1662132/pexels-photo-1662132.jpeg?w=600", distance: 40, rating: 4.3, openingHours: "24/7", price: 0, address: "Moka, Mauritius", parking: "Free", lat: -20.230, lng: 57.500 },
  { id: 49, name: "Mahebourg", category: "city", area: "Grand Port", description: "Historical town with Naval Museum and waterfront.", image: "https://images.pexels.com/photos/1662132/pexels-photo-1662132.jpeg?w=600", distance: 48, rating: 4.3, openingHours: "24/7", price: 0, address: "Mahebourg, Mauritius", parking: "Free", lat: -20.407, lng: 57.702 },
  { id: 50, name: "Grand Baie", category: "city", area: "North", description: "Tourist hub with beaches, restaurants and nightlife.", image: "https://images.pexels.com/photos/2577277/pexels-photo-2577277.jpeg?w=600", distance: 72, rating: 4.5, openingHours: "24/7", price: 0, address: "Grand Baie, Mauritius", parking: "Paid", lat: -20.017, lng: 57.580 },
  { id: 51, name: "Flacq", category: "city", area: "East", description: "Known for its large open-air market every Sunday.", image: "https://images.pexels.com/photos/1662132/pexels-photo-1662132.jpeg?w=600", distance: 58, rating: 4.1, address: "Flacq, Mauritius", parking: "Free", lat: -20.231, lng: 57.723 },
  { id: 52, name: "Pamplemousses", category: "city", area: "North", description: "Home to SSR Botanical Garden.", image: "https://images.pexels.com/photos/1662132/pexels-photo-1662132.jpeg?w=600", distance: 58, rating: 4.2, address: "Pamplemousses, Mauritius", parking: "Free", lat: -20.100, lng: 57.560 },

  // RESTAURANTS
  { id: 53, name: "The Beach House", category: "restaurant", area: "Grand Baie", description: "Seafood restaurant with ocean views.", image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?w=600", distance: 72, rating: 4.7, openingHours: "12:00-23:00", phone: "+230 263 9999", address: "Grand Baie, Mauritius", price: 800, lat: -20.015, lng: 57.578 },
  { id: 54, name: "Le Chamarel", category: "restaurant", area: "Chamarel", description: "Fine dining with panoramic views.", image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?w=600", distance: 48, rating: 4.6, openingHours: "12:00-22:00", address: "Chamarel, Mauritius", price: 1200, lat: -20.430, lng: 57.375 },
  { id: 55, name: "Escale Creole", category: "restaurant", area: "Mahebourg", description: "Authentic Mauritian Creole cuisine.", image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=600", distance: 48, rating: 4.5, openingHours: "11:00-21:00", address: "Mahebourg, Mauritius", price: 500, lat: -20.405, lng: 57.700 },
  { id: 56, name: "Happy Rajah", category: "restaurant", area: "Curepipe", description: "Famous Indian restaurant.", image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=600", distance: 45, rating: 4.5, openingHours: "11:30-22:00", address: "Curepipe, Mauritius", price: 600, lat: -20.316, lng: 57.518 },
  { id: 57, name: "La Jonque", category: "restaurant", area: "Port Louis", description: "Authentic Chinese cuisine.", image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=600", distance: 47, rating: 4.4, openingHours: "11:30-22:00", address: "Port Louis, Mauritius", price: 700, lat: -20.163, lng: 57.504 },
  { id: 58, name: "La Table du Château", category: "restaurant", area: "Moka", description: "Gourmet restaurant in colonial setting.", image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?w=600", distance: 41, rating: 4.6, openingHours: "12:00-22:00", address: "Moka, Mauritius", price: 1000, lat: -20.228, lng: 57.498 },
  { id: 59, name: "Saffron Grill", category: "restaurant", area: "Grand Baie", description: "Indian fine dining.", image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=600", distance: 72, rating: 4.5, openingHours: "18:00-22:30", address: "Grand Baie, Mauritius", price: 900, lat: -20.018, lng: 57.582 },

  // HOTELS
  { id: 60, name: "LUX Grand Gaube", category: "hotel", area: "Grand Gaube", description: "Luxury beachfront resort with overwater spa.", image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=600", distance: 75, rating: 4.9, price: 15000, address: "Grand Gaube, Mauritius", lat: -20.015, lng: 57.660 },
  { id: 61, name: "Constance Belle Mare", category: "hotel", area: "Belle Mare", description: "Premium resort with golf course.", image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=600", distance: 63, rating: 4.8, price: 18000, address: "Belle Mare, Mauritius", lat: -20.185, lng: 57.775 },
  { id: 62, name: "Maritim Resort", category: "hotel", area: "Balaclava", description: "Luxury resort with spa and gardens.", image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=600", distance: 60, rating: 4.7, price: 14000, address: "Balaclava, Mauritius", lat: -20.060, lng: 57.545 },
  { id: 63, name: "Heritage Le Telfair", category: "hotel", area: "Bel Ombre", description: "Elegant colonial-style resort.", image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=600", distance: 68, rating: 4.8, price: 20000, address: "Bel Ombre, Mauritius", lat: -20.500, lng: 57.450 },
  { id: 64, name: "Shangri-La Touessrok", category: "hotel", area: "Trou d'Eau Douce", description: "Ultra-luxury resort.", image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=600", distance: 65, rating: 4.9, price: 25000, address: "Trou d'Eau Douce, Mauritius", lat: -20.240, lng: 57.780 },
  { id: 65, name: "Westin Turtle Bay", category: "hotel", area: "Balaclava", description: "Luxury beach resort.", image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=600", distance: 60, rating: 4.7, price: 16000, address: "Balaclava, Mauritius", lat: -20.062, lng: 57.543 },

  // HOSPITALS
  { id: 66, name: "Wellkin Hospital", category: "hospital", area: "Moka", description: "Modern private hospital.", image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=600", distance: 42, rating: 4.3, openingHours: "24/7", phone: "+230 605 1000", address: "Moka, Mauritius", lat: -20.234, lng: 57.501 },
  { id: 67, name: "Apollo Bramwell", category: "hospital", area: "Moka", description: "International standard hospital.", image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=600", distance: 42, rating: 4.4, openingHours: "24/7", phone: "+230 605 2000", address: "Moka, Mauritius", lat: -20.231, lng: 57.498 },
  { id: 68, name: "SSR National Hospital", category: "hospital", area: "Pamplemousses", description: "Public national hospital.", image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=600", distance: 55, rating: 3.8, openingHours: "24/7", phone: "+230 206 1000", address: "Pamplemousses, Mauritius", lat: -20.098, lng: 57.563 },
  { id: 69, name: "Victoria Hospital", category: "hospital", area: "Quatre Bornes", description: "Public hospital.", image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=600", distance: 44, rating: 3.9, openingHours: "24/7", phone: "+230 404 5000", address: "Quatre Bornes, Mauritius", lat: -20.268, lng: 57.478 },

  // FUEL STATIONS - ALL MAURITIUS
  { id: 70, name: "TotalEnergies Airport", category: "fuel", area: "Plaine Magnien", description: "Fuel station near SSR Airport.", image: "https://images.pexels.com/photos/1231119/pexels-photo-1231119.jpeg?w=600", distance: 3, rating: 4.2, openingHours: "24/7", address: "Plaine Magnien, Mauritius", lat: -20.435, lng: 57.660 },
  { id: 71, name: "Shell Airport", category: "fuel", area: "Plaine Magnien", description: "Shell station near airport.", image: "https://images.pexels.com/photos/1231119/pexels-photo-1231119.jpeg?w=600", distance: 3.5, rating: 4.1, openingHours: "24/7", address: "Plaine Magnien, Mauritius", lat: -20.438, lng: 57.665 },
  { id: 72, name: "TotalEnergies Phoenix", category: "fuel", area: "Phoenix", description: "Fuel station on M1 highway.", image: "https://images.pexels.com/photos/1231119/pexels-photo-1231119.jpeg?w=600", distance: 43, rating: 4.2, openingHours: "24/7", address: "Phoenix, Mauritius", lat: -20.280, lng: 57.470 },
  { id: 73, name: "Vivo Energy Grand Baie", category: "fuel", area: "Grand Baie", description: "Fuel station in tourist area.", image: "https://images.pexels.com/photos/1231119/pexels-photo-1231119.jpeg?w=600", distance: 71, rating: 4.1, openingHours: "24/7", address: "Grand Baie, Mauritius", lat: -20.015, lng: 57.578 },
  { id: 74, name: "Shell Curepipe", category: "fuel", area: "Curepipe", description: "Fuel station central Curepipe.", image: "https://images.pexels.com/photos/1231119/pexels-photo-1231119.jpeg?w=600", distance: 45, rating: 4.1, openingHours: "24/7", address: "Curepipe, Mauritius", lat: -20.315, lng: 57.518 },
  { id: 75, name: "TotalEnergies Port Louis", category: "fuel", area: "Port Louis", description: "Fuel station in capital.", image: "https://images.pexels.com/photos/1231119/pexels-photo-1231119.jpeg?w=600", distance: 47, rating: 4.0, openingHours: "24/7", address: "Port Louis, Mauritius", lat: -20.165, lng: 57.505 },
  { id: 76, name: "Shell Flic en Flac", category: "fuel", area: "Flic en Flac", description: "Fuel station near beach.", image: "https://images.plexels.com/photos/1231119/pexels-photo-1231119.jpeg?w=600", distance: 48, rating: 4.0, openingHours: "24/7", address: "Flic en Flac, Mauritius", lat: -20.285, lng: 57.370 },
  { id: 77, name: "TotalEnergies Mahebourg", category: "fuel", area: "Mahebourg", description: "Fuel station south east.", image: "https://images.pexels.com/photos/1231119/pexels-photo-1231119.jpeg?w=600", distance: 48, rating: 4.0, openingHours: "24/7", address: "Mahebourg, Mauritius", lat: -20.405, lng: 57.700 },
  { id: 78, name: "Shell Flacq", category: "fuel", area: "Flacq", description: "Fuel station in Flacq.", image: "https://images.pexels.com/photos/1231119/pexels-photo-1231119.jpeg?w=600", distance: 58, rating: 4.0, openingHours: "24/7", address: "Flacq, Mauritius", lat: -20.230, lng: 57.720 },
  { id: 79, name: "TotalEnergies Moka", category: "fuel", area: "Moka", description: "Fuel station in Moka.", image: "https://images.pexels.com/photos/1231119/pexels-photo-1231119.jpeg?w=600", distance: 40, rating: 4.1, openingHours: "24/7", address: "Moka, Mauritius", lat: -20.230, lng: 57.500 },

  // POLICE STATIONS
  { id: 80, name: "Central Police Station", category: "police", area: "Port Louis", description: "Main police headquarters.", image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=600", distance: 47, rating: 4.0, openingHours: "24/7", phone: "999", address: "Port Louis, Mauritius", lat: -20.163, lng: 57.504 },
  { id: 81, name: "Curepipe Police", category: "police", area: "Curepipe", description: "Police station central.", image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=600", distance: 45, rating: 4.0, openingHours: "24/7", phone: "999", address: "Curepipe, Mauritius", lat: -20.316, lng: 57.519 },
  { id: 82, name: "Airport Police", category: "police", area: "Plaine Magnien", description: "Police station near airport.", image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=600", distance: 2, rating: 4.0, openingHours: "24/7", phone: "999", address: "Plaine Magnien, Mauritius", lat: -20.433, lng: 57.658 },
  { id: 83, name: "Grand Baie Police", category: "police", area: "Grand Baie", description: "Police station tourist area.", image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=600", distance: 72, rating: 4.0, openingHours: "24/7", phone: "999", address: "Grand Baie, Mauritius", lat: -20.016, lng: 57.579 },

  // ACTIVITIES
  { id: 84, name: "Casela World of Adventures", category: "activities", area: "Cascavelle", description: "Theme park with safari and zip lines.", image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?w=600", distance: 45, rating: 4.7, openingHours: "09:00-17:00", price: 1500, address: "Cascavelle, Mauritius", lat: -20.280, lng: 57.420 },
  { id: 85, name: "Île aux Cerfs", category: "activities", area: "East", description: "Paradise island with water sports.", image: "https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg?w=600", distance: 62, rating: 4.8, openingHours: "09:00-17:00", price: 800, address: "East Mauritius", lat: -20.235, lng: 57.790 },
  { id: 86, name: "Scuba Diving Blue Bay", category: "activities", area: "South East", description: "Marine park diving.", image: "https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg?w=600", distance: 48, rating: 4.9, openingHours: "08:00-16:00", price: 2500, address: "Blue Bay, Mauritius", lat: -20.455, lng: 57.706 },
  { id: 87, name: "Kitesurfing Le Morne", category: "activities", area: "South West", description: "World-famous kitesurfing.", image: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=600", distance: 56, rating: 4.9, openingHours: "08:00-17:00", price: 1800, address: "Le Morne, Mauritius", lat: -20.443, lng: 57.325 },
  { id: 88, name: "Helicopter Tour", category: "activities", area: "All", description: "Aerial view of Mauritius.", image: "https://images.pexels.com/photos/1422548/pexels-photo-1422548.jpeg?w=600", distance: 5, rating: 4.9, openingHours: "08:00-16:00", price: 5000, address: "SSR Airport", lat: -20.430, lng: 57.660 },
  { id: 89, name: "Deep Sea Fishing", category: "activities", area: "West", description: "Big game fishing.", image: "https://images.pexels.com/photos/1249849/pexels-photo-1249849.jpeg?w=600", distance: 48, rating: 4.6, openingHours: "06:00-16:00", price: 4000, address: "Flic en Flac, Mauritius", lat: -20.285, lng: 57.368 },
  { id: 90, name: "Catamaran Cruise", category: "activities", area: "West", description: "Sunset catamaran trip.", image: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=600", distance: 48, rating: 4.8, openingHours: "09:00-17:00", price: 2000, address: "Flic en Flac, Mauritius", lat: -20.285, lng: 57.368 },
  { id: 91, name: "Dolphin Watching", category: "activities", area: "West", description: "Boat tour to see dolphins.", image: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=600", distance: 51, rating: 4.9, openingHours: "07:00-10:00", price: 1500, address: "Tamarin, Mauritius", lat: -20.325, lng: 57.378 },

  // NIGHTLIFE
  { id: 92, name: "Big Willy's", category: "nightlife", area: "Grand Baie", description: "Popular nightclub with international DJs and great atmosphere.", image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?w=600", distance: 72, rating: 4.6, openingHours: "22:00-06:00", address: "Grand Baie, Mauritius", price: 500, lat: -20.017, lng: 57.578 },
  { id: 93, name: "Banana Beach Club", category: "nightlife", area: "Grand Baie", description: "Beachfront nightclub with live music and cocktails.", image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?w=600", distance: 72, rating: 4.5, openingHours: "21:00-05:00", address: "Grand Baie, Mauritius", price: 400, lat: -20.015, lng: 57.580 },
  { id: 94, name: "Le Suffren", category: "nightlife", area: "Port Louis", description: "Elegant lounge bar with harbor views and premium drinks.", image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?w=600", distance: 47, rating: 4.4, openingHours: "17:00-02:00", address: "Port Louis, Mauritius", price: 600, lat: -20.160, lng: 57.505 },
  { id: 95, name: "La Rhumerie", category: "nightlife", area: "Grand Baie", description: "Rum bar with live music and local spirits.", image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?w=600", distance: 72, rating: 4.5, openingHours: "18:00-02:00", address: "Grand Baie, Mauritius", price: 450, lat: -20.018, lng: 57.579 },
  { id: 96, name: "The Roof", category: "nightlife", area: "Grand Baie", description: "Rooftop bar with panoramic ocean views.", image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?w=600", distance: 72, rating: 4.7, openingHours: "17:00-01:00", address: "Grand Baie, Mauritius", price: 550, lat: -20.016, lng: 57.577 },
  { id: 97, name: "Shooters Bar", category: "nightlife", area: "Grand Baie", description: "Sports bar with big screens and pub food.", image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?w=600", distance: 72, rating: 4.3, openingHours: "12:00-03:00", address: "Grand Baie, Mauritius", price: 350, lat: -20.019, lng: 57.581 },
  { id: 98, name: "La Canne à Sucre", category: "nightlife", area: "Flic en Flac", description: "Beachfront lounge bar with sunset views.", image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?w=600", distance: 48, rating: 4.4, openingHours: "16:00-00:00", address: "Flic en Flac, Mauritius", price: 400, lat: -20.285, lng: 57.368 },
  { id: 99, name: "The Beach Club", category: "nightlife", area: "Flic en Flac", description: "Beach club with DJs and dancing.", image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?w=600", distance: 48, rating: 4.5, openingHours: "20:00-04:00", address: "Flic en Flac, Mauritius", price: 500, lat: -20.283, lng: 57.366 },
  { id: 100, name: "Sunset Lounge", category: "nightlife", area: "Tamarin", description: "Lounge bar with spectacular sunset views.", image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?w=600", distance: 52, rating: 4.6, openingHours: "16:00-00:00", address: "Tamarin, Mauritius", price: 450, lat: -20.325, lng: 57.378 },
];

const categories = [
  { id: "all", label: "All", icon: MapPin },
  { id: "beach", label: "Beaches", icon: Waves },
  { id: "mountain", label: "Mountains & Hiking", icon: Mountain },
  { id: "nature", label: "Nature & Gardens", icon: TreePine },
  { id: "monument", label: "Monuments & History", icon: Landmark },
  { id: "city", label: "Cities & Towns", icon: Building2 },
  { id: "restaurant", label: "Restaurants", icon: Utensils },
  { id: "hotel", label: "Hotels", icon: Hotel },
  { id: "hospital", label: "Hospitals & Clinics", icon: Hospital },
  { id: "fuel", label: "Fuel Stations", icon: Fuel },
  { id: "activities", label: "Activities", icon: Bike },
  { id: "police", label: "Police", icon: Shield },
  { id: "religious", label: "Religious Sites", icon: Church },
  { id: "market", label: "Local Markets", icon: ShoppingBag },
  { id: "nightlife", label: "Nightlife", icon: PartyPopper },
];

// Emergency Sidebar
function EmergencySidebar() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 border-2 border-red-200">
      <h3 className="font-black text-black flex items-center gap-2 text-sm mb-3"><AlertTriangle className="w-4 h-4 text-red-600" />Emergency Contacts</h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-red-100 rounded-xl p-2 text-center border border-red-300"><div className="font-bold text-red-700">Police</div><div className="text-lg font-black text-red-800">999</div></div>
        <div className="bg-red-100 rounded-xl p-2 text-center border border-red-300"><div className="font-bold text-red-700">Ambulance</div><div className="text-lg font-black text-red-800">114</div></div>
        <div className="bg-red-100 rounded-xl p-2 text-center border border-red-300"><div className="font-bold text-red-700">Fire</div><div className="text-lg font-black text-red-800">115</div></div>
        <div className="bg-red-100 rounded-xl p-2 text-center border border-red-300"><div className="font-bold text-red-700">SAMU</div><div className="text-lg font-black text-red-800">112</div></div>
        <div className="bg-blue-100 rounded-xl p-2 text-center col-span-2 border border-blue-300"><div className="font-bold text-blue-700">Tourist Helpline</div><div className="text-lg font-black text-blue-800">8910</div></div>
      </div>
      <button onClick={() => setExpanded(!expanded)} className="text-xs text-blue-700 font-bold mt-2 w-full text-center hover:underline">{expanded ? "Show Less" : "Show All Districts"}</button>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-300">
          <h4 className="font-bold text-xs text-black mb-2">District Police Stations:</h4>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-black">
            {districtEmergencies.map((d, i) => (
              <div key={i} className="flex justify-between bg-gray-50 p-1 rounded"><span className="font-medium">{d.district}:</span><span className="font-bold text-red-700">999</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WeatherWidget() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 border border-blue-200">
      <h3 className="font-black text-black mb-3 flex items-center gap-2 text-sm"><Sun className="w-4 h-4 text-yellow-500" />Mauritius Weather</h3>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-yellow-50 rounded-xl p-2 border border-yellow-200"><Sun className="w-5 h-5 mx-auto text-yellow-500 mb-1" /><div className="font-bold text-black">28°C</div><div className="text-black">Summer (Nov-Apr)</div></div>
        <div className="bg-blue-50 rounded-xl p-2 border border-blue-200"><Cloud className="w-5 h-5 mx-auto text-blue-500 mb-1" /><div className="font-bold text-black">22°C</div><div className="text-black">Winter (May-Oct)</div></div>
        <div className="bg-cyan-50 rounded-xl p-2 border border-cyan-200"><Droplets className="w-5 h-5 mx-auto text-cyan-500 mb-1" /><div className="font-bold text-black">70%</div><div className="text-black">Humidity</div></div>
      </div>
      <p className="text-xs text-center text-black mt-2">☀️ Best time to visit: May - December (cool and dry)</p>
      <p className="text-xs text-center text-gray-600 mt-1">🌧️ Cyclone season: January - March</p>
    </div>
  );
}

function PublicHolidaysWidget() {
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 border border-purple-200">
      <h3 className="font-black text-black mb-3 flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-purple-500" />Public Holidays 2025</h3>
      <div className="space-y-1 text-xs text-black">
        {(showAll ? publicHolidays : publicHolidays.slice(0, 6)).map((holiday, i) => (
          <div key={i} className="flex justify-between border-b border-gray-100 py-1"><span className="font-medium">{holiday.name}</span><span className="text-gray-600">{holiday.date}</span></div>
        ))}
      </div>
      <button onClick={() => setShowAll(!showAll)} className="text-xs text-blue-700 font-bold mt-2 hover:underline">{showAll ? "Show Less" : "Show All 11 Holidays"}</button>
    </div>
  );
}

function LocalMarketWidget() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 border border-green-200">
      <h3 className="font-black text-black mb-3 flex items-center gap-2 text-sm"><ShoppingBag className="w-4 h-4 text-green-500" />Local Markets</h3>
      <div className="space-y-2 max-h-48 overflow-auto text-black">
        {localMarkets.map((market, i) => (
          <div key={i} className="text-xs border-b border-gray-200 pb-2">
            <div className="font-bold text-black">{market.name}</div>
            <div className="text-gray-700">{market.days} • {market.hours}</div>
            <div className="text-gray-600">{market.specialty}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReligiousSitesWidget() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 border border-amber-200">
      <h3 className="font-black text-black mb-3 flex items-center gap-2 text-sm"><Church className="w-4 h-4 text-amber-500" />Religious Sites</h3>
      <div className="space-y-2 max-h-48 overflow-auto text-black">
        {religiousPlaces.map((site, i) => (
          <div key={i} className="text-xs border-b border-gray-200 pb-2">
            <div className="font-bold text-black">{site.name}</div>
            <div className="text-gray-700">{site.type} • {site.area}</div>
            <div className="text-gray-600">{site.dressCode}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MedicalClinicsWidget() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 border border-red-200">
      <h3 className="font-black text-black mb-3 flex items-center gap-2 text-sm"><Stethoscope className="w-4 h-4 text-red-500" />Medical Clinics</h3>
      <div className="space-y-2 max-h-48 overflow-auto text-black">
        {medicalClinics.map((clinic, i) => (
          <div key={i} className="text-xs border-b border-gray-200 pb-2">
            <div className="font-bold text-black">{clinic.name}</div>
            <div className="text-gray-700">{clinic.area} • {clinic.phone}</div>
            <div className="text-gray-600">{clinic.emergency ? "🚨 Emergency 24/7" : "Clinic"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NightlifeWidget() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg mb-4 border border-purple-200">
      <h3 className="font-black text-black mb-3 flex items-center gap-2 text-sm"><PartyPopper className="w-4 h-4 text-purple-500" />Nightlife</h3>
      <div className="space-y-2 max-h-48 overflow-auto text-black">
        {nightlifePlaces.slice(0, 6).map((place, i) => (
          <div key={i} className="text-xs border-b border-gray-200 pb-2">
            <div className="font-bold text-black">{place.name}</div>
            <div className="text-gray-700">{place.type} • {place.area}</div>
            <div className="text-gray-600">{place.hours}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AskAM38Widget() {
  const [message, setMessage] = useState("");
  const handleAsk = () => {
    if (message.trim()) {
      window.open(`https://wa.me/23058357166?text=${encodeURIComponent(`AM38 Explore Help: ${message}`)}`, "_blank");
      toast.success("Redirecting to WhatsApp...");
    } else {
      toast.error("Please type your question");
    }
  };
  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-4 shadow-lg mb-4">
      <h3 className="font-black text-white mb-2 flex items-center gap-2 text-sm"><MessageCircle className="w-4 h-4" />Need Help? Ask AM38</h3>
      <p className="text-white/90 text-xs mb-2">Hiking guide? Lost? Need directions?</p>
      <div className="flex gap-2">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your question..." className="flex-1 px-3 py-2 rounded-xl text-xs text-black bg-white placeholder-gray-400" />
        <button onClick={handleAsk} className="bg-white text-red-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-100">Send</button>
      </div>
    </div>
  );
}

// ==================== MAP COMPONENT USING LEAFLET ====================
function MauritiusMap({ places: mapPlaces, onPlaceClick }: { places: Place[], onPlaceClick: (place: Place) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([-20.300, 57.500], 10);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    const markers: L.Marker[] = [];
    mapPlaces.forEach(place => {
      let color = '#3388ff';
      if (place.category === 'beach') color = '#1a73e8';
      else if (place.category === 'mountain') color = '#00a651';
      else if (place.category === 'hospital') color = '#ef4444';
      else if (place.category === 'hotel') color = '#8b5cf6';
      else if (place.category === 'restaurant') color = '#f97316';
      else if (place.category === 'fuel') color = '#6b7280';
      else if (place.category === 'monument') color = '#8b4513';
      else if (place.category === 'city') color = '#eab308';
      else if (place.category === 'nature') color = '#22c55e';
      else if (place.category === 'activities') color = '#ec4899';
      else if (place.category === 'police') color = '#3b82f6';
      else if (place.category === 'religious') color = '#a855f7';
      else if (place.category === 'market') color = '#f59e0b';
      else if (place.category === 'nightlife') color = '#d946ef';

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:12px;color:white;font-weight:bold;">📍</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      });

      const marker = L.marker([place.lat, place.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="padding:8px;max-width:220px;font-family:Arial,sans-serif;">
            <h4 style="font-weight:bold;font-size:14px;margin:0 0 4px 0;color:#1a1a1a;">${place.name}</h4>
            <p style="font-size:11px;margin:0 0 4px 0;color:#555;">${place.area} • ${place.category}</p>
            <p style="font-size:10px;margin:0 0 6px 0;color:#777;">${place.address}</p>
            <button onclick="window.__openPlaceDetail(${place.id})" style="background:#ef4444;color:white;border:none;padding:4px 10px;border-radius:6px;font-weight:bold;font-size:10px;cursor:pointer;">View Details</button>
          </div>
        `);

      marker.on('click', () => {
        onPlaceClick(place);
      });

      markers.push(marker);
    });
    markersRef.current = markers;

    return () => {
      markers.forEach(m => m.remove());
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapPlaces, onPlaceClick]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const map = mapInstanceRef.current;
    mapPlaces.forEach(place => {
      let color = '#3388ff';
      if (place.category === 'beach') color = '#1a73e8';
      else if (place.category === 'mountain') color = '#00a651';
      else if (place.category === 'hospital') color = '#ef4444';
      else if (place.category === 'hotel') color = '#8b5cf6';
      else if (place.category === 'restaurant') color = '#f97316';
      else if (place.category === 'fuel') color = '#6b7280';
      else if (place.category === 'monument') color = '#8b4513';
      else if (place.category === 'city') color = '#eab308';
      else if (place.category === 'nature') color = '#22c55e';
      else if (place.category === 'activities') color = '#ec4899';
      else if (place.category === 'police') color = '#3b82f6';
      else if (place.category === 'religious') color = '#a855f7';
      else if (place.category === 'market') color = '#f59e0b';
      else if (place.category === 'nightlife') color = '#d946ef';

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:12px;color:white;font-weight:bold;">📍</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      });

      const marker = L.marker([place.lat, place.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="padding:8px;max-width:220px;font-family:Arial,sans-serif;">
            <h4 style="font-weight:bold;font-size:14px;margin:0 0 4px 0;color:#1a1a1a;">${place.name}</h4>
            <p style="font-size:11px;margin:0 0 4px 0;color:#555;">${place.area} • ${place.category}</p>
            <p style="font-size:10px;margin:0 0 6px 0;color:#777;">${place.address}</p>
            <button onclick="window.__openPlaceDetail(${place.id})" style="background:#ef4444;color:white;border:none;padding:4px 10px;border-radius:6px;font-weight:bold;font-size:10px;cursor:pointer;">View Details</button>
          </div>
        `);

      marker.on('click', () => {
        onPlaceClick(place);
      });

      markersRef.current.push(marker);
    });
  }, [mapPlaces, onPlaceClick]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__openPlaceDetail = (id: number) => {
        const place = mapPlaces.find(p => p.id === id);
        if (place) {
          onPlaceClick(place);
        }
      };
    }
  }, [mapPlaces, onPlaceClick]);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span className="font-bold">Mauritius Interactive Map</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-white/20 px-2 py-1 rounded-full">{mapPlaces.length} places</span>
          <button 
            onClick={() => window.open('https://www.google.com/maps/@-20.300,57.500,10z', '_blank')}
            className="bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition font-bold text-xs"
          >
            Open Google Maps →
          </button>
        </div>
      </div>
      <div ref={mapRef} className="w-full h-[500px] md:h-[600px] bg-gray-100" />
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-full" style={{backgroundColor:'#1a73e8'}}></span> Beach</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-full" style={{backgroundColor:'#00a651'}}></span> Mountain</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-full" style={{backgroundColor:'#ef4444'}}></span> Hospital</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-full" style={{backgroundColor:'#8b5cf6'}}></span> Hotel</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-full" style={{backgroundColor:'#f97316'}}></span> Restaurant</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-full" style={{backgroundColor:'#6b7280'}}></span> Fuel</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-full" style={{backgroundColor:'#eab308'}}></span> City</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-full" style={{backgroundColor:'#a855f7'}}></span> Religious</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-full" style={{backgroundColor:'#d946ef'}}></span> Nightlife</span>
        <span className="ml-auto text-gray-500">Click any pin for details</span>
      </div>
    </div>
  );
}

export default function Explore() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [tripPlaces, setTripPlaces] = useState<Place[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [savedTrips, setSavedTrips] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("explore_trips");
    if (saved) setSavedTrips(JSON.parse(saved));
  }, []);

  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || place.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const addToTrip = (place: Place) => {
    if (!tripPlaces.some(p => p.id === place.id)) {
      setTripPlaces([...tripPlaces, place]);
      toast.success(`${place.name} added to your trip!`);
    } else {
      toast.error(`${place.name} already in your trip`);
    }
  };

  const removeFromTrip = (id: number) => {
    setTripPlaces(tripPlaces.filter(p => p.id !== id));
    toast.success("Place removed from trip");
  };

  const saveTrip = () => {
    if (!isAuthenticated) {
      toast.error("Please login to save your trip");
      navigate("/login");
      return;
    }
    const newTrip = { id: Date.now(), places: tripPlaces, date: new Date().toISOString(), userId: user?.id };
    const updated = [...savedTrips, newTrip];
    setSavedTrips(updated);
    localStorage.setItem("explore_trips", JSON.stringify(updated));
    toast.success("Trip saved!");
  };

  const bookTrip = () => {
    const params = new URLSearchParams();
    params.set("places", tripPlaces.map(p => p.name).join(","));
    navigate(`/cars?${params.toString()}`);
  };

  const shareViaWhatsApp = () => {
    const message = `🚗 MY MAURITIUS TRIP PLAN 🚗\n\n${tripPlaces.map((p, i) => `${i+1}. 📍 ${p.name} (${p.area})`).join("\n")}\n\n🚘 Book your car with AM38!\n📞 +230 5835 7166\n💻 am38.com`;
    window.open(`https://wa.me/23058357166?text=${encodeURIComponent(message)}`, "_blank");
  };

  const openInGoogleMaps = (place: Place) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}&query_place_id=${encodeURIComponent(place.name)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949] pb-32">
      
      {/* Hero */}
      <div className="relative overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-r from-[#11265f] via-[#20366f] to-[#8b2638]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 mb-3"><Sparkles className="w-3.5 h-3.5 text-yellow-400" /><span className="text-white text-xs font-bold">Discover Mauritius</span></div>
          <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg">Explore Paradise Island</h1>
          <p className="mt-3 text-base text-white/90 max-w-2xl mx-auto">{places.length}+ beaches, mountains, monuments, hotels, restaurants, nightlife, and activities across Mauritius</p>
          <button 
            onClick={() => window.open('https://www.google.com/maps/@-20.300,57.500,10z', '_blank')}
            className="mt-4 bg-white/20 backdrop-blur text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-white/30 transition inline-flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" /> Open Full Google Maps
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search beaches, mountains, hotels, markets, religious sites, medical clinics, nightlife..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-black text-sm shadow" />
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-1.5 pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${selectedCategory === cat.id ? "bg-red-600 text-white shadow" : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"}`}>
              <cat.icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile Emergency Toggle */}
        <button onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="lg:hidden w-full mb-4 bg-red-600 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2"><AlertTriangle className="w-4 h-4" />Emergency & Info</button>
        
        {showMobileSidebar && (
          <div className="lg:hidden mb-4">
            <EmergencySidebar />
            <WeatherWidget />
            <PublicHolidaysWidget />
            <LocalMarketWidget />
            <ReligiousSitesWidget />
            <MedicalClinicsWidget />
            <NightlifeWidget />
            <AskAM38Widget />
          </div>
        )}

        {/* Desktop Sidebar - with bottom padding to not merge with footer */}
        <div className="hidden lg:block fixed left-4 top-40 w-72 z-40 max-h-[calc(100vh-12rem)] overflow-auto pb-8">
          <EmergencySidebar />
          <WeatherWidget />
          <PublicHolidaysWidget />
          <LocalMarketWidget />
          <ReligiousSitesWidget />
          <MedicalClinicsWidget />
          <NightlifeWidget />
          <AskAM38Widget />
        </div>

        {/* Main Content */}
        <div className="lg:mx-auto lg:max-w-5xl">
          {/* Map */}
          <div className="mb-6">
            <MauritiusMap places={filteredPlaces} onPlaceClick={(place) => setSelectedPlace(place)} />
          </div>

          {/* Places Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {filteredPlaces.map((place, idx) => (
              <motion.div key={place.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (idx % 10) * 0.02 }} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-all cursor-pointer group" onClick={() => setSelectedPlace(place)}>
                <div className="relative h-36 overflow-hidden">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?w=600"; }} />
                  <div className="absolute top-2 right-2 bg-black/60 rounded-full px-1.5 py-0.5 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" /><span className="text-white text-[10px] font-bold">{place.rating}</span></div>
                  <div className="absolute bottom-2 left-2 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full capitalize">{place.category}</div>
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">{place.area}</div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-base text-black mb-0.5">{place.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-[10px] mb-1"><MapPin className="w-2.5 h-2.5" />{place.area}<span className="mx-0.5">•</span><Car className="w-2.5 h-2.5" />{place.distance}km</div>
                  <p className="text-gray-600 text-xs mb-1 line-clamp-2">{place.description.substring(0, 80)}...</p>
                  {place.phone && <div className="text-[10px] font-bold text-blue-600 flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{place.phone}</div>}
                  {place.entryFee && place.entryFee > 0 && <div className="text-[10px] text-green-600 mt-1">Entry: Rs {place.entryFee}</div>}
                  <button 
                    onClick={(e) => { e.stopPropagation(); openInGoogleMaps(place); }}
                    className="mt-2 text-[10px] bg-blue-600 text-white px-2 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-blue-700 transition"
                  >
                    <MapPin className="w-2.5 h-2.5" /> Open in Google Maps
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trip Planner Bottom Bar */}
        <AnimatePresence>
          {tripPlaces.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-xl bg-white rounded-xl shadow-2xl p-3 border z-50">
              <h2 className="text-sm font-black text-black mb-2 flex items-center gap-2"><Compass className="w-4 h-4 text-red-600" />My Trip ({tripPlaces.length})</h2>
              <div className="flex flex-wrap gap-1 mb-2 max-h-16 overflow-auto">
                {tripPlaces.map(place => (<div key={place.id} className="flex items-center gap-0.5 bg-gray-100 rounded-full px-2 py-0.5 text-[10px]"><span className="font-medium text-black">{place.name}</span><button onClick={() => removeFromTrip(place.id)} className="text-red-500 ml-0.5"><X className="w-2.5 h-2.5" /></button></div>))}
              </div>
              <div className="flex gap-2">
                <button onClick={saveTrip} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><Bookmark className="w-3 h-3" /> Save</button>
                <button onClick={bookTrip} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><Car className="w-3 h-3" /> Book Car</button>
                <button onClick={shareViaWhatsApp} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><MessageCircle className="w-3 h-3" /> Share</button>
                <button onClick={() => setShowQR(true)} className="px-3 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold"><QrCode className="w-3 h-3" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Modal */}
        <AnimatePresence>
          {showQR && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-[100] p-4" onClick={() => setShowQR(false)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-5 max-w-xs w-full text-center" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-3"><h3 className="font-bold text-lg text-black">Unique Trip QR Code</h3><button onClick={() => setShowQR(false)}><X className="w-5 h-5" /></button></div>
                <div className="bg-gray-100 rounded-xl p-3 inline-block mx-auto mb-3"><div className="w-36 h-36 bg-white flex items-center justify-center rounded border"><QrCode className="w-24 h-24 text-gray-800" /></div></div>
                <p className="text-xs text-gray-500 mb-3">Scan this unique QR code on mobile to access your personalized itinerary</p>
                <p className="text-[10px] text-gray-400 mb-3">Your trip ID: {user?.id ? `AM38-${user.id}` : "GUEST-" + Date.now()}</p>
                <button onClick={() => setShowQR(false)} className="w-full bg-red-600 text-white py-2 rounded-xl font-bold text-sm">Close</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Place Details Modal */}
        <AnimatePresence>
          {selectedPlace && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-[100] p-4" onClick={() => setSelectedPlace(null)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl max-w-md w-full overflow-hidden max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-44 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-bold text-black mb-0.5">{selectedPlace.name}</h2>
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><MapPin className="w-3 h-3" />{selectedPlace.area}</div>
                  <div className="flex items-center gap-2 mb-2"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /><span className="font-medium text-black text-sm">{selectedPlace.rating}</span><span className="text-gray-400 text-xs">•</span><Car className="w-3 h-3 text-gray-400" /><span className="text-xs">{selectedPlace.distance} km from airport</span></div>
                  <p className="text-gray-600 text-xs mb-2">{selectedPlace.description}</p>
                  <div className="mb-1 text-xs"><span className="font-semibold text-black">Address:</span> <span className="text-gray-700">{selectedPlace.address}</span></div>
                  {selectedPlace.bestTime && <div className="mb-1 text-xs"><span className="font-semibold text-black">Best time:</span> <span className="text-gray-700">{selectedPlace.bestTime}</span></div>}
                  {selectedPlace.openingHours && <div className="mb-1 text-xs flex items-center gap-1 text-gray-700"><Clock className="w-3 h-3" />{selectedPlace.openingHours}</div>}
                  {selectedPlace.phone && <div className="mb-2 text-xs flex items-center gap-1 font-bold"><Phone className="w-3 h-3 text-blue-600" /><span className="text-blue-600">{selectedPlace.phone}</span></div>}
                  {selectedPlace.price && selectedPlace.price > 0 && <div className="mb-2 text-xs"><span className="font-semibold text-black">Price:</span> <span className="text-gray-700">Rs {selectedPlace.price}</span></div>}
                  {selectedPlace.whatToWear && <div className="mb-2 text-xs"><span className="font-semibold text-black">What to wear:</span> <span className="text-gray-700">{selectedPlace.whatToWear}</span></div>}
                  {selectedPlace.tips && <div className="mb-2 text-xs"><span className="font-semibold text-black">Tips:</span> <span className="text-gray-700">{selectedPlace.tips}</span></div>}
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={() => openInGoogleMaps(selectedPlace)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <MapPin className="w-3 h-3" /> Open in Google Maps
                    </button>
                    <button onClick={() => { addToTrip(selectedPlace); setSelectedPlace(null); }} className="flex-1 bg-red-600 text-white py-2 rounded-xl font-bold text-xs">Add to Trip</button>
                    <button onClick={() => setSelectedPlace(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs">Close</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}