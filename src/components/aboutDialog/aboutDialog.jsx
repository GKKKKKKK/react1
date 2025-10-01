import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

export default function GlobalInfoDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ position: "fixed", top: 16, right: 16, zIndex: 2000 }}
      >
        Info
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Table Key</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            Here’s where you explain how to use the table, what the data means,
            and any extra context you want visitors to know.
          </Typography>
          <Typography variant="body2">
            You can add multiple sections, lists, or even images here.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
