export interface PresentationTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  styles: {
    borderRadius: string;
    spacing: string;
    shadow: string;
  };
}

export const PRESENTATION_THEMES: Record<string, PresentationTheme> = {
  modern: {
    name: "Modern",
    colors: {
      primary: "hsl(210 40% 98%)",
      secondary: "hsl(210 40% 96%)",
      background: "hsl(0 0% 100%)",
      text: "hsl(222.2 84% 4.9%)",
      accent: "hsl(210 40% 2%)",
      muted: "hsl(210 40% 96%)",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    styles: {
      borderRadius: "0.5rem",
      spacing: "1rem",
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    },
  },
  classic: {
    name: "Classic",
    colors: {
      primary: "hsl(0 0% 7%)",
      secondary: "hsl(0 0% 11%)",
      background: "hsl(0 0% 98%)",
      text: "hsl(0 0% 9%)",
      accent: "hsl(0 72% 51%)",
      muted: "hsl(0 0% 96%)",
    },
    fonts: {
      heading: "Georgia, serif",
      body: "system-ui, sans-serif",
    },
    styles: {
      borderRadius: "0rem",
      spacing: "1.25rem",
      shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    },
  },
  minimal: {
    name: "Minimal",
    colors: {
      primary: "hsl(0 0% 100%)",
      secondary: "hsl(0 0% 97%)",
      background: "hsl(0 0% 100%)",
      text: "hsl(0 0% 3%)",
      accent: "hsl(0 0% 0%)",
      muted: "hsl(0 0% 0%)",
    },
    fonts: {
      heading: "system-ui, sans-serif",
      body: "system-ui, sans-serif",
    },
    styles: {
      borderRadius: "0rem",
      spacing: "2rem",
      shadow: "none",
    },
  },
  creative: {
    name: "Creative",
    colors: {
      primary: "hsl(262 83% 58%)",
      secondary: "hsl(262 83% 58% / 0.1)",
      background: "hsl(0 0% 100%)",
      text: "hsl(0 0% 9%)",
      accent: "hsl(262 83% 58%)",
      muted: "hsl(262 83% 58% / 0.05)",
    },
    fonts: {
      heading: "Poppins, sans-serif",
      body: "Poppins, sans-serif",
    },
    styles: {
      borderRadius: "1rem",
      spacing: "1.5rem",
      shadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    },
  },
  professional: {
    name: "Professional",
    colors: {
      primary: "hsl(210 71% 39%)",
      secondary: "hsl(210 71% 39% / 0.1)",
      background: "hsl(0 0% 100%)",
      text: "hsl(222.2 84% 4.9%)",
      accent: "hsl(210 71% 39%)",
      muted: "hsl(210 40% 96%)",
    },
    fonts: {
      heading: "Helvetica, Arial, sans-serif",
      body: "system-ui, sans-serif",
    },
    styles: {
      borderRadius: "0.25rem",
      spacing: "1rem",
      shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    },
  },
};

export function getTheme(themeName: string): PresentationTheme {
  return PRESENTATION_THEMES[themeName] || PRESENTATION_THEMES.modern;
}

export function applyThemeVariables(theme: PresentationTheme): React.CSSProperties {
  return {
    ...theme.styles,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.fonts.body,
  } as React.CSSProperties;
}