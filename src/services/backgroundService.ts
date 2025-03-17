export interface BackgroundPreset {
  id: string;
  name: string;
  preview: string;
}

export interface BackgroundSettings {
  enabled: boolean;
  image: string;
}

// Sample background presets
const backgroundPresets: BackgroundPreset[] = [
  {
    id: "light-pattern",
    name: "Perfection",
    preview: "/images/background/background_2.jpg",
  },
  {
    id: "gradient-blue",
    name: "With friends",
    preview: "/images/background/background_3.jpeg",
  },
  {
    id: "subtle-gray",
    name: "Happy and Chubby",
    preview: "/images/background/background_4.webp",
  },
  {
    id: "king-pattern",
    name: "King",
    preview: "/images/background/background.jpg",
  },
  {
    id: "abstract-shapes",
    name: "Abstract Shapes",
    preview:
      "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=500&auto=format",
  },
  {
    id: "geometric",
    name: "Geometric",
    preview:
      "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=500&auto=format",
  },
  {
    id: "mountains",
    name: "Mountains",
    preview:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format",
  },
];

const BackgroundService = {
  getPresets: (): BackgroundPreset[] => {
    return backgroundPresets;
  },

  getBackgroundSettings: (): BackgroundSettings => {
    const settings = localStorage.getItem("backgroundSettings");
    if (settings) {
      return JSON.parse(settings);
    }

    return {
      enabled: false,
      image: backgroundPresets[0].preview,
    };
  },

  saveBackgroundSettings: (settings: BackgroundSettings): void => {
    localStorage.setItem("backgroundSettings", JSON.stringify(settings));
  },

  applyBackgroundSettings: (): void => {
    const settings = BackgroundService.getBackgroundSettings();

    if (settings.enabled && settings.image) {
      document.body.style.backgroundImage = `url(${settings.image})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundPosition = "center";
    } else {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "#f5f5f5";
    }
  },
};

export default BackgroundService;
