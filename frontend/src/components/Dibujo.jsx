import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import { Undo, Redo, Delete } from "@mui/icons-material";
import { crearDibujo } from "../services/api";
import { useNavigate } from "react-router-dom";

function Dibujo({ dibujo, onEliminar }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [color, setColor] = useState("#000000");
  const [titulo, setTitulo] = useState(dibujo?.titulo || "");
  const [descripcion, setDescripcion] = useState(dibujo?.descripcion || "");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.6;
      const context = canvas.getContext("2d");
      setCtx(context);

      // Cargar el dibujo existente en el canvas si se proporciona
      if (dibujo && dibujo.contenido) {
        const img = new Image();
        img.src = `data:image/png;base64,${dibujo.contenido}`;
        img.onload = () => {
          if (ctx) {
            // Asegurarse de que ctx esté definido antes de dibujar
            ctx.drawImage(img, 0, 0);
          }
        };
      }
    }
  }, [dibujo, ctx]); // Volver a dibujar si el dibujo cambia

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (!ctx) return;

    ctx.lineTo(e.clientX - canvasRef.current.offsetLeft, e.clientY - canvasRef.current.offsetTop);
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctx.beginPath();

    if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== canvasRef.current.toDataURL()) {
      setUndoStack([...undoStack, canvasRef.current.toDataURL()]);
      setRedoStack([]);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 1) {
      const newUndoStack = undoStack.slice(0, -1);
      const poppedItem = undoStack.pop();
      setRedoStack([poppedItem, ...redoStack]);
      setUndoStack(newUndoStack);
      const img = new Image();
      img.src = newUndoStack[newUndoStack.length - 1];
      img.onload = () => ctx.drawImage(img, 0, 0);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const poppedItem = redoStack.shift();
      setUndoStack([...undoStack, poppedItem]);
      const img = new Image();
      img.src = poppedItem;
      img.onload = () => ctx.drawImage(img, 0, 0);
    }
  };

  const handleClear = () => {
    if (ctx) {
      // Asegurarse de que ctx esté definido antes de borrar
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setUndoStack([]);
    setRedoStack([]);
  };

  const handleGuardar = async () => {
    const dataURL = canvasRef.current.toDataURL("image/png");

    try {
      await crearDibujo({ titulo, descripcion, contenido: dataURL.split(",")[1] });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.error); // Mostrar mensaje de error del backend
      } else {
        console.error("Error al guardar dibujo:", error);
        setError("Error al guardar el dibujo");
      }
    }
  };

  const handleChangeColor = (event) => {
    setColor(event.target.value);
  };

  return (
    <Box sx={{ height: "100%", display: "flex" }}>
      {dibujo ? (
        <Card sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", m: 1 }}>
          {dibujo.contenido && (
            <CardMedia
              component="img"
              sx={{ height: 250, objectFit: "contain" }}
              image={`data:image/png;base64,${dibujo.contenido}`}
              alt={dibujo?.titulo || "Nuevo dibujo"}
            />
          )}
          <CardContent sx={{ flexGrow: 1, padding: "16px" }}>
            <Typography gutterBottom variant="h5" component="div" align="center">
              {dibujo.titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {dibujo.descripcion}
            </Typography>
          </CardContent>
          <CardActions sx={{ alignSelf: "center" }}>
            <Button size="small" color="error" onClick={() => onEliminar(dibujo.id)}>
              Eliminar
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4, width: "100%" }}>
          <Typography variant="h4" sx={{ color: "#003366", mb: 2 }}>
            Crear Nuevo Dibujo
          </Typography>
          <Box sx={{ border: "2px solid #003366", p: 2, mb: 2, width: "80%", display: "flex", justifyContent: "center" }}>
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={{ cursor: "crosshair", width: "100%" }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-around", width: "80%", mt: 2 }}>
            <IconButton onClick={handleUndo} disabled={undoStack.length <= 1}>
              <Undo />
            </IconButton>
            <IconButton onClick={handleRedo} disabled={redoStack.length === 0}>
              <Redo />
            </IconButton>
            <IconButton onClick={handleClear}>
              <Delete />
            </IconButton>
            <FormControl>
              <InputLabel htmlFor="color-picker">Color</InputLabel>
              <input type="color" id="color-picker" value={color} onChange={handleChangeColor} />
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80%", mt: 2 }}>
            <TextField label="Título" variant="outlined" fullWidth value={titulo} onChange={(e) => setTitulo(e.target.value)} sx={{ mb: 2 }} />
            <TextField
              label="Descripción"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>

          <Button variant="contained" color="primary" onClick={handleGuardar} sx={{ mt: 2 }}>
            Guardar
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      )}
    </Box>
  );
}

export default Dibujo;
