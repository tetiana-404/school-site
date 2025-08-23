import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  List,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { FaEdit, FaSave, FaTimes, FaTrash, FaPlus } from "react-icons/fa";
import TextEditor from "../TextEditor";

const FinancePage = ({ user }) => {
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newYear, setNewYear] = useState("");

  // Завантаження секцій з бекенду
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/finance`);
        const data = await res.json();
        const sorted = Array.isArray(data) ? data.sort((a, b) => b.year - a.year) : [];
        setSections(sorted);
        if (sorted.length > 0) setActiveSection(sorted[0].id);
      } catch (err) {
        console.error("❌ Failed to fetch finance sections:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  const currentSection = sections.find((s) => s.id === activeSection);

  // Збереження контенту
  const handleSave = async () => {
    if (!currentSection) return;

    try {
      let updatedSection;
      if (currentSection.id) {
        // Оновлення існуючої секції
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/finance/${currentSection.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentSection),
          }
        );
        updatedSection = await res.json();
      } else {
        // Створення нової секції
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/finance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentSection),
        });
        updatedSection = await res.json();
      }

      setSections((prev) =>
        prev
          .map((s) => (s.id === updatedSection.id ? updatedSection : s))
          .concat(!prev.find((s) => s.id === updatedSection.id) ? [updatedSection] : [])
          .sort((a, b) => b.year - a.year)
      );
      setActiveSection(updatedSection.id);
      setEditMode(false);
    } catch (err) {
      console.error("Помилка збереження:", err);
    }
  };

  // Видалення року
  const handleDelete = async (id) => {
    if (!window.confirm("Видалити цей рік?")) return;
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/finance/${id}`, { method: "DELETE" });
      const updated = sections.filter((s) => s.id !== id);
      setSections(updated);
      if (activeSection === id) setActiveSection(updated[0]?.id || null);
    } catch (err) {
      console.error("Помилка видалення:", err);
    }
  };

  // Додавання нового року
  const handleAddYear = async () => {
    if (!newYear) return;
    const yearInt = parseInt(newYear);
    if (isNaN(yearInt)) return;

    const newSection = {
      year: yearInt,
      title: `${yearInt} рік`,
      content: "",
    };

    // Одразу додаємо локально, потім синхронізуємо з бекендом
    setSections((prev) => [newSection, ...prev].sort((a, b) => b.year - a.year));
    setActiveSection(null); // тимчасово, щоб редактор оновився
    setTimeout(() => setActiveSection(newSection.id), 0);
    setEditMode(true);
    setNewYear("");

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/finance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSection),
      });
      const savedSection = await res.json();
      setSections((prev) =>
        prev
          .map((s) => (s === newSection ? savedSection : s))
          .sort((a, b) => b.year - a.year)
      );
      setActiveSection(savedSection.id);
    } catch (err) {
      console.error("Помилка створення року:", err);
    }
  };

  return (
    <Container>
      <Box display="flex" gap={4} mt={4} mb={4}>
        {/* Ліва частина (контент) */}
        <Box flex={3}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Card sx={{ boxShadow: 3, position: "relative" }}>
              {user?.role === "admin" && currentSection && (
                <Tooltip title="Редагувати">
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "primary.main",
                      backgroundColor: "white",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                    onClick={() => setEditMode(true)}
                  >
                    <FaEdit size={20} />
                  </IconButton>
                </Tooltip>
              )}
              <CardContent>
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  align="center"
                  color="primary"
                >
                  {currentSection
                    ? currentSection.title || `${currentSection.year} рік`
                    : "Секція не вибрана"}
                </Typography>

                {editMode && currentSection ? (
                  <>
                    <TextEditor
                      content={currentSection.content || ""}
                      setContent={(newContent) =>
                        setSections((prev) =>
                          prev.map((s) =>
                            s.id === currentSection.id ? { ...s, content: newContent } : s
                          )
                        )
                      }
                    />
                    <Box display="flex" gap={2} mt={2}>
                      <IconButton
                        sx={{ color: "success.main", backgroundColor: "white" }}
                        onClick={handleSave}
                      >
                        <FaSave />
                      </IconButton>
                      <IconButton
                        sx={{ color: "error.main", backgroundColor: "white" }}
                        onClick={() => setEditMode(false)}
                      >
                        <FaTimes />
                      </IconButton>
                    </Box>
                  </>
                ) : currentSection ? (
                  <div
                    style={{
                      backgroundColor: "#f9f9f9",
                      padding: "1rem",
                      borderRadius: "8px",
                    }}
                    dangerouslySetInnerHTML={{ __html: currentSection.content }}
                  />
                ) : (
                  <Typography>Виберіть рік для перегляду</Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Права частина (список років) */}
        <Box flex={1} sx={{ maxWidth: "250px" }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Роки
          </Typography>

          

          <List>
            {sections
              .sort((a, b) => b.year - a.year)
              .map((s) => (
                <ListItemButton
                  key={s.id || s.year}
                  selected={activeSection === s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    setEditMode(false);
                  }}
                >
                  <ListItemText primary={s.title || `${s.year} рік`} />
                  {user?.role === "admin" && s.id && (
                    <IconButton
                      sx={{ ml: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(s.id);
                      }}
                    >
                      <FaTrash />
                    </IconButton>
                  )}
                </ListItemButton>
              ))}
          </List>
              {user?.role === "admin" && (
            <Box display="flex" gap={1} mb={2}>
              <TextField
                size="small"
                label="Додати рік"
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
              />
              <IconButton color="primary" onClick={handleAddYear}>
                <FaPlus />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default FinancePage;
