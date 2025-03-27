import React, { ReactNode } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  LinearProgress,
  alpha,
  useTheme,
} from "@mui/material";

export const GlassCard: React.FC<{
  children: ReactNode;
  sx?: object;
  hasBorder?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}> = ({ children, sx = {}, hasBorder = true, hoverable = false, onClick }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        backgroundColor: alpha(theme.palette.common.black, 0.4),
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        overflow: "hidden",
        height: "100%",
        border: hasBorder
          ? `1px solid ${alpha(theme.palette.common.white, 0.1)}`
          : "none",
        transition: hoverable ? "transform 0.2s, box-shadow 0.2s" : "none",
        "&:hover": hoverable
          ? {
              transform: "translateY(-4px)",
              boxShadow: `0 12px 20px ${alpha(
                theme.palette.common.black,
                0.3
              )}`,
            }
          : {},
        cursor: onClick ? "pointer" : "auto",
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};

export const CardContent: React.FC<{
  children: ReactNode;
  sx?: object;
}> = ({ children, sx = {} }) => {
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export const CardHeader: React.FC<{
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  color?: string;
  sx?: object;
}> = ({ title, icon, action, color, sx = {} }) => {
  const theme = useTheme();
  const headerColor = color || theme.palette.primary.main;

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        bgcolor: alpha(headerColor, 0.2),
        borderBottom: `1px solid ${alpha(headerColor, 0.3)}`,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: theme.palette.common.white, fontWeight: "bold" }}
        >
          {title}
        </Typography>
        {icon}
      </Box>
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  );
};

export const SectionDivider: React.FC<{
  sx?: object;
}> = ({ sx = {} }) => {
  const theme = useTheme();

  return (
    <Divider
      sx={{
        my: 1.5,
        borderColor: alpha(theme.palette.common.white, 0.1),
        ...sx,
      }}
    />
  );
};

export const ProgressBar: React.FC<{
  value: number;
  color?: string;
  height?: number;
  sx?: object;
}> = ({ value, color, height = 8, sx = {} }) => {
  const theme = useTheme();
  const barColor = color || theme.palette.primary.main;

  return (
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height,
        borderRadius: height / 2,
        backgroundColor: alpha(theme.palette.common.white, 0.1),
        "& .MuiLinearProgress-bar": {
          backgroundColor: barColor,
        },
        ...sx,
      }}
    />
  );
};

export const SectionContainer: React.FC<{
  children: ReactNode;
  sx?: object;
}> = ({ children, sx = {} }) => {
  return (
    <Box
      sx={{
        mb: 4,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export const ResponsiveGrid: React.FC<{
  children: ReactNode;
  spacing?: number;
  sx?: object;
}> = ({ children, spacing = 2, sx = {} }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: spacing,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export const MobileOnly: React.FC<{
  children: ReactNode;
  component?: React.ElementType;
  sx?: object;
}> = ({ children, component = Box, sx = {} }) => {
  const Component = component;

  return (
    <Component
      sx={{
        display: { xs: "block", sm: "none" },
        ...sx,
      }}
    >
      {children}
    </Component>
  );
};

export const DesktopOnly: React.FC<{
  children: ReactNode;
  component?: React.ElementType;
  sx?: object;
}> = ({ children, component = Box, sx = {} }) => {
  const Component = component;

  return (
    <Component
      sx={{
        display: { xs: "none", sm: "block" },
        ...sx,
      }}
    >
      {children}
    </Component>
  );
};

export const FlexBox: React.FC<{
  children: ReactNode;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  justify?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: number;
  sx?: object;
}> = ({
  children,
  direction = "row",
  align = "center",
  justify = "flex-start",
  wrap = "nowrap",
  gap = 0,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: direction },
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap,
        gap,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
