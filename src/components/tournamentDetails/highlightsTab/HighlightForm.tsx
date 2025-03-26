import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { HighlightFormData, Tournament } from "../../../types/event";
import { useTournamentHighlightsStyles } from "../../../theme/hooks";

interface HighlightFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: HighlightFormData) => void;
  tournament: Tournament;
}

const HighlightForm: React.FC<HighlightFormProps> = ({
  open,
  onClose,
  onSubmit,
  tournament,
}) => {
  const styles = useTournamentHighlightsStyles();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [selectedRound, setSelectedRound] = useState("");
  const [formErrors, setFormErrors] = useState({
    title: false,
    media: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMediaFile(null);
    setPreviewUrl(null);
    setMediaType("image");
    setSelectedRound("");
    setFormErrors({
      title: false,
      media: false,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files[0]) return;

    const file = files[0];
    const fileType = file.type.split("/")[0];

    if (fileType !== "image" && fileType !== "video") {
      setFormErrors((prev) => ({ ...prev, media: true }));
      return;
    }

    setMediaFile(file);
    setMediaType(fileType as "image" | "video");
    setFormErrors((prev) => ({ ...prev, media: false }));

    // Create a preview URL for the file
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    event.target.value = "";
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Clean up the object URL
    }
    setMediaFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = () => {
    const errors = {
      title: !title.trim(),
      media: false,
    };

    setFormErrors(errors);

    if (errors.title) {
      return;
    }

    let finalMediaType: "image" | "video" = "image";
    if (mediaFile) {
      const fileType = mediaFile.type.split("/")[0];
      finalMediaType = fileType === "video" ? "video" : "image";
    }

    const formData: HighlightFormData = {
      title,
      description: description || undefined,
      mediaType: finalMediaType,
      mediaFile: mediaFile || undefined,
      roundId: selectedRound || undefined,
    };

    onSubmit(formData);
    resetForm();
  };

  const renderPreview = () => {
    if (!previewUrl) return null;

    return (
      <Box sx={styles.previewContainer}>
        {mediaType === "image" ? (
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: 200,
              display: "block",
              margin: "0 auto",
            }}
          />
        ) : (
          <video
            src={previewUrl}
            controls
            style={{
              maxWidth: "100%",
              maxHeight: 200,
              display: "block",
              margin: "0 auto",
            }}
          />
        )}
        <IconButton
          size="small"
          onClick={handleRemoveFile}
          aria-label="Remove file"
          sx={styles.removeButton}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: styles.formDialog.paper }}
    >
      <DialogTitle sx={styles.formDialog.title}>Share a Highlight</DialogTitle>
      <DialogContent sx={styles.formDialog.content}>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={formErrors.title}
            helperText={formErrors.title ? "Title is required" : ""}
            sx={styles.formField}
          />

          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={styles.formField}
          />

          {!mediaFile ? (
            <Box sx={styles.uploadBox} onClick={handleFileInputClick}>
              <input
                type="file"
                accept="image/*,video/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <UploadIcon sx={styles.uploadIcon} />
              <Typography
                variant="subtitle1"
                sx={styles.uploadTitle}
                gutterBottom
              >
                Click to upload a photo or video
              </Typography>
              <Typography variant="body2" sx={styles.uploadSubtext}>
                Supports JPG, PNG, GIF, MP4, MOV, and other common formats
              </Typography>
              {formErrors.media && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={styles.uploadError}
                >
                  Please upload a valid image or video file
                </Typography>
              )}
            </Box>
          ) : (
            renderPreview()
          )}

          <FormControl fullWidth sx={styles.formField}>
            <InputLabel>Round</InputLabel>
            <Select
              value={selectedRound}
              label="Round"
              onChange={(e) => setSelectedRound(e.target.value)}
            >
              <MenuItem value="">
                <em>General (not round specific)</em>
              </MenuItem>
              {tournament.rounds.map((round) => (
                <MenuItem key={round.id} value={round.id}>
                  {round.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={styles.formDialog.actions}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HighlightForm;
