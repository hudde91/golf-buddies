export interface SplashPreset {
  id: string;
  name: string;
  imagePath: string;
  preview: string;
}

// Sample splash screen presets
export const splashPresets: SplashPreset[] = [
  {
    id: "default",
    name: "GolfBuddies",
    imagePath: "/images/splash/splashGolfBuddies.png",
    preview: "/images/splash/splashGolfBuddies.png",
  },
  {
    id: "default_old",
    name: "Nice golf image",
    imagePath: "/images/splash/splash.jpg",
    preview: "/images/splash/splash.jpg",
  },
  {
    id: "default blue",
    name: "Default Blue",
    imagePath: "/images/splash/blue-mountains.jpg",
    preview: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
  {
    id: "ocean",
    name: "Ocean View",
    imagePath: "/images/splash/ocean.jpg",
    preview: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    id: "forest",
    name: "Forest",
    imagePath: "/images/splash/forest.jpg",
    preview: "https://images.unsplash.com/photo-1476231682828-37e571bc172f",
  },
  {
    id: "cityscape",
    name: "City Night",
    imagePath: "/images/splash/city.jpg",
    preview: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
  },
  {
    id: "minimal",
    name: "Minimal",
    imagePath: "/images/splash/minimal.jpg",
    preview: "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b",
  },
];

const splashService = {
  getPresets: (): SplashPreset[] => {
    return splashPresets;
  },

  getSplashSettings: () => {
    const savedImage =
      localStorage.getItem("splashImage") || splashPresets[0].preview;
    const savedText = localStorage.getItem("splashText") || "";

    return {
      image: savedImage,
      text: savedText,
    };
  },

  saveSplashSettings: (image: string, text: string) => {
    localStorage.setItem("splashImage", image);
    localStorage.setItem("splashText", text);
  },
};

export default splashService;
