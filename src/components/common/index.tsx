import React, { ReactNode } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useAppStyles } from "../../theme/hooks";

export const PageContainer: React.FC<{
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}> = ({ children, maxWidth = "lg" }) => {
  const styles = useAppStyles();

  return (
    <Box sx={styles.pageContainer}>
      <Container maxWidth={maxWidth}>{children}</Container>
    </Box>
  );
};

export const GlassPanel: React.FC<{
  children: ReactNode;
  sx?: object;
}> = ({ children, sx = {} }) => {
  const styles = useAppStyles();

  return <Box sx={{ ...styles.glassPanel, ...sx }}>{children}</Box>;
};

export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
}> = ({ title, subtitle }) => {
  const styles = useAppStyles();
  const theme = useTheme();

  return (
    <Box sx={{ color: theme.palette.common.white, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={styles.pageTitle}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={styles.pageSubtitle}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export const SectionHeader: React.FC<{
  title: string;
  action?: ReactNode;
}> = ({ title, action }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h6" sx={{ color: theme.palette.common.white }}>
        {title}
      </Typography>
      {action}
    </Box>
  );
};

export const LoadingState: React.FC<{
  message?: string;
}> = ({ message = "Loading..." }) => {
  const styles = useAppStyles();
  const theme = useTheme();

  return (
    <Box sx={styles.loadingContainer}>
      <CircularProgress sx={{ color: theme.palette.common.white, mb: 2 }} />
      <Typography sx={{ color: theme.palette.common.white }}>
        {message}
      </Typography>
    </Box>
  );
};

export const PrimaryButton: React.FC<{
  children: ReactNode;
  onClick?: () => void;
  sx?: object;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
}> = ({ children, onClick, sx = {}, ...props }) => {
  const styles = useAppStyles();

  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{ ...styles.primaryButton, ...sx }}
      {...props}
    >
      {children}
    </Button>
  );
};

export const OutlinedButton: React.FC<{
  children: ReactNode;
  onClick?: () => void;
  sx?: object;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
}> = ({ children, onClick, sx = {}, ...props }) => {
  const styles = useAppStyles();

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      sx={{ ...styles.outlinedButton, ...sx }}
      {...props}
    >
      {children}
    </Button>
  );
};

export const EmptyState: React.FC<{
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}> = ({
  message,
  icon,
  action,
  title,
  description = message, // Use message as fallback
  buttonText,
  onButtonClick,
}) => {
  const theme = useTheme();

  const IconComponent =
    icon && React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement, {
          sx: {
            fontSize: 60,
            color: alpha(theme.palette.common.white, 0.3),
            mb: 2,
            ...(React.isValidElement(icon) ? (icon as any).props.sx : {}),
          },
        })
      : null;

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 6,
        px: 2,
        backgroundColor: alpha(theme.palette.common.black, 0.2),
        borderRadius: 2,
        border: `1px dashed ${alpha(theme.palette.common.white, 0.2)}`,
      }}
    >
      {IconComponent ||
        (icon && (
          <Box sx={{ mb: 2, color: alpha(theme.palette.common.white, 0.5) }}>
            {icon}
          </Box>
        ))}

      {title && (
        <Typography
          variant="h6"
          sx={{ color: theme.palette.common.white, mb: 1 }}
        >
          {title}
        </Typography>
      )}

      <Typography sx={{ color: alpha(theme.palette.common.white, 0.7), mb: 3 }}>
        {description}
      </Typography>

      {action ||
        (buttonText && onButtonClick && (
          <Button variant="contained" onClick={onButtonClick}>
            {buttonText}
          </Button>
        ))}
    </Box>
  );
};

export const TabPanel: React.FC<{
  children?: React.ReactNode;
  index: number;
  value: number;
  id: string;
}> = ({ children, value, index, id, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${id}-tabpanel-${index}`}
      aria-labelledby={`${id}-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const BackButton: React.FC<{
  onClick: () => void;
  label?: string;
}> = ({ onClick, label = "Back" }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", mb: 2 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onClick}
        sx={{
          color: theme.palette.common.white,
          "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.1),
          },
        }}
      >
        {label}
      </Button>
    </Box>
  );
};
