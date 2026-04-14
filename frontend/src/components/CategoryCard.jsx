import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, ArrowUpRight, Wrench, Zap, Hammer, Paintbrush, Wind, Tv, Droplets, Filter, Flame, Microwave, Utensils, Sparkles, Bath, ChefHat, Sofa, SquareStack, Bug, Flower2, Scissors, Hand, Activity, Dumbbell, Apple, Car, Bike, Droplet, CarFront, Camera, Video, UtensilsCrossed, PartyPopper, Music, Guitar, PersonStanding, Wand2, Calculator, FlaskConical, BookOpen, Music2, Palette, Code, Monitor, Laptop, Smartphone, Printer, Wifi, Download, BrickWall, Grid3x3, Shield, Layers, Home, ShieldCheck, Key, Dog, GraduationCap, HeartPulse, Baby, Shirt, Truck, Refrigerator, KeyRound } from "lucide-react";

const iconMap = {
  Wrench, Zap, Hammer, Paintbrush, Wind, Tv, Refrigerator, Droplets, Filter, Flame, Microwave,
  Utensils, Sparkles, Bath, ChefHat, Sofa, SquareStack, Bug, Flower2, Scissors, Hand, Activity,
  Dumbbell, Apple, Car, Bike, Droplet, CarFront, Camera, Video, UtensilsCrossed, PartyPopper,
  Music, Guitar, PersonStanding, Wand2, Calculator, FlaskConical, BookOpen, Music2, Palette, Code,
  Monitor, Laptop, Smartphone, Printer, Wifi, Download, BrickWall, Grid3x3, Shield, Layers, Home,
  ShieldCheck, Key, Dog, GraduationCap, HeartPulse, Baby, Shirt, Truck, KeyRound
};

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${encodeURIComponent(category.name)}`);
  };

  const IconComponent = iconMap[category.icon] || Wrench;

  return (
    <button
      type="button"
      className="category-card"
      onClick={handleClick}
    >
      <div className="category-icon">
        <IconComponent size={32} color={category.color || "#3B82F6"} />
      </div>
      <div className="category-name">{category.name}</div>
      <div className="category-count">
        <Briefcase size={12} style={{ marginRight: '4px' }} />
        {category.count || 0} providers
        <ArrowUpRight size={12} style={{ marginLeft: '4px', opacity: 0.5 }} />
      </div>
    </button>
  );
};

export default CategoryCard;

